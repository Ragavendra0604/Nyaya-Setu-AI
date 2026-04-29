const API_BASE = 'http://localhost:5000';

export const aiService = {
  async askQuestion(query, language, mode) {
    const response = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, mode })
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },

  async evaluateResponse(userQuery, mode, aiResponse) {
    const response = await fetch(`${API_BASE}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_query: userQuery, mode, ai_response: aiResponse })
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
};
