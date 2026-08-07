import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.min.mjs";
import { askAi } from "../services/openRouter.services.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";
import { error } from "console";

// Controller to analyze an uploaded resume PDF
export const analyzeResume = async (req, res) => {
  try {
    // Ensure a resume file was uploaded before processing.
    if (!req.file) {
      return res.status(400).json({
        message: "Resume required",
      });
    }

    // Get the uploaded PDF file path from Multer.
    const filepath = req.file.path;

    // Read the uploaded PDF as a binary buffer.
    // PDF.js requires binary data to parse the document.
    const fileBuffer = await fs.promises.readFile(filepath);

    // Convert the Node.js Buffer into Uint8Array.
    // PDF.js works with Uint8Array instead of Buffer.
    const uint8Array = new Uint8Array(fileBuffer);

    // Load the PDF document.
    const pdf = await pdfjsLib.getDocument({
      data: uint8Array,
    }).promise;

    // This variable will contain all extracted text
    // from every page of the resume.
    let resumeText = "";

    // Loop through every page of the PDF
    // and extract readable text.
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      // Get current page
      const page = await pdf.getPage(pageNum);

      // Extract text objects from the page
      const content = await page.getTextContent();

      // Combine all text items into one sentence.
      const pageText = content.items.map((item) => item.str).join(" ");

      // Append page text to the complete resume text.
      resumeText += pageText + "\n";
    }

    // Remove extra spaces and line breaks
    // to make the text cleaner for the AI model.
    resumeText = resumeText.replace(/\s+/g, " ").trim();

    // Prompt sent to the AI model.
    // The system message defines the expected JSON format,
    // while the user message contains the actual resume text.
    const messages = [
      {
        role: "system",
        content: ` 
          Extract structured data from the resume.

          Return ONLY valid JSON.

          {
           "role": "string",
           "experience": "string",
           "projects": ["project1", "project2"],
           "skills": ["skill1", "skill2"]
          }
        `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    // Send resume text to the AI service
    // and receive structured JSON data.
    const aiResponse = await askAi(messages);

    // Convert AI JSON string into a JavaScript object.
    const parsed = JSON.parse(aiResponse);

    // Delete the uploaded PDF after processing
    // to save server storage.
    fs.unlinkSync(filepath);

    // Send structured resume information
    // back to the frontend.
    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    // Log the error for debugging.
    console.error(error);

    // If an error occurs before deleting the file,
    // remove the uploaded file to avoid unused files.
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Return a server error response.
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res
        .status(400)
        .json({ message: "Role, Experience and Mode are required." });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.credits < 50) {
      return res
        .status(400)
        .json({ message: "Not enough credits. Minimum 50 required." });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
    Role:${role}
    Experience:${experience}
    Interview Mode:${mode}
    Projects:${projectText}
    Skills:${skillsText}
    Resume:${safeResume}
    `;

    if (!userPrompt.trim()) {
      return res.status(400).json({ message: "Prompt Content is empty" });
    }

    const message = [
      {
        role: "system",
        content: `
      You are a real human interviewer conducting a professional interview.

      Speak is simple, natural English as if you are directly talking to the candidate.

      Generate exactly 5 interview questions.

      Strict Rules:
      - Each Question must contain between 15 and 25 words.
      - Each Question must be a single and complete question.
      - Do Not number them.
      - Do Not add explanation.
      - Do Not add extra text before and after.
      - One question par line only.
      - keep language simple and conversational.
      - Question must feel practical and realistic.

      Difficulty Progression:
      Question 1 -> easy
      Question 2 -> easy
      Question 3 -> medium

      Question 4 -> medium
      Question 5 -> hard
      
      Make Questions based on the candidate's role, experience, interviewMode, projects, skills and resume details.
      `,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(message);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({ message: "AI  returned empty status" });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      return res
        .status(500)
        .json({ message: "AI failed to generate questions." });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 120, 120][index],
      })),
    });

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      UserName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to create interview ${error}` });
  }
};

export const submitAnswer = async (res, req) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);

    const question = interview.questions[questionIndex];

    // if no answer
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      return res.json({
        feedback: question.feedback,
      });
    }

    // if time exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not Evaluated. ";

      await interview.save();

      return res.json({
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "system",
        content: `
        You are a professional human interviewer evaluating a candidate's answer in a real interview.

        Evaluate naturally and fairly, like a real person would.

        Score the answer in these areas (0 to 10):

        1. Confidence -> Does the answer sound clear, confident, and well-presented?
        2. Communication -> Is the language simple, clear, and easy to understand?
        3. Correctness -> Is the answer accurate, relevant, and complete?

        Rules:
        - Be realistic and unbiased.
        - Do not give random high scores.
        - If the answer is weak, score low.
        - If the answer is strong and detailed, score high.
        - Consider clarity, structure, and relevance.

        Calculate:
        finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

        Feedback Rules:
        - Write natural human feedback.
        - 10 to 15 words only.
        - Sound like real interview feedback.
        - Can suggest improvement if needed.
        - Do NOT repeat the question.
        - Do NOT explain scoring.
        - Keep tone professional and honest.

        Return ONLY valid JSON in this format:

       {
        "confidence": number,
        "communication": number,
        "correctness": number,
        "finalScore": number,
        "feedback": "short human feedback"
       }
        `,
      },
      {
        role: "user",
        content: `
              Question: ${question.question}
              Answer: ${answer}
        `,
      },
    ];

    const aiResponse = await askAi(messages);

    const parsed = JSON.parse(aiResponse);

    question.answer = parsed.answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({ feedback: parsed.feedback });
  } catch (error) {
    return res
      .status(500)
      .join({ message: `failed to submit answer ${error}` });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(400).json({ message: "failed to find interview" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((e) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || 0,
        confidence: q.confidence || 0,
        communication: q.confidence || 0,
        correctness: q.correctness || 0,
      })),
    });

    return res.status(200).json({});
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to finish Interview ${error}` });
  }
};
