import './DashboardScreen.css';
import engBanner from '../assets/eng_banner.jpeg';
import hindiBanner from '../assets/hindi_banner.jpeg';
import tamBanner from '../assets/tam_banner.jpeg';
import logo from '../assets/app_logo.jpeg';
import {
  Scale, Languages, Sparkles, MessageSquare,
  Mic, Lightbulb, ClipboardList, Users, Handshake, User, Menu, X
} from 'lucide-react';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useState } from "react";

const bannerByLanguage = {
  en: engBanner,
  hi: hindiBanner,
  ta: tamBanner,
};

function DashboardScreen({
  selectedLanguage,
  onSelectLanguage,
  setShowChat,
  isLoggedIn,
  setShowLogin,
  setShowDashboard,
  setIsDemo,
  setShowProfile,
  setIsLoggedIn
}) {
  const { t } = useTranslation();

  const selectedBanner = bannerByLanguage[selectedLanguage] ?? engBanner;

  const handleClick = (type) => {
    if (type === 'primary') {
      if (isLoggedIn) {
        setIsDemo(false);
        setShowDashboard(false);
        setShowChat(true);
      } else {
        setShowDashboard(false);
        setShowLogin(true);
      }
    } else {
      setShowDashboard(false);
      setShowChat(true);
    }
  };

  const features = [
    {
      icon: <Languages className="w-6 h-6" />,
      title: t("dashboard.features.multilingual.title"),
      body: t("dashboard.features.multilingual.body"),
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: t("dashboard.features.voice.title"),
      body: t("dashboard.features.voice.body"),
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: t("dashboard.features.simple.title"),
      body: t("dashboard.features.simple.body"),
    },
  ];

  const practicalItems = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: t("dashboard.practical.fir.title"),
      body: t("dashboard.practical.fir.body"),
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("dashboard.practical.legalAid.title"),
      body: t("dashboard.practical.legalAid.body"),
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: t("dashboard.practical.tenant.title"),
      body: t("dashboard.practical.tenant.body"),
    },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="dashboard-screen">
      <>
        <header className="mobile-header">
          <div className="mobile-header-left">
            <div className="dashboard-brand-mark">
              <img src={logo} alt="NyayaSetu AI" />
            </div>

            <div className="mobile-header-text">
              <h2>NyayaSetu AI</h2>
            </div>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        </header>

        {mobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside className={`dashboard-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-inner">
            <div className="mobile-sidebar-top">
              <div className="dashboard-brand-name">
                <div className="dashboard-brand-mark">
                  <img src={logo} alt="NyayaSetu AI" />
                </div>

                <div>
                  <h2>NyayaSetu AI</h2>
                  <small>Legal Guidance Assistant</small>
                </div>
              </div>

              <button
                className="mobile-close-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="desktop-sidebar-brand">
              <div className="dashboard-brand-name">
                <div className="dashboard-brand-mark">
                  <img src={logo} alt="NyayaSetu AI" />
                </div>

                <div>
                  <h2>NyayaSetu AI</h2>
                  <small>Legal Guidance Assistant</small>
                </div>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button className="sidebar-link active">
                <Scale size={19} />
                <span>Dashboard</span>
              </button>

              <button
                className="sidebar-link"
                onClick={() => {
                  setIsDemo(!isLoggedIn);
                  setShowDashboard(false);
                  setShowChat(true);
                }}
              >
                <MessageSquare size={19} />
                <span>AI Chat</span>
              </button>

              <button
                className="sidebar-link"
                onClick={() => {
                  i18n.changeLanguage("en");
                  onSelectLanguage(null);
                }}
              >
                <Languages size={19} />
                <span>Languages</span>
              </button>

              {isLoggedIn && (
                <button
                  className="sidebar-link"
                  onClick={() => setShowProfile(true)}
                >
                  <User size={19} />
                  <span>Profile</span>
                </button>
              )}
            </nav>

            <div className="sidebar-footer">
              {isLoggedIn ? (
                <button
                  className="logout-btn"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    setShowProfile(false);
                    setShowChat(false);
                    setShowLogin(false);
                    setShowDashboard(true);
                    setIsDemo(false);
                  }}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="login-btn"
                  onClick={() => {
                    setShowDashboard(false);
                    setShowLogin(true);
                  }}
                >
                  Login / Signup
                </button>
              )}
            </div>
          </div>
        </aside>
      </>

      <section className="dashboard-content">
        <div className="hero-card">
          <div className="hero-split">
            <div className="hero-left">
              <span className="badge">
                <Scale size={16} /> {t("dashboard.guideBadge")}
              </span>

              <h1>{t("dashboard.heroTitle")}</h1>
              <p>{t("dashboard.heroDescription")}</p>

              <div className="actions">
                <button
                  className="primary"
                  onClick={() => handleClick('primary')}
                >
                  <MessageSquare size={19} /> {t("dashboard.primaryAction")}
                </button>

                {!isLoggedIn && (
                  <button
                    className="secondary"
                    onClick={() => {
                      handleClick('secondary');
                      setIsDemo(true);
                    }}
                  >
                    <Sparkles size={19} /> {t("dashboard.secondaryAction")}
                  </button>
                )}
              </div>
            </div>

            <div className="hero-right">
              <img src={selectedBanner} alt={t("dashboard.visualTitle")} />
            </div>
          </div>
        </div>

        <section className="feature-section-card">
          <div className="feature-header">
            <h2>{t("dashboard.sectionTitle")}</h2>
            <p>{t("dashboard.sectionSubtitle")}</p>
          </div>

          <div className="dashboard-feature-grid">
            {features.map((card) => (
              <article key={card.title} className="dashboard-feature-card">
                <div className="dashboard-feature-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="practical-section-card">
          <div className="practical-header">
            <h2>{t("dashboard.practicalTitle")}</h2>
            <p>{t("dashboard.practicalSubtitle")}</p>
          </div>

          <div className="dashboard-practical-list">
            {practicalItems.map((item) => (
              <article key={item.title} className="dashboard-practical-card">
                <div className="dashboard-practical-icon">{item.icon}</div>

                <div className="dashboard-practical-copy">
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>

                <button
                  className="dashboard-explore-button"
                  type="button"
                  onClick={() => {
                    setShowDashboard(false);
                    setShowChat(true);
                    localStorage.setItem("prefilledQuery", item.body);
                  }}
                >
                  {t("dashboard.exploreLabel")}
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default DashboardScreen;