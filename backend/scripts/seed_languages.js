const { db } = require('../config/firebase');
const fs = require('fs');
const path = require('path');

const LANGUAGES = ['en', 'hi', 'ta'];
const CATEGORIES = ['auth', 'chat', 'dashboard', 'forgot', 'login', 'otp'];

function flattenObject(obj, prefix = '') {
  const result = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = Array.isArray(value)
        ? value.join('|')
        : value;
    }
  }

  return result;
}

async function seedLanguages() {
  console.log('🚀 Starting Language Seed Script...');

  const translations = {};

  for (const category of CATEGORIES) {
    for (const lang of LANGUAGES) {
      const filePath = path.join(
        __dirname,
        `../../frontend/src/locals/${lang}/${category}.json`
      );

      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${filePath}`);
        continue;
      }

      try {
        const content = JSON.parse(
          fs.readFileSync(filePath, 'utf8')
        );

        const flatContent = flattenObject(content);

        Object.keys(flatContent).forEach((key) => {
          const translationKey = `${category}.${key}`;

          if (!translations[translationKey]) {
            translations[translationKey] = {
              key: translationKey,
              category,
              en: '',
              hi: '',
              ta: '',
            };
          }

          translations[translationKey][lang] = flatContent[key];
        });

      } catch (err) {
        console.error(`❌ Error parsing ${filePath}:`, err.message);
      }
    }
  }

  console.log(
    `📦 Prepared ${Object.keys(translations).length} translation keys.`
  );

  let successCount = 0;

  for (const key of Object.keys(translations)) {
    try {
      const data = {
        ...translations[key],
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existing = await db
        .collection('translations')
        .where('key', '==', data.key)
        .get();

      if (!existing.empty) {
        console.log(`🔄 Updating existing key: ${data.key}`);

        await db
          .collection('translations')
          .doc(existing.docs[0].id)
          .update({
            ...data,
            updatedAt: new Date(),
          });
      } else {
        console.log(`➕ Adding key: ${data.key}`);

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

seedLanguages().catch((err) => {
  console.error('💥 Fatal Seed Error:', err);
  process.exit(1);
});
