import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
  BsCheckCircle,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

import Navbar from "../components/Navbar";
import AuthModel from "../components/AuthModel";
import Footer from "../components/Footer";

import evalImg from "../assets/ai-ans.png";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const startInterview = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/interview");
  };

  const viewHistory = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/history");
  };

  const steps = [
    {
      icon: <BsRobot />,
      step: "01",
      title: "Choose Your Role",
      desc: "Select your target role and experience level to create a focused interview.",
    },
    {
      icon: <BsMic />,
      step: "02",
      title: "Take the Interview",
      desc: "Answer realistic questions with voice interaction and timed responses.",
    },
    {
      icon: <BsBarChart />,
      step: "03",
      title: "Review Your Result",
      desc: "Get detailed feedback and understand where you can improve.",
    },
  ];

  const features = [
    {
      image: evalImg,
      icon: <BsBarChart />,
      title: "AI Answer Evaluation",
      desc: "Understand your communication, technical accuracy, confidence and overall answer quality.",
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText />,
      title: "Resume Based Interview",
      desc: "Upload your resume and practice questions related to your actual skills and projects.",
    },
    {
      image: pdfImg,
      icon: <BsFileEarmarkText />,
      title: "Downloadable PDF Report",
      desc: "Get a detailed report containing your strengths, weaknesses and improvement areas.",
    },
    {
      image: analyticsImg,
      icon: <BsBarChart />,
      title: "History & Analytics",
      desc: "Track previous interviews and see how your performance changes over time.",
    },
  ];

  const modes = [
    {
      image: hrImg,
      title: "HR Interview",
      desc: "Practice behavioral and communication based interview questions.",
    },
    {
      image: techImg,
      title: "Technical Interview",
      desc: "Prepare for technical questions based on your selected role.",
    },
    {
      image: confidenceImg,
      title: "Confidence Analysis",
      desc: "Review your communication and confidence during the interview.",
    },
    {
      image: creditImg,
      title: "Credit System",
      desc: "Use credits to unlock and practice additional interview sessions.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-50 blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-slate-50 blur-3xl" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="grid w-full items-center gap-16 lg:grid-cols-2">
            {/* Hero Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600"
              >
                <HiSparkles />
                AI Powered Interview Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl"
              >
                Practice interviews.
                <span className="block text-blue-600">Build confidence.</span>
                Get ready to succeed.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg"
              >
                Prepare for your next interview with realistic AI-powered mock
                interviews, personalized questions and detailed performance
                feedback.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <motion.button
                  onClick={startInterview}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Start Interview
                  <BsArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>

                <motion.button
                  onClick={viewHistory}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  View History
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500"
              >
                <span className="flex items-center gap-2">
                  <BsCheckCircle className="text-blue-600" /> AI Evaluation
                </span>
                <span className="flex items-center gap-2">
                  <BsCheckCircle className="text-blue-600" /> Voice Interview
                </span>
                <span className="flex items-center gap-2">
                  <BsCheckCircle className="text-blue-600" /> Performance Report
                </span>
              </motion.div>
            </div>

            {/* Hero Interview Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto max-w-lg"
              >
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <BsRobot size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          AI Interviewer
                        </h3>
                        <p className="text-xs text-slate-400">
                          Technical Interview
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Active
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Question 04
                    </p>
                    <p className="mt-3 text-lg font-semibold leading-7 text-slate-800">
                      Tell me about a challenging project you worked on and how
                      you solved it.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                      <BsClock className="text-blue-600" />
                      <p className="mt-2 text-xs text-slate-400">Time</p>
                      <p className="mt-1 font-semibold text-slate-800">01:24</p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                      <BsMic className="text-blue-600" />
                      <p className="mt-2 text-xs text-slate-400">Mode</p>
                      <p className="mt-1 font-semibold text-slate-800">Voice</p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                      <BsBarChart className="text-blue-600" />
                      <p className="mt-2 text-xs text-slate-400">Level</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        Expert
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs text-slate-400">
                      <span>Interview Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                        className="h-full rounded-full bg-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-7 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <BsBarChart />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Performance</p>
                      <p className="font-semibold text-emerald-600">
                        Improving ↗
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-widest text-blue-600"
            >
              How It Works
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
            >
              Prepare in three simple steps
            </motion.h2>

            <p className="mt-4 text-slate-500">
              Everything you need for a focused and realistic interview practice
              session.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                    {item.icon}
                  </div>
                  <span className="text-4xl font-bold text-slate-100">
                    {item.step}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Features
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Everything you need to improve
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500">
              Practice, analyze and improve with tools designed around the
              complete interview process.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
              >
                <div className="grid items-center gap-7 sm:grid-cols-2">
                  <div className="flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.35 }}
                      className="h-full w-full object-contain p-4"
                    />
                  </div>

                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      {item.icon}
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-800">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.desc}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600">
                      Learn more{" "}
                      <BsArrowRight className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Modes */}
      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Interview Modes
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Practice for different situations
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Choose the type of interview you want to prepare for.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((mode, index) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl"
              >
                <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                  <motion.img
                    src={mode.image}
                    alt={mode.title}
                    whileHover={{ scale: 1.07 }}
                    transition={{ duration: 0.35 }}
                    className="h-40 w-40 object-contain"
                  />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-800">
                  {mode.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {mode.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl rounded-3xl bg-blue-600 px-7 py-14 text-center shadow-xl shadow-blue-600/20 sm:px-12"
        >
          <HiSparkles className="mx-auto text-3xl text-blue-100" />

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Ready to practice your next interview?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Start a realistic mock interview and find out exactly where you can
            improve.
          </p>

          <motion.button
            onClick={startInterview}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 shadow-lg transition hover:bg-blue-50"
          >
            Start Interview
            <BsArrowRight />
          </motion.button>
        </motion.div>
      </section>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

      <Footer />
    </div>
  );
};

export default Home;
