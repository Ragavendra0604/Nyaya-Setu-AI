import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-hot-toast";
import "./Login.css";
import logo from "../../assets/app_logo.jpeg";
import {
  KeyRound,
  ArrowLeftCircle,
  UserRoundIcon,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import Signup from "./SignUp";
import Forgot from "./Forgot";
import LoginWithOTP from "./LoginWithOTP";
import { useTranslation } from "react-i18next";

export default function Login({ setShowLogin, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const { t } = useTranslation();

  const handleLogin = async () => {
    if (loginLoading) return;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoginLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login successful");
      setIsLoggedIn(true);
      setShowLogin(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOtpLogin = () => {
    if (loginLoading) return;
    setShowOTP(true);
  };

  if (showForgot) {
    return <Forgot setShowForgot={setShowForgot} />;
  }

  if (showSignUp) {
    return <Signup setShowSignUp={setShowSignUp} />;
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
          onClick={() => {
            if (!loginLoading) {
              setShowLogin(false);
            }
          }}
        >
          <ArrowLeftCircle />
        </div>

        <div className="brand-badge">
          <img src={logo} alt="NyayaSetu Logo" />
        </div>

        <h1>{t("login.title")}</h1>
        <p className="login-subtitle">{t("login.subtitle")}</p>

        <label>{t("login.emailLabel")}</label>
        <div className="input-group">
          <UserRoundIcon className="input-icon" size={18} />
          <input
            type="email"
            placeholder={t("login.emailPlaceholder")}
            value={email}
            disabled={loginLoading}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password-header">
          <label>{t("login.password")}</label>

          <span
            className="forgot"
            onClick={() => {
              if (!loginLoading) {
                setShowForgot(true);
              }
            }}
          >
            {t("login.forgot")}
          </span>
        </div>

        <div className="input-group">
          <LockKeyhole className="input-icon" size={18} />
          <input
            type="password"
            placeholder={t("login.password")}
            value={password}
            disabled={loginLoading}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
        </div>

        <button
          className="login-primary"
          onClick={handleLogin}
          disabled={loginLoading}
        >
          {loginLoading ? "Signing in..." : t("login.signIn")}
          <ArrowRight size={18} />
        </button>

        <div className="divider">
          <span>{t("login.or")}</span>
        </div>

        <button
          className="login-secondary"
          onClick={handleOtpLogin}
          disabled={loginLoading}
        >
          {t("login.otp")} <KeyRound size={18} />
        </button>

        <p className="login-footer">
          {t("login.newUser")}
          <span
            onClick={() => {
              if (!loginLoading) {
                setShowSignUp(true);
              }
            }}
          >
            {t("login.createAccount")}
          </span>
        </p>
      </div>
    </div>
  );
}