import os
from flask import Flask, jsonify

app = Flask(__name__)

LOG_FILE = "log.txt"

@app.route("/server", methods=["GET"])
def show_logs():
    if not os.path.exists(LOG_FILE):
        return jsonify({"logs": ""}), 200

    with open(LOG_FILE, "r") as f:
        content = f.read()

    return jsonify({"logs": content}), 200


if __name__ == "__main__":
    if not os.path.exists(LOG_FILE):
        open(LOG_FILE, "w").close()

    app.run(host="0.0.0.0", port=8000)

