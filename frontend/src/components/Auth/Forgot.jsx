import "./Login.css";
import logo from "../../assets/app_logo.jpeg";
import { ArrowLeftCircle, Mail, LockKeyhole, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function ForgotPassword({ setShowForgot }) {
  const [step, setStep] = useState(1);

  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation("forgot");

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
    setStep(3);
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      return setError(t("errPassword"));
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      console.log("Password updated");
      setLoading(false);
      setShowForgot(false);
    }, 1000);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div
            className="back-btn chat-back-btn"
            onClick={() => setShowForgot(false)}
          >
            <ArrowLeftCircle />
        </div>
        
        <div className="brand-badge">
          <img src={logo} alt="logo" />
        </div>

        <h1>{t.title}</h1>
        <p className="login-subtitle">
          {step === 1 && t("step1")}
          {step === 2 && t("step2")}
          {step === 3 && t("step3")}
        </p>

        {step === 1 && (
          <>
            <label>{t("contactLabel")}</label>
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
              {loading ? t("sending") : t("sendOtp")} <ArrowRight size={18} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label>{t("otpLabel")}</label>
            <div className="input-group">
              <input
                type="text"
                placeholder={t("otpPlaceholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button className="login-primary" onClick={handleVerifyOtp}>
              {t("verifyOtp")} <ArrowRight size={18} />
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <label>{t("newPassword")}</label>
            <div className="input-group">
              <LockKeyhole className="input-icon" size={18} />
              <input
                type="password"
                placeholder={t("newPasswordPlaceholder")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

            <button className="login-primary" onClick={handleResetPassword}>
              {loading ? t("updating") : t("updatePassword")}{" "}
              <ArrowRight size={18} />
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
          <span onClick={() => setShowForgot(false)}>{t("signIn")}</span>
        </p>

      </div>
    </div>
  );
}