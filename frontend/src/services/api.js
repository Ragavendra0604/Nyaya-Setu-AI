const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginUser(credentials) {
  await wait(600);
  return {
    ok: true,
    user: {
      id: 'demo-user',
      name: 'Naresh',
      contact: credentials.identifier,
    },
  };
}

export async function registerUser(payload) {
  await wait(700);
  return {
    ok: true,
    user: {
      id: 'demo-signup-user',
      name: payload.fullName || 'Demo Citizen',
      contact: payload.phone || payload.email,
    },
  };
}

export async function requestOtp(identifier) {
  await wait(500);
  return {
    ok: true,
    message: `OTP flow placeholder prepared for ${identifier}.`,
  };
}

export async function fetchConversationHistory() {
  await wait(300);
  return {
    ok: true,
    items: [],
  };
}

export async function fetchLegalResources() {
  await wait(300);
  return {
    ok: true,
    items: [],
  };
}

export async function sendLegalQuery(payload) {
  await wait(900);
  return {
    ok: true,
    answer:
      'Backend placeholder: integrate your LLM, legal retrieval, and disclaimer formatting here before production use.',
    meta: {
      language: payload.language,
      category: payload.category ?? 'general',
    },
  };
}

export async function transcribeVoiceInput(blob) {
  await wait(800);
  return {
    ok: true,
    transcript:
      'Voice transcription placeholder. Connect browser audio capture and speech-to-text service here.',
    sourceSize: blob?.size ?? 0,
  };
}

export async function synthesizeVoiceResponse(text) {
  await wait(700);
  return {
    ok: true,
    audioUrl: '',
    message: `Text-to-speech placeholder prepared for ${text.length} characters.`,
  };
}

export async function updateUserSettings(settings) {
  await wait(400);
  return {
    ok: true,
    settings,
  };
}
