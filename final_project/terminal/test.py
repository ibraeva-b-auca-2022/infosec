import json
import random

# Загрузка вопросов из JSON-файла
with open("quiz.json", "r") as f:
    all_questions = json.load(f)

def run_quiz(questions):
    score = 0
    random.shuffle(questions)  # Случайный порядок вопросов

    print("=== Welcome to the Linux Command Quiz Game! ヽ(・∀・)ﾉ ===\n")
    print("Type the number of the correct answer and press Enter.")
    print("Type 'q' or 'exit' to quit anytime.\n")

    for i, q in enumerate(questions, 1):
        print(f"Question {i}: {q['question']}")

        # Случайно перемешиваем варианты ответов
        options = q["options"].copy()
        random.shuffle(options)

        for idx, option in enumerate(options, 1):
            print(f"{idx}. {option}")

        # Получаем корректный ввод пользователя
        while True:
            choice = input("Your choice (1-4 or q to quit): ").strip().lower()
            if choice in ["q", "exit"]:
                print("\nExiting the game...")
                print(f"Your final score: {score}/{len(questions)}")
                return
            try:
                choice_num = int(choice)
                if 1 <= choice_num <= 4:
                    break
                else:
                    print("Please enter a number between 1 and 4. ( ╥ω╥ )")
            except ValueError:
                print("Invalid input. Enter a number between 1 and 4, or 'q' to quit. ( ╥ω╥ )")

        selected_option = options[choice_num - 1]
        if selected_option == q["answer"]:
            print("Correct! ヽ(・∀・)ﾉ\n")
            score += 1
        else:
            print(f"Wrong! Correct answer: {q['answer']} ( ╥ω╥ )\n")

    print(f"=== Quiz Finished! Your total score: {score}/{len(questions)} ===")

    # Оценка игрока с каомодзи
    if score == len(questions):
        print("°˖✧◝(⁰▿⁰)◜✧˖° Excellent! You know your Linux commands perfectly!")
    elif score >= len(questions) // 2:
        print("(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Good job! Keep practicing to improve.")
    else:
        print("ヾ( ￣O￣)ツ Warning! You need more practice with Linux commands.")

if __name__ == "__main__":
    # Выбор уровня сложности
    while True:
        level = input("Choose difficulty level (easy, medium, hard): ").strip().lower()
        if level in ["easy", "medium", "hard"]:
            break
        else:
            print("Invalid choice. Please enter 'easy', 'medium', or 'hard'. ( ╥ω╥ )")

    # Фильтруем вопросы по выбранному уровню
    level_questions = [q for q in all_questions if q.get("level") == level]

    run_quiz(level_questions)

