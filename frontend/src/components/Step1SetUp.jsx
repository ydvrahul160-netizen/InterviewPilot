import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Step1SetUp = ({ onStart }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Store user's selected interview role (e.g. Frontend Developer, Backend Developer)
  const [role, setRole] = useState("");

  // Store candidate's experience level
  const [experience, setExperience] = useState("");

  // Store selected interview type (Technical or HR)
  const [mode, setMode] = useState("Technical");

  // Store uploaded resume file details
  // Initially null because user has not uploaded any file
  const [resumeFile, setResumeFile] = useState(null);

  // Manage loading state while processing resume or starting interview
  const [loading, setLoading] = useState(false);

  // Store extracted projects from resume
  const [projects, setProjects] = useState([]);

  // Store extracted skills from resume
  const [skills, setSkills] = useState([]);

  // Store complete resume text after PDF extraction
  const [resumeText, setResumeText] = useState("");

  // Track whether resume analysis is completed
  const [analysisDone, setAnalysisDone] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formData,
        { withCredentials: true },
      );

      console.log(result.data);

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true },
      );
      console.log(result.data);

      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }

      setLoading(false);
      onStart(result.data);
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Message:", error.response?.data?.message);

      alert(error.response?.data?.message || "Something went wrong");

      console.log(error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      // Initial animation state
      initial={{ opacity: 0 }}
      // Final animation state after component loads
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4"
    >
      {/* Main interview setup container */}
      <div className="  w-full max-w-5xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 ">
        {/* Left Section: Interview Features Information */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-blue-50 to-blue-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-5">
            Start Your AI Interview
          </h2>
          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence.
          </p>

          {/* Display interview benefits/features */}
          <data className="space-y-6">
            {[
              {
                icon: <FaUserTie className="text-blue-600 text-xl" />,
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt className="text-blue-600 text-xl" />,
                text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine className="text-blue-600 text-xl" />,
                text: "Performance Analytics",
              },
            ].map((Item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer"
              >
                {Item.icon}
                <span className="text-gray-700 font-medium">{Item.text}</span>
              </motion.div>
            ))}
          </data>
        </motion.div>

        {/* Right Section: User Interview Configuration */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-5">
            Interview Setup
          </h2>

          <div className="space-y-6 ">
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400" />
              {/* Input field for selecting job role */}
              <input
                type="text"
                placeholder="Enter role"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400" />
              {/* Input field for candidate experience */}
              <input
                type="text"
                placeholder="Experience"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            {/* Interview type selection */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {/* Resume upload section */}
            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                // Open file picker when user clicks upload box
                onClick={() => document.getElementById("resumeUpload").click()}
                className=" flex gap-2 flex-col items-center pb-3 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition rounded-xl "
              >
                <FaFileUpload className="text-3xl mx-auto text-blue-600 m-2" />

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  // Save uploaded resume file in state
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />

                {/* Show uploaded file name or default message */}
                <p className="text-gray-600 text-center font-medium">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload resume (optional)"}
                </p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition "
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 max-h-[250px] overflow-y-auto"
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Resume Analysis Result
                </h3>

                {projects.length > 0 && (
                  <div className="">
                    <p className="font-sm text-gray-700 mb-1">Projects:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-sm text-gray-700 mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full disabled:bg-gray-600 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md"
            >
              {loading ? "starting.." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step1SetUp;
