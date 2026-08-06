import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.min.mjs";
import { askAi } from "../services/openRouter.services.js";

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
