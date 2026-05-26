import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { syncProfile } from "../../services/api";
import { toast } from "react-hot-toast";
import "./Login.css";
import logo from "../../assets/app_logo.jpeg";

import {
  ArrowLeftCircle,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Signup({ setShowSignUp }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [signupLoading, setSignupLoading] = useState(false);

  const { t } = useTranslation();

  const handleSignUp = async () => {
    if (signupLoading) return;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSignupLoading(true);

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
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div
          className="back-btn chat-back-btn"
          onClick={() => {
            if (!signupLoading) {
              setShowSignUp(false);
            }
          }}
        >
          <ArrowLeftCircle />
        </div>

        <div className="brand-badge">
          <img src={logo} alt="NyayaSetu Logo" />
        </div>

        <h1>{t("auth.title")}</h1>
        <p className="login-subtitle">{t("auth.subtitle")}</p>

        <label>{t("auth.fullName")}</label>
        <div className="input-group">
          <UserRound className="input-icon" size={18} />
          <input
            type="text"
            placeholder={t("auth.fullNamePlaceholder")}
            value={fullName}
            disabled={signupLoading}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <label>{t("auth.email")}</label>
        <div className="input-group">
          <Mail className="input-icon" size={18} />
          <input
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            disabled={signupLoading}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>{t("auth.password")}</label>
        <div className="input-group">
          <LockKeyhole className="input-icon" size={18} />
          <input
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            disabled={signupLoading}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label>{t("auth.confirmPassword")}</label>
        <div className="input-group">
          <LockKeyhole className="input-icon" size={18} />
          <input
            type="password"
            placeholder={t("auth.confirmPasswordPlaceholder")}
            value={confirmPassword}
            disabled={signupLoading}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSignUp();
              }
            }}
          />
        </div>

        <button
          className="login-primary"
          onClick={handleSignUp}
          disabled={signupLoading}
        >
          {signupLoading ? "Creating account..." : t("auth.createAccount")}
          <ArrowRight size={18} />
        </button>

        <p className="login-footer">
          {t("auth.already")}{" "}
          <span
            onClick={() => {
              if (!signupLoading) {
                setShowSignUp(false);
              }
            }}
          >
            {t("auth.signIn")}
          </span>
        </p>
      </div>
    </div>
  );
}