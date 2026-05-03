import "./Login.css";
import logo from "../../assets/app_logo.png";
import { ArrowLeftCircle, Mail, KeyRound, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function LoginWithOTP({ setShowOTP, setShowLogin, setIsLoggedIn }) {
  const [step, setStep] = useState(1);

  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { t } = useTranslation("otp");

  const handleSendOtp = () => {
    if (!contact) return setError(t("errContact"));

    setError("");
    setLoading(true);

    setTimeout(() => {
      const fakeOtp = "1234";
      console.log("OTP sent:", fakeOtp);
      setGeneratedOtp(fakeOtp);
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp !== generatedOtp) {
      return setError(t("errOtp"));
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      console.log("OTP verified");
      setLoading(false);
      setShowOTP(false);
      setIsLoggedIn(true);
      setShowLogin(false);
    }, 1000);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div
            className="back-btn chat-back-btn"
            onClick={() => setShowOTP(false)}
          >
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

        {step === 1 && (
          <>
            <label>{t("contactLabe;")}</label>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                placeholder={t("contactPlaceholder")}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <button className="login-primary" onClick={handleSendOtp}>
              {loading ? t("sending"): t("getOtp")} <ArrowRight size={18} />
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

            <button className="login-primary" onClick={handleVerifyOtp}>
              {loading ? t("verifying;"): t("verifyOtp")} <ArrowRight size={18} />
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