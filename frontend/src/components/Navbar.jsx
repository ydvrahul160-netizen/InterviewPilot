import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import AuthModel from "./AuthModel";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);

  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full bg-white px-5 pt-5 sm:px-8 lg:px-12">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:px-6"
      >
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center">
          <img
            src="/interviewpilot-logo.png"
            alt="InterviewPilot"
            className="h-16 w-auto object-contain sm:h-11"
          />
        </button>

        {/* Right */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Credits */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }

                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 sm:px-3.5"
            >
              <BsCoin
                size={16}
                className="text-gray-700 transition group-hover:scale-105"
              />

              <span>{userData?.credits || 0}</span>

              <span className="hidden text-gray-400 sm:inline">Credits</span>
            </button>

            {showCreditPopup && (
              <div className="absolute right-0 top-full z-50 mt-3 w-[250px] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_12px_35px_rgba(0,0,0,0.10)]">
                <p className="mb-3 text-sm leading-5 text-gray-600">
                  Need more credits to continue your interviews?
                </p>

                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full rounded-xl bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Buy More Credits
                </button>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }

                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-gray-800 sm:h-10 sm:w-10"
            >
              {userData ? (
                userData?.name?.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={14} />
              )}
            </button>

            {showUserPopup && (
              <div className="absolute right-0 top-full z-50 mt-3 w-[220px] rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_12px_35px_rgba(0,0,0,0.10)]">
                {/* User Info */}
                <div className="mb-2 border-b border-gray-100 px-2 pb-3">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {userData?.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Interview Candidate
                  </p>
                </div>

                {/* History */}
                <button
                  onClick={() => navigate("/history")}
                  className="w-full rounded-lg px-2 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                >
                  Interview History
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
                >
                  <HiOutlineLogout size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Navbar;
