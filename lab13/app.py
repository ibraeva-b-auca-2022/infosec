import os
from flask import Flask, request, jsonify

app = Flask(__name__)

# Словарь для хранения логов в памяти
saved_logs = {}

# Файл для постоянного хранения
log_file = "log.txt"

# Создаем файл, если его нет
if not os.path.exists(log_file):
    open(log_file, "w", encoding="utf-8").close()

@app.route('/save', methods=['POST', 'GET'])
def save_log():
    if request.method == 'POST':
        data = request.json
        logs = data.get("logs", "") if data else ""
        if logs:
            # Сохраняем в файл
            with open(log_file, "a", encoding="utf-8") as f:
                f.write(logs + "\n")
            # Сохраняем в словарь (ключ — количество записей)
            key = str(len(saved_logs) + 1)
            saved_logs[key] = logs
        return jsonify({"status": "success", "saved_logs_count": len(saved_logs)}), 200

    elif request.method == 'GET':
        # Возвращаем все сохраненные логи
        return jsonify(saved_logs), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)

