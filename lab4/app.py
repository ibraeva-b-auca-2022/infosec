from flask import Flask, request, jsonify, render_template
import os
import re

app = Flask(__name__)
DATA_FILE = "fake_cards.txt"


def save_card_data(card_number, expiry_date, cvv):
    with open(DATA_FILE, "a", encoding="utf-8") as f:
        f.write(f"Card: {card_number}, Expiry: {expiry_date}, CVV: {cvv}\n")


def validate_card_data(card_number, expiry_date, cvv):
    card_ok = bool(re.fullmatch(r"\d{13,19}", card_number))
    expiry_ok = bool(re.fullmatch(r"(0[1-9]|1[0-2])/[0-9]{2}", expiry_date))
    cvv_ok = bool(re.fullmatch(r"\d{3,4}", cvv))
    return card_ok and expiry_ok and cvv_ok


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/submit", methods=["POST"])
def submit_data():
    data = request.get_json()
    card_number = data.get("card_number")
    expiry_date = data.get("expiry_date")
    cvv = data.get("cvv")

    if not card_number or not expiry_date or not cvv:
        return jsonify({"message": "Missing fields"}), 400

    if not validate_card_data(card_number, expiry_date, cvv):
        return jsonify({"message": "Invalid format"}), 400

    save_card_data(card_number, expiry_date, cvv)
    return jsonify({"message": "Data saved."}), 200


if __name__ == "__main__":
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            f.write("=== Collected data ===\n")
    app.run(debug=True, host="0.0.0.0", port=8000)

