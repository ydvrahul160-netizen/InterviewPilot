import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import axios from "axios";
import { ServerUrl } from "../App";
import { BsArrowRight } from "react-icons/bs";

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, UserName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  // const question = interviewData?.questions || [];

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionaRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // try known female voice first
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // try known male voices
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // --------------------------------------------- speak function----------------------------------------------
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // ADD natural pauses after commas and periods
      const humanText = text.replace(/,/g, ", ...").replace(/\./g, ". ...");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92; //slightly slower than normal
      utterance.pitch = 1.05; //small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (!isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${UserName}, it's great to meet you today. I hope you're feeling confident and ready.`,
        );
        await speakText(
          `I'll ask you a few questions, just answer naturally, and take your time. Let's begin. Good luck ${UserName}.`,
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        // if last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);
  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.result.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };
    recognitionaRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionaRef.current && !isAIPlaying) {
      try {
        recognitionaRef.current.start();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const stopMic = () => {
    if (recognitionaRef.current) {
      recognitionaRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (!isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    console.log("Submit clicked");
    console.log("Answer:", answer);
    console.log("Interview ID:", interviewId);
    console.log("Question Index:", currentIndex);

    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );
      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };
  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      await finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true },
      );
      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentIndex) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionaRef.current) {
        recognitionaRef.current.stop();
        recognitionaRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-teal-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-[90vw] h-[90vh] max-w-[1400px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
        {/* video section */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-5 space-y-6 border border-r border-gray-200">
          <div className="relative w-full max-w-md h-[300px] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />

            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  isAIPlaying ? "bg-green-400" : "bg-gray-300"
                }`}
              />

              <span className="text-xs font-medium text-white">
                AI Interviewer
              </span>
            </div>
          </div>
          {/* subtitle */}
          <div className="w-full max-w-md h-[90px]">
            <div className="w-full h-full flex items-center justify-center px-5">
              {subtitle ? (
                <p className="max-w-[90%] text-center text-sm leading-6 text-gray-600">
                  {subtitle}
                </p>
              ) : (
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-gray-300"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </div>
          </div>

          {/* timer Area */}
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Interview Status</span>
              {isAIPlaying && (
                <span className="text-sm font-semibold text-blue-600">
                  {isAIPlaying ? "AI Speaking" : ""}
                </span>
              )}
            </div>
            {/* divider line */}
            <div className="h-px bg-gray-200"></div>

            {/* timer */}
            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
            </div>

            {/* divider line */}
            <div className="h-px bg-gray-200"></div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <span className="text-2xl font-bold text-blue-500">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-400">Current Questions</span>
              </div>

              <div>
                <span className="text-2xl font-bold text-blue-500">
                  {questions.length}
                </span>
                <span className="text-xs text-gray-400">Total Questions</span>
              </div>
            </div>
          </div>
        </div>
        {/* text section */}
        <div className="flex-1 flex flex-col p-3 sm:p-5 md:p-7 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-5">
            AI Smart Interview
          </h2>

          <div className="relative mb-6 h-[140px] bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            {!isIntroPhase && currentQuestion ? (
              <>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">
                  Question {currentIndex + 1} of {questions.length}
                </p>

                <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed pr-16">
                  {currentQuestion.question}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">
                  AI is preparing your interview...
                </p>
              </div>
            )}
          </div>

          <textarea
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border
             border-gray-200 focus-ring-2 focus:ring-sky-500 transition text-gray-800"
          />
          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center
                rounded-full bg-black text-white"
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white
              py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-emerald-700 font-medium mb-4">{feedback}</p>
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-emerald-600 hover:opacity-90 transition flex items-center justify-center gap-1"
              >
                {currentIndex + 1 >= questions.length
                  ? "Finish Interview"
                  : "Next Question"}

                <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;
