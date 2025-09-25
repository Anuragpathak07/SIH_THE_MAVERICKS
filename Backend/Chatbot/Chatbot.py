import os
import json
import asyncio
from typing import Any, Dict, List
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY1")
if not API_KEY:
    raise ValueError("Set GOOGLE_API_KEY in your .env file")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash-lite")

MAX_MESSAGES = 10
CONVERSATION_LOG = "conversation_log.json"

# ---- Seed with system prompt ----
from .prompts import system_prompt
messages = [{"role": "model", "parts": [{"text": system_prompt}]}]


# ---------------- Helpers ----------------
def log_message(level: str, message: str):
    logos = {
        "info": "🟢 [BOT INFO]",
        "warn": "🟡 [BOT WARN]",
        "error": "🔴 [BOT ERROR]",
        "ask": "❓ [BOT ASK]",
        "brain": "🧠 [BOT PLAN]",
        "bot": "🤖 [BOT]",
    }
    prefix = logos.get(level.lower(), "ℹ️ [BOT]")
    print(f"{prefix} {message}")


def trim_history(msgs, max_len=MAX_MESSAGES):
    if len(msgs) <= max_len:
        return msgs
    return [msgs[0]] + msgs[-(max_len - 1):]


# def append_to_conversation_log(user_query, assistant_response):
#     # Removed file write / JSON dump
#     log_message("info", f"User: {user_query}")
#     log_message("info", f"Assistant: {assistant_response}")


def extract_all_json(text: str) -> List[Dict[str, Any]]:
    results = []
    s = text
    start = None
    depth = 0
    for i, ch in enumerate(s):
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                candidate = s[start:i+1]
                try:
                    results.append(json.loads(candidate))
                except Exception:
                    pass
                start = None
    return results


def process_user_query(user_query: str) -> Dict[str, Any]:
    global messages
    chat = model.start_chat(history=messages)

    messages.append({"role": "user", "parts": [{"text": user_query}]})
    messages = trim_history(messages)

    try:
        resp = chat.send_message(user_query)
    except Exception as e:
        return {"final": f"❌ Gemini API error: {e}"}

    raw = resp.text.strip()
    steps = extract_all_json(raw)

    reply = None

    step_handlers = {
        "output": lambda step: step.get("content") or step.get("output"),
        "ask_user": lambda step: f"❓ {step.get('question')}",
    }

    for step in steps:
        stype = (step.get("step") or "").lower()
        if stype == "output" and not reply:  # first valid output wins
            reply = step_handlers["output"](step)
        elif stype == "ask_user" and reply is None:  # only if no output yet
            reply = step_handlers["ask_user"](step)

    if not reply:
        reply = raw

    messages.append({"role": "model", "parts": [{"text": reply}]})
    messages = trim_history(messages)
    #append_to_conversation_log(user_query, reply)

    return {"final": reply}
             #"Malanjkhand Copper Mine Madhya Pradesh",
            #"Tummalapalle Uranium Mine Andhra Pradesh",
            #"Khetri Copper Mine Rajasthan",
            #"Jharia Coal Mine Jharkhand",
            #"Singrauli Coalfield Madhya Pradesh",
            #"Bailadila Iron Ore Mines Chhattisgarh",
            #"Rampura Agucha Mines",