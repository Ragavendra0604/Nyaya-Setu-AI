from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Legal Context
LEGAL_CONTEXT = """
You are NyayaSetu AI, a legal guidance assistant for Indian citizens.

Always include the disclaimer:
"This is not legal advice."

FIR:
- Anyone can file FIR
- Can be filed at any police station (Zero FIR)

Legal Aid:
- Free legal aid available under NALSA

Rights of Arrest:
- Must be produced before magistrate within 24 hours
"""

# API Keys
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not openrouter_api_key and not gemini_api_key:
    raise ValueError("At least one API key (OPENROUTER or GEMINI) is required")

# OpenRouter Client
openrouter_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openrouter_api_key or "sk-no-key",
    default_headers={
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "NyayaSetu AI",
    }
)

# Gemini Client
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    gemini_model = genai.GenerativeModel("gemini-2.5-flash")
else:
    gemini_model = None

@app.route("/")
def home():
    return {"message": "Backend Running"}

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        user_query = data.get("query")
        language = data.get("language", "English")
        mode = data.get("mode", "simple")

        if not user_query:
            return jsonify({"error": "Query required"}), 400

        # System Prompt — NyayaSetu AI v3
        simple_rules = """
OUTPUT FORMAT — STRICTLY FOLLOW:
1. [First action the user must take]
2. [Second action]
3. [Third action]
4. [Fourth action]
5. [Fifth action — optional]

RULES:
- ONLY output the numbered list above. Nothing else.
- NO headings, NO introductions, NO legal sections, NO disclaimers.
- Use plain everyday language a village resident can understand.
- Each step must be one sentence."""

        detailed_rules = f"""
You MUST produce EXACTLY this 5-section structure using Markdown formatting. Add relevant emojis to each heading to make it look professional.

### 📝 1. Overview
[Write 2-3 sentences explaining the legal situation in simple terms. Use bold text for key terms.]

### ⚖️ 2. Relevant Law
[MANDATORY: Name the exact IPC section OR BNSS section that applies, then explain in one plain sentence.
Example format: "**Section 379 IPC / Section 303 BNSS** — Covers theft, punishable by up to 3 years imprisonment."]

### 🛠️ 3. Steps to Follow
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]
5. [Step 5]

### 📌 4. Important Notes
- [Key right or practical tip]
- [Another warning or tip]

### 🔗 5. Official Resources
- [Provide 1 or 2 clickable Markdown links to official Indian government portals relevant to the query (e.g. `[National Cyber Crime Reporting Portal](https://cybercrime.gov.in)` for cybercrime, `[NALSA](https://nalsa.gov.in)` for legal aid, `[NCW](https://ncw.nic.in)` for women, etc.)]

CRITICAL: ALL five sections are MANDATORY. "Relevant Law" MUST name a specific IPC/BNSS section.
Do NOT output anything before "### 📝 1. Overview"."""

        mode_rules = simple_rules if mode == "simple" else detailed_rules

        system_content = f"""You are **NyayaSetu AI**, a legal assistant for Indian citizens.

---
## 🌐 LANGUAGE RULE (VERY IMPORTANT)
* You MUST respond ONLY in the **Selected Language: {language}**
* Ignore any language mentioned inside the user query
* If Selected Language = Tamil → respond fully in Tamil
* If Selected Language = Hindi → respond fully in Hindi
* If Selected Language = English → respond fully in English

---
## 📌 LEGAL CONTEXT (USE WHEN RELEVANT)
- FIR process: Sections 173-175 BNSS (formerly Sec 154 CrPC). Zero FIR allowed at any station.
- Legal Aid (NALSA): Article 39A Constitution + Legal Services Authorities Act 1987.
- Rights of arrested persons: Section 47 BNSS — produced before magistrate within 24 hours.
- Theft, cybercrime, harassment laws: Section 303 BNSS, IT Act 2000, Section 78 BNS.
- IPC / BNSS laws.

---
## FINAL RULE
* Follow selected mode strictly
* Follow selected language strictly
* Do not mix formats

MODE SELECTED: "{mode}"
{mode_rules}
"""

        messages = [
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_query}
        ]

        # ── PROVIDER 1: Gemini (1500 free req/day) ─────────────────────────────
        if gemini_model:
            try:
                print(f"Attempting query [Mode: {mode}, Lang: {language}] with model: Gemini 2.5 Flash")
                gemini_prompt = f"{system_content}\n\nUser Query: {user_query}"
                gemini_response = gemini_model.generate_content(gemini_prompt)
                return jsonify({
                    "answer": gemini_response.text,
                    "model_used": "google/gemini-2.5-flash",
                    "mode": mode
                })
            except Exception as e:
                print(f"DEBUG: Gemini failed: {str(e)}")

        # ── PROVIDER 2: OpenRouter Free Models ──────────────────────
        # Source: https://openrouter.ai/api/v1/models (verified 2026-04-29)
        openrouter_models = [
            "meta-llama/llama-3.3-70b-instruct:free",   # Best free model (70B)
            "openai/gpt-oss-120b:free",                  # OpenAI OSS 120B
            "google/gemma-3-27b-it:free",                # Gemma 3 27B
            "google/gemma-4-26b-a4b-it:free",            # Gemma 4
            "nvidia/nemotron-3-super-120b-a12b:free",    # NVIDIA 120B
            "nousresearch/hermes-3-llama-3.1-405b:free", # Hermes 405B
            "inclusionai/ling-2.6-1t:free",              # Ling fallback
        ]

        last_error = None
        for model in openrouter_models:
            try:
                print(f"Attempting query [Mode: {mode}, Lang: {language}] with model: {model}")
                response = openrouter_client.chat.completions.create(
                    model=model,
                    messages=messages,
                    timeout=30
                )
                answer = response.choices[0].message.content
                return jsonify({
                    "answer": answer,
                    "model_used": model,
                    "mode": mode
                })
            except Exception as e:
                print(f"DEBUG: Model {model} failed: {str(e)}")
                last_error = str(e)
                continue

        return jsonify({
            "error": "All AI providers failed to respond",
            "details": last_error
        }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Shared AI caller (used by both /ask and /evaluate)
def call_ai(prompt_text):
    """Try Gemini first, then OpenRouter fallbacks. Returns answer string or raises."""
    # 1. Gemini
    if gemini_model:
        try:
            resp = gemini_model.generate_content(prompt_text)
            return resp.text, "google/gemini-2.5-flash"
        except Exception as e:
            print(f"DEBUG: Gemini failed in call_ai: {e}")

    # 2. OpenRouter fallbacks
    fallback_models = [
        "meta-llama/llama-3.3-70b-instruct:free",
        "openai/gpt-oss-120b:free",
        "google/gemma-3-27b-it:free",
        "google/gemma-4-26b-a4b-it:free",
        "inclusionai/ling-2.6-1t:free",
    ]
    for model in fallback_models:
        try:
            resp = openrouter_client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt_text}],
                timeout=30
            )
            return resp.choices[0].message.content, model
        except Exception as e:
            print(f"DEBUG: {model} failed in call_ai: {e}")
            continue

    raise RuntimeError("All AI providers unavailable")


# /evaluate endpoint
@app.route("/evaluate", methods=["POST"])
def evaluate():
    try:
        data = request.get_json()
        user_query  = data.get("user_query", "")
        mode        = data.get("mode", "simple")
        ai_response = data.get("ai_response", "")

        if not user_query or not ai_response:
            return jsonify({"error": "user_query and ai_response are required"}), 400

        evaluation_prompt = f"""You are an expert evaluator reviewing the output of an AI legal assistant called "NyayaSetu AI".

Evaluate whether the response meets the required standards for correctness, structure, and quality.

---

## INPUT:

User Query: {user_query}
Mode: {mode}
AI Response:
{ai_response}

---

## EVALUATION CRITERIA:

### 1. Mode Compliance
- If mode = "simple": short answer, 4-5 steps only, no headings, no legal sections.
- If mode = "detailed": MUST include Overview, Relevant Law (IPC/BNSS), Steps to Follow, Important Notes.

### 2. Structure Quality – Is the response well organized and readable?

### 3. Legal Relevance – Does it mention correct Indian law concepts?

### 4. Clarity & Simplicity – Is the language easy to understand?

### 5. Completeness – Does it fully answer the user query?

### 6. Safety & Disclaimer – Does it real and valid.

---

## OUTPUT FORMAT (use exactly this):

### Final Score: X/10

### Mode Compliance:
(Pass / Fail + reason)

### Structure:
(Good / Needs Improvement + reason)

### Legal Accuracy:
(Good / Needs Improvement + reason)

### Clarity:
(Good / Needs Improvement + reason)

### Completeness:
(Good / Needs Improvement + reason)

### Issues Found:
* Issue 1
* Issue 2

### Final Verdict:
(Approved / Needs Fix)"""

        print(f"Running evaluation for query: {user_query[:60]}...")
        evaluation, model_used = call_ai(evaluation_prompt)

        return jsonify({
            "evaluation": evaluation,
            "model_used": model_used
        })

    except RuntimeError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)