import os
from flask import Flask, request, jsonify

app = Flask(__name__)

LOG_FILE = "logs.txt"

if not os.path.exists(LOG_FILE):
    open(LOG_FILE, "w").close()

@app.route("/post", methods=["POST"])
def receive_logs():
    data = request.json
    logs = data.get("logs", "")
    if logs.strip():
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(logs + "\n")
    return jsonify({"status": "success"}), 200

@app.route("/logs", methods=["GET"])
def show_logs():
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    return f"<pre>{content}</pre>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

