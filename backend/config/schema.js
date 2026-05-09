// Database schema structure for Firestore

// Collections and Documents:

// 1. Users Collection
// /users/{uid}
// {
//   uid: string (auto from Firebase Auth)
//   email: string
//   displayName: string
//   phone: string
//   language: string (en, hi, ta)
//   mode: string (simple, detailed)
//   createdAt: timestamp
//   updatedAt: timestamp
//   isVerified: boolean
//   role: string (citizen, admin)
// }

// 2. Chats Collection
// /chats/{chatId}
// {
//   chatId: string (auto)
//   userId: string (reference to users)
//   title: string
//   messages: array of message objects
//   language: string
//   mode: string (simple, detailed)
//   createdAt: timestamp
//   updatedAt: timestamp
//   // Message structure:
//   // {
//   //   id: string (uuid)
//   //   role: string (user, assistant)
//   //   content: string
//   //   query: string (original query for user messages)
//   //   timestamp: timestamp
//   //   rating?: number (1-5)
//   //   feedback?: string
//   // }
// }

// 3. Languages Collection
// /languages/{languageId}
// {
//   code: string (en, hi, ta)
//   name: string
//   nativeLabel: string
//   enabled: boolean
// }

// 4. Translations Collection
// /translations/{translationId}
// {
//   key: string (unique key like "dashboard.heroTitle")
//   en: string
//   hi: string
//   ta: string
//   category: string (dashboard, auth, chat, etc)
//   createdAt: timestamp
//   updatedAt: timestamp
// }

// 5. Legal Categories Collection
// /legalCategories/{categoryId}
// {
//   id: string
//   short: string (FIR, AID, etc)
//   title: string
//   description: string
//   longDescription: string
//   badge: string
//   category: string (required, support, general)
//   translations: {
//     en: { title, description, longDescription },
//     hi: { ... },
//     ta: { ... }
//   }
//   prompts: array of suggested prompts
//   steps: array of step objects
//   createdAt: timestamp
//   updatedAt: timestamp
// }

// 6. User Feedback Collection
// /feedback/{feedbackId}
// {
//   feedbackId: string (auto)
//   userId: string (reference to users)
//   chatId: string (reference to chats)
//   messageId: string
//   rating: number (1-5)
//   feedback: string
//   language: string
//   createdAt: timestamp
// }

module.exports = {};
