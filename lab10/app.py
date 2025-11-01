from flask import Flask, request, jsonify, render_template
import os
import re

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello!"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
