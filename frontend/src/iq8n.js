import i18next from "i18next";
import { initReactI18next } from 'react-i18next';

import enDashboard from './locals/en/dashboard.json';
import enAuth from './locals/en/auth.json';
import enLogin from './locals/en/login.json';
import enForgot from './locals/en/forgot.json';
import enOtp from './locals/en/otp.json';

import taDashboard from './locals/ta/dashboard.json';
import taAuth from './locals/ta/auth.json';
import taLogin from './locals/ta/login.json';
import taForgot from './locals/ta/forgot.json';
import taOtp from './locals/ta/otp.json';

import hiDashboard from './locals/hi/dashboard.json';
import hiAuth from './locals/hi/auth.json';
import hiLogin from './locals/hi/login.json';
import hiForgot from './locals/hi/forgot.json';
import hiOtp from './locals/hi/otp.json';

i18next.init({
  resources: {
    en: {
      dashboard: enDashboard,
      auth: enAuth,
      login: enLogin,
      forgot: enForgot,
      otp: enOtp,
    },
    ta: {
      dashboard: taDashboard,
      auth: taAuth,
      login: taLogin,
      forgot: taForgot,
      otp: taOtp,
    },
    hi: {
      dashboard: hiDashboard,
      auth: hiAuth,
      login: hiLogin,
      forgot: hiForgot,
      otp: hiOtp,
    },
  },
});


i18next
    .use(initReactI18next)
    .init({
        resources: {
            en: { 
                dashboard: enDashboard, 
                auth: enAuth,
                login: enLogin,
                forgot: enForgot,
                otp: enOtp,
            },
            ta: { 
                dashboard: taDashboard, 
                auth: taAuth,
                login: taLogin,
                forgot: taForgot,
                otp: taOtp,
            },
            hi: { 
                dashboard: hiDashboard, 
                auth: hiAuth,
                login: hiLogin, 
                forgot: hiForgot,
                otp: hiOtp,
            },
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18next;