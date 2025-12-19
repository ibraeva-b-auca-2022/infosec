from flask import Flask, render_template, request, jsonify, abort
import os, json, secrets, time
import hashlib

app = Flask(__name__)

BASE_DIR = os.path.dirname(__file__)
QUIZ_PATH = os.path.join(BASE_DIR, "..", "data", "quiz.json")
HASH_PATH = os.path.join(BASE_DIR, "..", "data", "quiz.sha256")

ATTEMPTS = {}
TTL = 10 * 60

def load_questions():
    check_integrity_or_die()
    with open(QUIZ_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    validate_quiz_schema_or_die(data)
    return data

def cleanup():
    now = int(time.time())
    dead = [aid for aid, a in ATTEMPTS.items() if now - a["created"] > TTL]
    for aid in dead:
        ATTEMPTS.pop(aid, None)

def pick_count(level):
    return {"easy": 15, "medium": 19, "hard": 28}[level]

def file_sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def check_integrity_or_die():
    if not os.path.exists(HASH_PATH):
        raise RuntimeError(f"Integrity file not found: {HASH_PATH}")

    expected = open(HASH_PATH, "r", encoding="utf-8").read().strip().lower()
    if not expected:
        raise RuntimeError("quiz.sha256 is empty")

    actual = file_sha256(QUIZ_PATH).lower()
    if actual != expected:
        raise RuntimeError(
            "quiz.json integrity check failed - SHA-256 mismatch. "
            "File may be modified or corrupted."
        )

def validate_quiz_schema_or_die(data):
    if not isinstance(data, list):
        raise ValueError("quiz.json must be a JSON array")

    required = {"id", "question", "options", "answer", "level"}
    valid_levels = {"easy", "medium", "hard"}

    seen_ids = set()

    for i, q in enumerate(data):
        if not isinstance(q, dict):
            raise ValueError(f"Question #{i} must be an object")

        missing = required - set(q.keys())
        if missing:
            raise ValueError(f"Question #{i} missing fields: {sorted(missing)}")

        qid = q["id"]
        if not isinstance(qid, str) or not qid.strip():
            raise ValueError(f"Question #{i} has invalid id")
        if qid in seen_ids:
            raise ValueError(f"Duplicate id found: {qid}")
        seen_ids.add(qid)

        if not isinstance(q["question"], str) or not q["question"].strip():
            raise ValueError(f"Question {qid}: 'question' must be a non-empty string")

        opts = q["options"]
        if not isinstance(opts, list) or len(opts) < 2:
            raise ValueError(f"Question {qid}: 'options' must be a list with at least 2 items")
        if not all(isinstance(x, str) and x.strip() for x in opts):
            raise ValueError(f"Question {qid}: all options must be non-empty strings")
        if len(set(opts)) != len(opts):
            raise ValueError(f"Question {qid}: options contain duplicates")

        ans = q["answer"]
        if not isinstance(ans, str) or not ans.strip():
            raise ValueError(f"Question {qid}: 'answer' must be a non-empty string")
        if ans not in opts:
            raise ValueError(f"Question {qid}: answer must be one of the options")

        lvl = str(q["level"]).lower()
        if lvl not in valid_levels:
            raise ValueError(f"Question {qid}: invalid level '{q['level']}' (must be easy/medium/hard)")


@app.route("/")
def index():
    return render_template("index.html")

@app.get("/api/start")
def api_start():
    cleanup()
    level = request.args.get("level", "easy").lower()
    if level not in ("easy", "medium", "hard"):
        abort(400, "bad level")

    all_q = load_questions()
    pool = [q for q in all_q if q.get("level", "").lower() == level]
    need = pick_count(level)

    if len(pool) < need:
        abort(500, f"Not enough questions for {level}: have {len(pool)}, need {need}")

    import random
    chosen = random.sample(pool, need)

    attempt_id = secrets.token_urlsafe(16)
    qids = [q["id"] for q in chosen]
    ATTEMPTS[attempt_id] = {"qids": qids, "created": int(time.time()), "level": level}

    public = [{"id": q["id"], "question": q["question"], "options": q["options"], "level": q["level"]} for q in chosen]
    return jsonify({"attempt_id": attempt_id, "questions": public})

@app.post("/api/submit")
def api_submit():
    cleanup()
    data = request.get_json(silent=True) or {}
    attempt_id = data.get("attempt_id")
    answers = data.get("answers")

    if not isinstance(attempt_id, str) or not isinstance(answers, dict):
        abort(400, "bad payload")

    attempt = ATTEMPTS.get(attempt_id)
    if not attempt:
        abort(400, "expired/unknown attempt")

    all_q = load_questions()
    by_id = {q["id"]: q for q in all_q}

    correct = 0
    incorrect = 0
    answered = 0

    for qid in attempt["qids"]:
        if qid not in answers:
            continue
        answered += 1
        if answers[qid] == by_id.get(qid, {}).get("answer"):
            correct += 1
        else:
            incorrect += 1

    ATTEMPTS.pop(attempt_id, None)

    return jsonify({
        "total": len(attempt["qids"]),
        "answered": answered,
        "correct": correct,
        "incorrect": incorrect
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
