import "./Login.css";
import logo from "../../assets/app_logo.jpeg";
import { ArrowLeftCircle, Mail, LockKeyhole, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ForgotPassword({ setShowForgot }) {
  const [step, setStep] = useState(1);

  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();

  const handleSendOtp = () => {
    if (!contact) return setError(t("forgot.errContact"));

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
      return setError(t("forgot.errOtp"));
    }

    setError("");
    setStep(3);
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      return setError(t("forgot.errPassword"));
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

        <h1>{t("forgot.title")}</h1>

        <p className="login-subtitle">
          {step === 1 && t("forgot.step1")}
          {step === 2 && t("forgot.step2")}
          {step === 3 && t("forgot.step3")}
        </p>

        {step === 1 && (
          <>
            <label>{t("forgot.contactLabel")}</label>

            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                placeholder={t("forgot.contactPlaceholder")}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <button className="login-primary" onClick={handleSendOtp}>
              {loading ? t("forgot.sending") : t("forgot.sendOtp")}{" "}
              <ArrowRight size={18} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label>{t("forgot.otpLabel")}</label>

            <div className="input-group">
              <input
                type="text"
                placeholder={t("forgot.otpPlaceholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button className="login-primary" onClick={handleVerifyOtp}>
              {t("forgot.verifyOtp")} <ArrowRight size={18} />
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <label>{t("forgot.newPassword")}</label>

            <div className="input-group">
              <LockKeyhole className="input-icon" size={18} />
              <input
                type="password"
                placeholder={t("forgot.newPasswordPlaceholder")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <label>{t("forgot.confirmPassword")}</label>

            <div className="input-group">
              <LockKeyhole className="input-icon" size={18} />
              <input
                type="password"
                placeholder={t("forgot.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className="login-primary" onClick={handleResetPassword}>
              {loading ? t("forgot.updating") : t("forgot.updatePassword")}{" "}
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
          {t("forgot.backToLogin")}{" "}
          <span onClick={() => setShowForgot(false)}>
            {t("forgot.signIn")}
          </span>
        </p>
      </div>
    </div>
  );
}