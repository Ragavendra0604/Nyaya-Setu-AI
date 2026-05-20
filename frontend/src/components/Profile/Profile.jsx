import React, { useState } from 'react';
import './Profile.css';
import { User, Mail, Settings, LogOut, ArrowLeft, Shield, Globe, Moon, Pencil } from 'lucide-react';
import { auth } from '../../firebase';
import { toast } from 'react-hot-toast';
import i18n from 'i18next';

export default function Profile({ userProfile, currentUser, onBack, onLanguageChange }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(
      localStorage.getItem("profileImage") || null
    );

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        toast.success("Logged out successfully");
      })
      .catch((err) => {
        toast.error("Logout failed: " + err.message);
      });
  };

  const handleLanguageChange = () => {
    const langs = ['en', 'hi', 'ta'];
    const currentLang = i18n.language || 'en';
    const nextLang = langs[(langs.indexOf(currentLang) + 1) % langs.length];
    
    i18n.changeLanguage(nextLang);
    if (onLanguageChange) onLanguageChange(nextLang);
    toast.success(`Language changed to ${nextLang === 'en' ? 'English' : nextLang === 'hi' ? 'Hindi' : 'Tamil'}`);
  };

  const handleSecurityClick = () => {
    toast.success("Security settings are up to date!");
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(`${isDarkMode ? 'Light' : 'Dark'} mode activated (Experimental)`);
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);

      // persist
      localStorage.setItem("profileImage", reader.result);

      toast.success("Profile photo updated!");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <header className="profile-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <h1>Your Profile</h1>
        </header>

        <section className="profile-main">
          <div className="user-avatar">
            <label htmlFor="profile-upload" className="avatar-upload">
              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <>
                  <User size={52} />
                  <div className="avatar-edit">
                    <Pencil size={16} />
                  </div>
                </>
              )}
            </label>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
              hidden
            />
          </div>
          <div className="user-info">
            <h2>{userProfile?.fullName || "NyayaSetu User"}</h2>
            <p><Mail size={14} /> {currentUser?.email || currentUser?.phoneNumber || "No email provided"}</p>
          </div>
        </section>

        <div className="profile-divider"></div>

        <section className="profile-settings">
          <div className="setting-item" onClick={handleLanguageChange}>
            <div className="setting-icon"><Globe size={20} /></div>
            <div className="setting-content">
              <h3>Language</h3>
              <p>{i18n.language === 'hi' ? 'Hindi' : i18n.language === 'ta' ? 'Tamil' : 'English'} (Click to change)</p>
            </div>
          </div>

          <div className="setting-item" onClick={handleSecurityClick}>
            <div className="setting-icon"><Shield size={20} /></div>
            <div className="setting-content">
              <h3>Account Security</h3>
              <p>Password & Protection</p>
            </div>
          </div>

          <div className="setting-item" onClick={handleThemeToggle}>
            <div className="setting-icon"><Moon size={20} /></div>
            <div className="setting-content">
              <h3>Theme</h3>
              <p>{isDarkMode ? 'Dark' : 'Light'} Mode</p>
            </div>
            <div className={`setting-toggle ${isDarkMode ? 'active' : ''}`}></div>
          </div>
        </section>

        <footer className="profile-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} /> Sign Out
          </button>
        </footer>
      </div>
    </div>
  );
}
