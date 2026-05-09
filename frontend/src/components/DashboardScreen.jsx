import './DashboardScreen.css';
import engBanner from '../assets/eng_banner.png';
import hindiBanner from '../assets/hindi_banner.png';
import tamBanner from '../assets/tam_banner.png';
import logo from '../assets/app_logo.png';
import {
  Scale, Languages, Sparkles, HelpCircle, MessageSquare,
  Mic, Lightbulb, ClipboardList, Users, Handshake, User
} from 'lucide-react';
import { useTranslation } from "react-i18next";
import i18n from "i18next";

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
  setShowProfile
}) {
  const { t } = useTranslation("dashboard");

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
  }

  const features = [
    {
      icon: <Languages className="w-6 h-6" />,
      title: t("features.multilingual.title"),
      body: t("features.multilingual.body"),
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: t("features.voice.title"),
      body: t("features.voice.body"),
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: t("features.simple.title"),
      body: t("features.simple.body"),
    },
  ];

  const practicalItems = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: t("practical.fir.title"),
      body: t("practical.fir.body"),
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("practical.legalAid.title"),
      body: t("practical.legalAid.body"),
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: t("practical.tenant.title"),
      body: t("practical.tenant.body"),
    },
  ];

  return (
    <main className="dashboard-screen">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-mark">
            <img src={logo} alt="NyayaSetu AI" />
          </div>

          <div className="dashboard-brand-name">
            <h2>NyayaSetu AI</h2>
          </div>
          <div className="dashboard-brand-actions">
            <span
              className="icon"
              onClick={() => {
                i18n.changeLanguage("en");
                onSelectLanguage(null);
              }}
            >
              <Languages size={19} />
            </span>

            {isLoggedIn && (
              <span
                className="icon"
                onClick={() => setShowProfile(true)}
                title="Profile"
              >
                <User size={19} />
              </span>
            )}
          </div>
        </div>
      </aside>

      <section className="dashboard-content">
        <div className="hero-card">
          <div className="hero-split">
            <div className="hero-left">
              <span className="badge">
                <Scale size={16} /> {t("guideBadge")}
              </span>

              <h1>{t("heroTitle")}</h1>

              <p>{t("heroDescription")}</p>

              <div className="actions">
                <button
                  className="primary"
                  onClick={() => handleClick('primary')}
                >
                  <MessageSquare size={19} /> {t("primaryAction")}
                </button>

                {!isLoggedIn ?
                  (
                    <button
                      className="secondary"
                      onClick={() => {
                        handleClick('secondary');
                        setIsDemo(true);
                      }}
                    >
                      <Sparkles size={19} /> {t("secondaryAction")}
                    </button>
                  ) : null
                }
              </div>
            </div>

            <div className="hero-right">
              <img src={selectedBanner} alt={t("visualTitle")} />
            </div>
          </div>
        </div>

        <section className="feature-section-card">
          <div className="feature-header">
            <h2>{t("sectionTitle")}</h2>
            <p>{t("sectionSubtitle")}</p>
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
            <h2>{t("practicalTitle")}</h2>
            <p>{t("practicalSubtitle")}</p>
          </div>

          <div className="dashboard-practical-list">
            {practicalItems.map((item) => (
              <article key={item.title} className="dashboard-practical-card">
                <div className="dashboard-practical-icon">{item.icon}</div>

                <div className="dashboard-practical-copy">
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>

                <button className="dashboard-explore-button" type="button">
                  {t("exploreLabel")}
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main >
  );
}

export default DashboardScreen;