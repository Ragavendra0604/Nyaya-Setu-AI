const { db } = require('../config/firebase');
const fs = require('fs');
const path = require('path');

const LANGUAGES = ['en', 'hi', 'ta'];
const CATEGORIES = ['auth', 'chat', 'dashboard', 'forgot', 'login', 'otp'];

async function seedLanguages() {
  console.log('🚀 Starting Language Seed Script...');
  
  const translations = {}; // key -> { en, hi, ta, category }

  for (const category of CATEGORIES) {
    for (const lang of LANGUAGES) {
      const filePath = path.join(__dirname, `../../frontend/src/locals/${lang}/${category}.json`);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Warning: File not found: ${filePath}`);
        continue;
      }

      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Flatten nested objects if any, or just process top level
        Object.keys(content).forEach(key => {
          const translationKey = `${category}.${key}`;
          if (!translations[translationKey]) {
            translations[translationKey] = {
              key: translationKey,
              category: category,
              en: '',
              hi: '',
              ta: ''
            };
          }
          
          const val = content[key];
          translations[translationKey][lang] = Array.isArray(val) ? val.join('|') : val;
        });
      } catch (err) {
        console.error(`❌ Error parsing ${filePath}:`, err.message);
      }
    }
  }

  console.log(`📦 Prepared ${Object.keys(translations).length} translation keys.`);

  let successCount = 0;
  for (const key of Object.keys(translations)) {
    try {
      const data = {
        ...translations[key],
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Check if already exists to avoid duplicates
      const existing = await db.collection('translations').where('key', '==', data.key).get();
      
      if (!existing.empty) {
        console.log(`Updating existing key: ${data.key}`);
        await db.collection('translations').doc(existing.docs[0].id).update({
          ...data,
          updatedAt: new Date()
        });
      } else {
        await db.collection('translations').add(data);
      }
      
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to upload key ${key}:`, err.message);
    }
  }

  console.log(`✅ Successfully seeded ${successCount} translations.`);
  process.exit(0);
}

seedLanguages().catch(err => {
  console.error('💥 Fatal Seed Error:', err);
  process.exit(1);
});
