from services.ai_service import AIService
from services.media_service import MediaService
from services.rag_service import RagService
import base64
from concurrent.futures import ThreadPoolExecutor

rag_service = RagService()
executor = ThreadPoolExecutor(max_workers=5)

class AIController:
    @staticmethod
    def get_legal_guidance(query, language, mode, image_data=None, pdf_data=None):
        pipeline_steps = ["🔄 Initializing NyayaSetu Legal Engine..."]
        simple_rules = """
- Provide 5 short, actionable bullet points.
- **IMPORTANT**: If an image/document is provided, your first point MUST summarize its specific content (e.g., "This is a contract between X and Y regarding Z").
- Use plain everyday language.
- Each point must be one clear sentence."""

        detailed_rules = """
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
- [Provide 1 or 2 clickable Markdown links to official Indian government portals relevant to the query]"""

        mode_rules = simple_rules if mode == "simple" else detailed_rules

        system_content = f"""You are **NyayaSetu AI**, a legal assistant for Indian citizens.

---
## 🌐 LANGUAGE RULE
* You MUST respond ONLY in the **Selected Language: {language}**
* DO NOT mix multiple languages (e.g., do not mix Tamil and English). If the selected language is Tamil, the entire response must be in Tamil.
* Ignore any language mentioned inside the user query.

---
## 📌 LEGAL CONTEXT
- FIR process: Sections 173-175 BNSS (formerly Sec 154 CrPC).
- Legal Aid (NALSA): Article 39A Constitution + Legal Services Authorities Act, 1987.
- Rights of arrested persons: Section 47 BNSS, 2023.
---
## ⚖️ LEGAL GUARDRAILS (CRITICAL):
1. **Age Requirements**: For inter-caste/Special Marriage Act cases, explicitly state the legal age: **21 (Male)** and **18 (Female)**.
2. **Protection Orders**: Cite the **Protection of Women from Domestic Violence Act, 2005** for protection orders in domestic relationships. For maintenance, cite **Sections 144-147 BNSS, 2023** (formerly Section 125 CrPC). For temporary injunctions, cite **Section 9 of the Family Courts Act, 1984**.
3. **POSCO Warning**: DO NOT cite POSCO for adult marriages. POSCO applies ONLY to minors.
4. **Section 498A**: This applies post-marriage for cruelty by husband/relatives. For pre-marriage harassment/intimidation, cite the **SC/ST (Prevention of Atrocities) Act, 1989** only if the victim belongs to a Scheduled Caste or Scheduled Tribe; otherwise cite **Section 351 BNS, 2023** (Criminal Intimidation).
5. **Domestic Violence**: The Protection of Women from Domestic Violence Act, 2005 applies to domestic relationships.

---
## 🎯 ACCURACY & REALITY CHECK (MANDATORY):
- **Cite REAL Acts**: You MUST mention the specific year of the Act (e.g., Bharatiya Nyaya Sanhita, 2023).
- **Fact-Only Reasoning**: Do not assume facts. If the user query is vague, ask for clarification or state: "Based on the provided information..."
- **Section Verification**: Every section number you cite MUST exist in the current Indian Statute. If you are unsure of the exact section, cite the **NAME of the Act** and the **Legal Principle** rather than guessing a number.
- **New Law Priority**: Always prioritize the **New Laws (BNS, BNSS, BSA)** over the old ones (IPC, CrPC, IEA), but mention the old ones in brackets for clarity (e.g., "Section 103 BNS (formerly Section 302 IPC)").

MODE SELECTED: "{mode}"
{mode_rules}
"""
        # 1. & 2. PARALLEL EXECUTION: Media Analysis and RAG Retrieval
        media_future = None
        if image_data or pdf_data:
            pipeline_steps.append("🔍 Analyzing visual evidence...")
            media_items = []
            if image_data:
                media_items.append({"mime_type": "image/jpeg", "data": base64.b64decode(image_data)})
            if pdf_data:
                media_items.append({"mime_type": "application/pdf", "data": base64.b64decode(pdf_data)})
            media_future = executor.submit(MediaService.analyze_media_context, media_items)

        # Start RAG search in parallel
        print(f"🔍 RAG: Searching database for: '{query[:50]}...'")
        pipeline_steps.append("📚 Searching legal database for precedents...")
        rag_future = executor.submit(rag_service.query, query, n_results=2)

        # Wait for results
        if media_future:
            try:
                nvidia_context = media_future.result()
                if nvidia_context:
                    pipeline_steps.append("🧠 Context extracted from media.")
                    query = f"{query}\n\n[DETAILED MEDIA CONTEXT]:\n{nvidia_context}"
                else:
                    pipeline_steps.append("ℹ️ Media analysis yielded no specific text.")
            except Exception as media_err:
                print(f"❌ Media Analysis Error: {media_err}")
                pipeline_steps.append("⚠️ Media analysis skipped (Error).")

        try:
            legal_context = rag_future.result()
            if legal_context:
                print("📖 RAG: Found relevant legal context in local database.")
                pipeline_steps.append("📖 Relevant legal context found.")
                # Make it more prominent for the LLM
                query = f"""### ⚖️ MANDATORY LEGAL REFERENCE (USE THIS TO ANSWER):
{legal_context}

---
### 📝 USER QUESTION:
{query}"""
            else:
                print("ℹ️ RAG: No specific local context found.")
                pipeline_steps.append("ℹ️ No specific local precedents found; using general knowledge.")
        except Exception as rag_err:
            print(f"❌ RAG Error: {rag_err}")
            pipeline_steps.append("⚠️ Legal database search skipped (Error).")

        pipeline_steps.append("⚖️ Applying Indian Law reasoning...")

        # Final safety check for query
        if not query.strip():
            query = "Analyze the provided context and images/PDFs and provide legal guidance according to the system instructions."

        messages = [
            {"role": "system", "content": system_content},
            {"role": "user", "content": query}
        ]
        
        # Keep raw media for Gemini (if it supports it)
        if image_data:
            messages.append({"role": "user", "type": "image", "data": image_data})
        if pdf_data:
            messages.append({"role": "user", "type": "pdf", "data": pdf_data})
        
        answer, model = AIService.call_ai(messages)
        pipeline_steps.append(f"✅ Analysis complete using {model}")
        
        return {
            "answer": answer,
            "model_used": model,
            "mode": mode,
            "pipeline_steps": pipeline_steps
        }


    @staticmethod
    def evaluate_response(user_query, mode, ai_response):
        # 1. Use RAG to get the ground truth for verification
        print(f"🔍 RAG Verification: Searching laws to verify AI response...")
        legal_context = rag_service.query(user_query, n_results=3)
        
        evaluation_prompt = f"""You are an expert legal auditor. Verify the accuracy of the AI Response based on the provided Legal Context.

### 📖 LEGAL CONTEXT (GROUND TRUTH):
{legal_context if legal_context else "No specific context found. Use general Indian legal knowledge."}

---
### 📝 USER QUERY: 
{user_query}

### 🤖 AI RESPONSE TO VERIFY:
{ai_response}

---
## OUTPUT FORMAT (MANDATORY):
You MUST provide your evaluation in this EXACT structure:

### 📊 Final Score: [Score]/10
### ✅ Mode Compliance: [Pass/Fail]
### 🏗️ Structure: [Good/Needs Improvement]
### ⚖️ Legal Accuracy: [Good/Needs Improvement]
### 🏁 Final Verdict: [Approved/Needs Fix]

[Followed by a detailed section-by-section breakdown of WHY these ratings were given, pointing out specific errors or strengths.]"""

        evaluation, model = AIService.call_ai(evaluation_prompt)
        return {
            "evaluation": evaluation,
            "model_used": model
        }
