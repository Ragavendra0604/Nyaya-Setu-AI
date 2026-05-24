const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// ============ AUTH ENDPOINTS ============
export async function signupUser(credentials) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function syncProfile(profileData) {
  const response = await fetch(`${API_URL}/auth/sync-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  return response.json();
}

export async function getUser(uid) {
  const response = await fetch(`${API_URL}/auth/user/${uid}`);
  return response.json();
}

export async function updateUser(uid, updates) {
  const response = await fetch(`${API_URL}/auth/user/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return response.json();
}

export async function verifyToken(token) {
  const response = await fetch(`${API_URL}/auth/verify-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

// ============ OTP ENDPOINTS (RESEND) ============
export async function sendOtp(email) {
  const response = await fetch(`${API_URL}/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response.json();
}

export async function verifyOtp(email, otp) {
  const response = await fetch(`${API_URL}/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return response.json();
}

// ============ CHAT ENDPOINTS ============
export async function createChat(userId, title = 'New Chat', language = 'en') {
  const response = await fetch(`${API_URL}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, title, language }),
  });
  return response.json();
}

export async function getUserChats(userId) {
  const response = await fetch(`${API_URL}/chats/user/${userId}`);
  return response.json();
}

export async function getChat(chatId) {
  const response = await fetch(`${API_URL}/chats/${chatId}`);
  return response.json();
}

export async function sendMessage(chatId, query, language = 'en', mode = 'simple', isDemo = false, file = null) {
  const formData = new FormData();
  formData.append('query', query);
  formData.append('language', language);
  formData.append('mode', mode);
  formData.append('isDemo', isDemo);
  if (file) {
    formData.append('file', file);
  }

  const response = await fetch(`${API_URL}/chats/${chatId}/message`, {
    method: 'POST',
    body: formData, // No Content-Type header needed for FormData
  });
  return response.json();
}

export async function updateChatTitle(chatId, title) {
  const response = await fetch(`${API_URL}/chats/${chatId}/title`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return response.json();
}

export async function deleteChat(chatId) {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'DELETE',
  });
  return response.json();
}

export async function clearChat(chatId) {
  const response = await fetch(`${API_URL}/chats/${chatId}/clear`, {
    method: 'POST',
  });
  return response.json();
}

export async function rateMessage(chatId, messageId, rating) {
  const response = await fetch(`${API_URL}/chats/${chatId}/message/${messageId}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  });
  return response.json();
}

export async function evaluateResponse(user_query, ai_response, mode = 'simple') {
  const response = await fetch(`${API_URL}/chats/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_query, ai_response, mode }),
  });
  return response.json();
}

// ============ TRANSLATION ENDPOINTS ============
export async function getTranslations(language = 'en') {
  const response = await fetch(`${API_URL}/translations?language=${language}`);
  return response.json();
}

export async function getAllTranslations() {
  const response = await fetch(`${API_URL}/translations/all`);
  return response.json();
}

// ============ LEGAL CATEGORY ENDPOINTS ============
export async function getLegalCategories() {
  const response = await fetch(`${API_URL}/legal-categories`);
  return response.json();
}

export async function getLegalCategory(categoryId) {
  const response = await fetch(`${API_URL}/legal-categories/${categoryId}`);
  return response.json();
}

export async function getLegalCategoryByShort(shortCode) {
  const response = await fetch(`${API_URL}/legal-categories/short/${shortCode}`);
  return response.json();
}

// ============ LEGACY PLACEHOLDER FUNCTIONS (for backward compatibility) ============
export async function loginUser(credentials) {
  // This should now use Firebase Auth directly on frontend + verifyToken on backend
  console.warn('loginUser is deprecated. Use Firebase Auth + verifyToken instead');
  return { ok: false, error: 'Use Firebase Auth' };
}

export async function registerUser(payload) {
  // This should use signupUser instead
  console.warn('registerUser is deprecated. Use signupUser instead');
  return { ok: false, error: 'Use signupUser' };
}

export async function requestOtp(identifier) {
  console.warn('requestOtp placeholder. Implement with Firebase Auth');
  return { ok: true, message: 'OTP flow prepared' };
}

export async function fetchConversationHistory() {
  console.warn('fetchConversationHistory is deprecated. Use getUserChats instead');
  return { ok: false, error: 'Use getUserChats' };
}

export async function fetchLegalResources() {
  console.warn('fetchLegalResources is deprecated. Use getLegalCategories instead');
  return { ok: false, error: 'Use getLegalCategories' };
}

export async function sendLegalQuery(payload) {
  // Use sendMessage instead
  console.warn('sendLegalQuery is deprecated. Use sendMessage instead');
  return { ok: false, error: 'Use sendMessage' };
}

export async function transcribeVoiceInput(blob) {
  console.warn('transcribeVoiceInput placeholder. Implement with speech-to-text service');
  return { ok: true, transcript: 'Voice transcription placeholder', sourceSize: blob?.size ?? 0 };
}

export async function synthesizeVoiceResponse(text, language = 'en') {
  try {
    const response = await fetch(`${API_URL}/chats/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });
    return response.json();
  } catch (error) {
    console.error('Synthesis error:', error);
    return { ok: false, error: error.message };
  }
}

export async function updateUserSettings(settings) {
  // Use updateUser instead
  console.warn('updateUserSettings is deprecated. Use updateUser instead');
  return { ok: false, error: 'Use updateUser' };
}
export async function uploadProfileImage(uid, file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/auth/upload-profile/${uid}`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}