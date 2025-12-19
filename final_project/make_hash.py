import hashlib
import os
import sys

BASE_DIR = os.path.dirname(__file__)
QUIZ_PATH = os.path.join(BASE_DIR, "data", "quiz.json")
HASH_PATH = os.path.join(BASE_DIR, "data", "quiz.sha256")

def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def main():
    if not os.path.exists(QUIZ_PATH):
        print(f"Error: quiz.json not found at {QUIZ_PATH}")
        sys.exit(1)

    digest = sha256_file(QUIZ_PATH)

    with open(HASH_PATH, "w", encoding="utf-8") as f:
        f.write(digest)

    print("OK quiz.sha256 updated")
    print(f"SHA-256: {digest}")
    print(f"Saved to: {HASH_PATH}")

if __name__ == "__main__":
    main()
