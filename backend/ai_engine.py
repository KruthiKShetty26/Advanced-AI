from groq import Groq
import os, json, re
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

SYSTEM_PROMPT = """You are a WHO pharmacovigilance specialist. Analyze the text for drug adverse events.

Return ONLY a raw JSON object — no markdown, no ```json, no explanation before or after.

Format:
{
  "drugs": ["exact drug names only"],
  "adverse_events": ["side effects mentioned"],
  "severity": "mild OR moderate OR severe OR life-threatening",
  "severity_reason": "one sentence why",
  "who_causality": "Certain OR Probable OR Possible OR Unlikely",
  "causality_reason": "one sentence why",
  "patient_age": "age string or null",
  "duration": "duration string or null",
  "action_required": "what to do next",
  "confidence_score": 0.85
}

Rules:
- drugs: only actual medication names, NOT symptoms or treatments like 'antihistamines' unless they are the drug being reported on
- adverse_events: only negative effects clearly described
- severity: use 'severe' for anaphylaxis, breathing issues, organ damage; 'life-threatening' for cardiac arrest, coma
- confidence_score: a number between 0 and 1, your certainty
- null for any field not mentioned
- Return ONLY the JSON object"""

def analyze_text(text: str) -> dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': f'Analyze: {text}'}
        ],
        temperature=0.1,
        max_tokens=600
    )
    raw = response.choices[0].message.content.strip()
    
    # Strip markdown code fences if model adds them
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    raw = raw.strip()
    
    # Find JSON object even if there's extra text
    match = re.search(r'\{.*\}', raw, re.DOTALL)
    if match:
        raw = match.group()
    
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: return safe defaults so the UI doesn't crash
        return {
            "drugs": [], "adverse_events": [],
            "severity": "unknown", "severity_reason": "Could not parse response",
            "who_causality": "Unknown", "causality_reason": None,
            "patient_age": None, "duration": None,
            "action_required": "Manual review required",
            "confidence_score": 0.0
        }