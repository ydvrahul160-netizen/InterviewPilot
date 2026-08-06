import React, { useState } from "react";
import Step1SetUp from "../components/Step1SetUp";
import Step2Interview from "../components/step2Interview";
import Step3Report from "../components/Step3Report";

const InterviewPage = () => {
    // Current step of interview flow
  // 1 = Setup, 2 = Interview, 3 = Report
  const [step, setStep] = useState(1);

    // Stores setup information initially,
  // then stores final interview report after completion.
  const [interviewData, setInterviewData] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- Step 1 : Interview Setup ---------- */}
      {step === 1 && (
        <Step1SetUp
          onStart={(data) => {
            // Save setup data
            setInterviewData(data);
            // Move to Interview screen
            setStep(2);
          }}
        />
      )}

        {/* ---------- Step 2 : Interview ---------- */}
      {step === 2 && (<Step2Interview interviewData={interviewData}
       onFinish={(report)=>{
        // Save final interview report
        setInterviewData;{report};
        // Move to Report screen
        setStep(3);
    }}
      />
      )}

      {/* ---------- Step 3 : Final Report ---------- */}
      {step === 3 && (<Step3Report report={interviewData} />)}
    </div>
  );
};

export default InterviewPage;
