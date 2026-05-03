import "./Login.css";
import logo from "../../assets/app_logo.png";

import { 
  ArrowLeftCircle, UserRound, Mail, 
  LockKeyhole, ArrowRight 
} from "lucide-react";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Signup({ setShowSignUp }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const { t } = useTranslation("auth");

  const handleSignUp = () => {
    // Implement sign-up logic here (e.g., form validation, API call)
    console.log("Sign Up Details:", { fullName, email, password, confirmPassword });
    setShowSignUp(false); // Close the sign-up form after handling sign-up
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div
            className="back-btn chat-back-btn"
            onClick={() => setShowSignUp(false)}
          >
            <ArrowLeftCircle />
        </div>
        <div className="brand-badge">
          <img src={logo} alt="NyayaSetu Logo" />
        </div>

        <h1>{t("title")}</h1>
        <p className="login-subtitle">{t("subtitle")}</p>

        <label>{t("fullName")}</label>
        <div className="input-group">
          <UserRound className="input-icon" size={18} />
          <input
            type="text"
            placeholder={t("fullNamePlaceholder")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <label>{t("email")}</label>
        <div className="input-group">
          <Mail className="input-icon" size={18} />
          <input 
            type="email" placeholder={t("emailPlaceholder")} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>{t("password")}</label>
        <div className="input-group">
          <LockKeyhole className="input-icon" size={18} />
          <input 
            type="password" 
            placeholder={t("passwordPlaceholder")} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label>{t("confirmPassword")}</label>
        <div className="input-group">
          <LockKeyhole className="input-icon" size={18} />
          <input 
            type="password" 
            placeholder={t("confirmPasswordPlaceholder")} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="login-primary" onClick={handleSignUp}>
          {t("createAccount")} <ArrowRight size={18} />
        </button>

        <p className="login-footer">
          {t("already")} <span onClick={() => setShowSignUp(false)}>{t("signIn")}</span>
        </p>

      </div>
    </div>
  );
}