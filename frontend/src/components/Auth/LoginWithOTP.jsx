import "./Login.css";
import logo from "../../assets/app_logo.png";
import { ArrowLeftCircle, Mail, KeyRound, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";

export default function LoginWithOTP({ setShowOTP, setShowLogin, setIsLoggedIn }) {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation("otp");

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return window.recaptchaVerifier;
  };

  const handleSendOtp = async () => {
    if (!contact) return setError("Enter phone number with country code, e.g. +919876543210");

    setError("");
    setLoading(true);

    try {
      const appVerifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, contact, appVerifier);

      setConfirmationResult(result);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError("Enter OTP");

    setError("");
    setLoading(true);

    try {
      await confirmationResult.confirm(otp);

      setIsLoggedIn(true);
      setShowOTP(false);
      setShowLogin(false);
    } catch (err) {
      console.error(err);
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="back-btn chat-back-btn" onClick={() => setShowOTP(false)}>
          <ArrowLeftCircle />
        </div>

        <div className="brand-badge">
          <img src={logo} alt="NyayaSetu Logo" />
        </div>

        <h1>{t("title")}</h1>
        <p className="login-subtitle">
          {step === 1 && t("step1")}
          {step === 2 && t("step2")}
        </p>

        <div id="recaptcha-container"></div>

        {step === 1 && (
          <>
            <label>Phone Number</label>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                placeholder="+919876543210"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <button className="login-primary" onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Get OTP"} <ArrowRight size={18} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label>{t("otpLabel")}</label>
            <div className="input-group">
              <KeyRound className="input-icon" size={18} />
              <input
                type="text"
                placeholder={t("otpPlaceholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button className="login-primary" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : t("verifyOtp")} <ArrowRight size={18} />
            </button>
          </>
        )}

        {error && (
          <p style={{ color: "red", marginTop: "10px", fontSize: "0.8rem" }}>
            {error}
          </p>
        )}

        <p className="login-footer">
          {t("backToLogin")}{" "}
          <span onClick={() => setShowOTP(false)}>{t("signIn")}</span>
        </p>
      </div>
    </div>
  );
}