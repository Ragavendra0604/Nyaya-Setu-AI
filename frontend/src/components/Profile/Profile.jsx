import React, { useState } from 'react';
import './Profile.css';
import { User, Mail, Settings, LogOut, ArrowLeft, Shield, Globe, Moon, Pencil } from 'lucide-react';
import { auth } from '../../firebase';
import { toast } from 'react-hot-toast';
import i18n from 'i18next';
import Cropper from 'react-easy-crop';

export default function Profile({
  userProfile,
  setUserProfile,
  currentUser,
  onBack,
  onLanguageChange
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);

  const [showCropper, setShowCropper] = useState(false);

React.useEffect(() => {
  if (userProfile?.profileImage) {
    setProfileImage(userProfile.profileImage);
  }
}, [userProfile]);

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



const handleCropComplete = (_, croppedPixels) => {
  setCroppedAreaPixels(croppedPixels);
};

const handleProfileUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const imageUrl = URL.createObjectURL(file);

  setImageSrc(imageUrl);
  setCrop({ x: 0, y: 0 });
  

  setShowCropper(true);
};
const uploadCroppedImage = async () => {
  try {
    const croppedBlob = await getCroppedImg(
      imageSrc,
      croppedAreaPixels
    );

    const formData = new FormData();

    formData.append(
      "image",
      croppedBlob,
      "profile.jpg"
    );

    const response = await fetch(
      `http://localhost:5000/api/auth/upload-profile/${currentUser.uid}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.ok) {
      setProfileImage(data.imageUrl);

      setUserProfile((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
      }));

      toast.success("Profile photo updated!");

      setShowCropper(false);

    } else {
      toast.error(data.error || "Upload failed");
    }

  } catch (error) {
    console.error(error);

    toast.error("Image upload failed");
  }
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));

    image.addEventListener('error', (error) => reject(error));

    image.setAttribute('crossOrigin', 'anonymous');

    image.src = url;
  });

const getCroppedImg = async (imageSrc, cropPixels) => {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");

  const size = Math.min(
    cropPixels.width,
    cropPixels.height
  );

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  // Create circular clipping mask
  ctx.beginPath();

  ctx.arc(
    size / 2,
    size / 2,
    size / 2,
    0,
    Math.PI * 2
  );

  ctx.closePath();

  ctx.clip();

  // Draw correct cropped portion
  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    size,
    size,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/png"
    );
  });
};

if (showCropper) {
  return (
    <div className="cropper-container">

      <div className="cropper-box">

        <Cropper
          image={imageSrc}
          crop={crop}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
        />

        <div className="crop-controls">

  

  <button onClick={uploadCroppedImage}>
    Save Profile Picture
  </button>

  <button
    onClick={() => {
      setShowCropper(false);
      setImageSrc(null);
    }}
  >
    Cancel
  </button>

</div>

      </div>

    </div>
  );
}
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
            <h2>{userProfile?.displayName || "NyayaSetu User"}</h2>
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
