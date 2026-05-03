import "./Login.css";
import logo from "../../assets/app_logo.png";
import { KeyRound, ArrowLeftCircle, UserRoundIcon, LockKeyhole, ArrowRight } from 'lucide-react';
import { useState } from "react";
import Signup from "./SignUp";
import Forgot from "./Forgot"; 
import LoginWithOTP from "./LoginWithOTP";

import i18next from "i18next";
import { useTranslation } from "react-i18next";

export default function Login({ setShowLogin, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const { t } = useTranslation("login");

  const handleLogin = () => {
    console.log("Login:", { email, password });
    setIsLoggedIn(true);
    setShowLogin(false); 
  };

  const handleOtpLogin = () => {
    setShowOTP(true);
  };

  if (showForgot) {
    return (
      <Forgot
        setShowForgot={setShowForgot}
      />
    );
  }

  if (showSignUp) {
    return (
      <Signup
        setShowSignUp={setShowSignUp}
      />
    );
  }

  if (showOTP) {
    return (
      <LoginWithOTP
        setShowOTP={setShowOTP}
        setShowLogin={setShowLogin}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div
            className="back-btn"
            onClick={() => setShowLogin(false)}
          >
            <ArrowLeftCircle />
        </div>
        <div className="brand-badge">
          <img src={logo} alt="NyayaSetu Logo" />
        </div>

        <h1>{t("title")}</h1>
        <p className="login-subtitle">{t("subtitle")}</p>

        <label>{t("emailLabel")}</label>
        <div className="input-group">
          <UserRoundIcon className="input-icon" size={18} />
          <input
            type="email"
            placeholder={t("emailLabel")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password-header">
          <label>{t("password")}</label>

          <span
            className="forgot"
            onClick={() => setShowForgot(true)}
          >
            {t("forgot")}
          </span>
        </div>

        <div className="input-group">
          <LockKeyhole className="input-icon" size={18} />
          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-primary" onClick={handleLogin}>
          {t("signIn")} <ArrowRight size={18} />
        </button>

        <div className="divider">
          <span>{t("or")}</span>
        </div>

        <button className="login-secondary" onClick={handleOtpLogin}>
          {t("otp")} <KeyRound size={18} />
        </button>

        <p className="login-footer">
          {t("newUser")}
          <span onClick={() => setShowSignUp(true)}>
            {t("createAccount")}
          </span>
        </p>

      </div>
    </div>
  );
}