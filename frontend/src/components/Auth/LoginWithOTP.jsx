import "./Login.css";
import logo from "../../assets/app_logo.jpeg";
import {
  ArrowLeftCircle,
  Mail,
  KeyRound,
  ArrowRight,
  Mic,
  MicOff
} from "lucide-react";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { sendOtp, verifyOtp, syncProfile } from "../../services/api";
import { toast } from "react-hot-toast";

export default function LoginWithOTP({
  setShowOTP,
  setShowLogin,
  setIsLoggedIn
}) {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isListening, setIsListening] = useState(false);

  const { t } = useTranslation();

  // STT Setup
  const startSTT = (target) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
      localStorage.getItem("lang") === "hi"
        ? "hi-IN"
        : localStorage.getItem("lang") === "ta"
        ? "ta-IN"
        : "en-IN";

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      if (target === "email") {
        setEmail(transcript.toLowerCase().replace(/\s/g, ""));
      }

      else if (target === "otp") {
        setOtp(transcript.replace(/\D/g, ""));
      }
    };

    recognition.start();
  };

  const handleSendOtp = async () => {

    if (!email) {
      return setError(t("otp.errContact"));
    }

    if (!email.includes("@")) {
      return setError(t("otp.errContact"));
    }

    setError("");
    setLoading(true);

    try {

      const result = await sendOtp(email);

      if (result.ok) {

        setStep(2);

        toast.success(
          result.isMock
            ? "Mock OTP generated! Check server console."
            : "Verification code sent to your email"
        );

      } else {

        setError(result.error || "Failed to send code");
      }

    } catch (err) {

      console.error(err);

      setError("Server connection failed");

    } finally {

      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {

    if (!otp) {
      return setError(t("otp.errOtp"));
    }

    setError("");
    setLoading(true);

    try {

      const result = await verifyOtp(email, otp);

      if (result.ok) {

        await syncProfile({
          uid: result.uid,
          email: result.email,
          displayName: result.email.split("@")[0],
          phone: "",
          language: localStorage.getItem("lang") || "en",
        });

        localStorage.setItem("userUid", result.uid);

        setIsLoggedIn(true);
        setShowOTP(false);
        setShowLogin(false);

        toast.success("Login successful");

      } else {

        setError(result.error || "Invalid code");

        toast.error(result.error || "Invalid code");
      }

    } catch (err) {

      console.error(err);

      setError("Verification failed");

    } finally {

      setLoading(false);
    }
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

        <h1>{t("otp.title")}</h1>

        <p className="login-subtitle">
          {step === 1 && t("otp.step1")}
          {step === 2 && t("otp.step2")}
        </p>

        {step === 1 && (
          <>
            <label>{t("otp.contactLabel")}</label>

            <div className="input-group">

              <Mail className="input-icon" size={18} />

              <input
                type="email"
                placeholder={t("otp.contactPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                className={`mic-btn ${isListening ? "listening" : ""}`}
                onClick={() => startSTT("email")}
                title="Speak email"
              >
                {isListening ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </button>
            </div>

            <button
              className="login-primary"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading
                ? t("otp.sending")
                : t("otp.getOtp")}{" "}

              <ArrowRight size={18} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label>{t("otp.otpLabel")}</label>

            <div className="input-group">

              <KeyRound className="input-icon" size={18} />

              <input
                type="text"
                placeholder={t("otp.otpPlaceholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                className={`mic-btn ${isListening ? "listening" : ""}`}
                onClick={() => startSTT("otp")}
                title="Speak code"
              >
                {isListening ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </button>
            </div>

            <button
              className="login-primary"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading
                ? t("otp.verifying")
                : t("otp.verifyOtp")}{" "}

              <ArrowRight size={18} />
            </button>
          </>
        )}

        {error && (
          <p
            className="error-message"
            style={{
              color: "#ff4d4d",
              marginTop: "10px",
              fontSize: "0.85rem",
              fontWeight: "500",
            }}
          >
            {error}
          </p>
        )}

        <p className="login-footer">
          {t("otp.backToLogin")}{" "}

          <span onClick={() => setShowOTP(false)}>
            {t("otp.signIn")}
          </span>
        </p>

      </div>
    </div>
  );
}