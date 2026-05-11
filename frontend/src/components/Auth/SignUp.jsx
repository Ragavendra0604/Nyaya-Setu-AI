import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { syncProfile } from "../../services/api";
import { toast } from "react-hot-toast";
import "./Login.css";
import logo from "../../assets/app_logo.jpeg";

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

  const handleSignUp = async () => {
  if (!fullName || !email || !password || !confirmPassword) {
    toast.error("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    await syncProfile({
      uid: userCredential.user.uid,
      email: email,
      displayName: fullName,
      language: localStorage.getItem("lang") || "en",
      mode: "simple",
    });

    toast.success("Account created successfully");
    setShowSignUp(false);
  } catch (error) {
    toast.error(error.message);
  }
};

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