import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Step3Report = ({ report }) => {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }
  const navigate = useNavigate();

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  //***********************************--------- PDF Download Function ------- ************************************************/
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    //----------------------------------------------- BASIC PAGE SETTINGS -------------------------------------------------

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 20;

    //---------------------------------------- HEADER -----------------------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);

    doc.text("InterviewPilot", margin, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);

    doc.text("AI-Powered Mock Interview Platform", margin, currentY + 6);

    // Header line
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);

    doc.line(margin, currentY + 11, pageWidth - margin, currentY + 11);

    currentY += 25;

    //-------------------------------------------- REPORT TITLE -------------------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);

    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 7;

    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);

    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      currentY,
      {
        align: "center",
      },
    );

    currentY += 15;

    //------------------------------------------- FINAL SCORE CARD --------------------------------------------------

    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);

    doc.roundedRect(margin, currentY, contentWidth, 32, 5, 5, "FD");

    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    doc.text("OVERALL INTERVIEW SCORE", pageWidth / 2, currentY + 9, {
      align: "center",
    });

    // Score
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);

    doc.text(`${finalScore}/10`, pageWidth / 2, currentY + 24, {
      align: "center",
    });

    currentY += 42;

    //------------------------------------------- PERFORMANCE STATUS ------------------------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);

    doc.text("Performance Status", margin, currentY);

    currentY += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    const statusText = doc.splitTextToSize(performanceText, contentWidth);

    doc.text(statusText, margin, currentY);

    currentY += statusText.length * 5 + 10;

    //----------------------------------- SKILL EVALUATION --------------------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);

    doc.text("Skill Evaluation", margin, currentY);

    currentY += 9;

    // Helper function for skill bars
    const drawSkill = (label, value) => {
      // Skill name
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);

      doc.text(label, margin, currentY);

      // Score
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);

      doc.text(`${value}/10`, pageWidth - margin, currentY, {
        align: "right",
      });

      // Background bar
      doc.setFillColor(226, 232, 240);

      doc.roundedRect(margin, currentY + 3, contentWidth, 4, 2, 2, "F");

      // Progress bar
      doc.setFillColor(16, 185, 129);

      doc.roundedRect(
        margin,
        currentY + 3,
        (contentWidth * value) / 10,
        4,
        2,
        2,
        "F",
      );

      currentY += 15;
    };

    drawSkill("Confidence", confidence);
    drawSkill("Communication", communication);
    drawSkill("Correctness", correctness);

    currentY += 4;

    //-------------------------------------- PROFESSIONAL ADVICE ------------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);

    doc.text("Professional Advice", margin, currentY);

    currentY += 8;

    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 12);

    const adviceHeight = splitAdvice.length * 5 + 12;

    //------------------- Advice box ------------------
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);

    doc.roundedRect(margin, currentY, contentWidth, adviceHeight, 4, 4, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    doc.text(splitAdvice, margin + 6, currentY + 8);

    currentY += adviceHeight + 12;

    //--------------------------------- QUESTION BREAKDOWN TITLE -----------------------------------------

    // Check if enough space remains
    if (currentY > pageHeight - 45) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);

    doc.text("Question-wise Performance", margin, currentY);

    currentY += 8;

    // QUESTION TABLE

    autoTable(doc, {
      startY: currentY,

      margin: {
        left: margin,
        right: margin,
        top: 18,
        bottom: 18,
      },

      head: [["#", "Question", "Score", "AI Feedback"]],

      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question || "Question not available",
        `${q.score ?? 0}/10`,
        q.feedback || "No feedback available",
      ]),

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 4,
        valign: "top",
        textColor: [51, 65, 85],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },

      bodyStyles: {
        valign: "top",
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      columnStyles: {
        0: {
          cellWidth: 9,
          halign: "center",
        },

        1: {
          cellWidth: 52,
        },

        2: {
          cellWidth: 20,
          halign: "center",
          fontStyle: "bold",
        },

        3: {
          cellWidth: "auto",
        },
      },

      // Prevent awkward row splitting
      rowPageBreak: "avoid",

      // Repeat header automatically on new pages
      showHead: "everyPage",
    });

    //-------------- PAGE NUMBERS + FOOTER------------------

    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);

      doc.text("Generated by InterviewPilot", margin, pageHeight - 10);

      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        {
          align: "right",
        },
      );
    }

    // =====================================================
    // DOWNLOAD
    // =====================================================

    doc.save("InterviewPilot_Interview_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-150 to-sky-100 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="md:mb-10 w-full flex items-start gap-4">
          <button
            onClick={() => navigate("/history")}
            className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div className="">
            <h1 className="text-3xl font-bold flex-nowrap text-gray-800">
              Interview Analytics Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              AI-powered performance insights
            </p>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="bg-green-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl shadow-md transition-all
           duration-300 font-semibold text-sm sm:text-base text-nowrap"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* left */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center"
          >
            <h3 className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Overall Performance
            </h3>
            <div className="relative w-20 h-20 sm:w-25 sm:h-25 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "20px",
                  pathColor: "#10b981",
                  textColor: "#ef4444",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
            <p className="text-gray-400 mt-3 text-xs sm:text-sm">Out of 10</p>
            <div className="mt-4">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {performanceText}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
              Skill Evaluation
            </h3>
            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span>{s.label}</span>
                    <span className="font-semibold text-green-600">
                      {s.value}
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 sm:h-3 rounded-full">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* right */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">
              Performance Trend
            </h3>
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={questionScoreData}
                  margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#22c55e"
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="100%"
                        stopColor="#22c55e"
                        stopOpacity={0.03}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    strokeOpacity={0.15}
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    cursor={{ stroke: "#22c55e", strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                    }}
                    formatter={(value) => [`${value}/10`, "Score"]}
                  />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fill="url(#scoreGradient)"
                    dot={{
                      r: 4,
                      fill: "#22c55e",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 7,
                      strokeWidth: 3,
                    }}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-whit rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
              Question Breakdown
            </h3>
            <div className="space-y-6">
              {questionWiseScore.map((q, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:text-start gap-3 mb-4">
                    <div className="">
                      <p className="text-xs text-gray-400">Question {i + 1}</p>
                      <p className="font-semibold text-gray-800 text-sm sm:text-base leading-relaxed">
                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit">
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-xs text-green-600 font-semibold mb-1">
                      AI Feedback
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Step3Report;
