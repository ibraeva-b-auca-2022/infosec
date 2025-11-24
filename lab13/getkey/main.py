from getkey import getkey
import time
from typing import List

char_count = 0
saved_keys: List[str] = []
current_line: List[str] = []

def on_key_press(key):
    pass  # больше ничего не выводим

def on_key_release(key):
    global saved_keys, char_count, current_line

    if key == '\x1b':  # ESC
        return False

    if key == '\n':  # Enter → сохраняем текущую строку сразу
        line = "".join(current_line)
        saved_keys.append(line)
        write_to_file([line])  # запись в файл сразу
        current_line.clear()
        char_count = 0
        return True

    if key == ' ':
        current_line.append(' ')
        return True

    current_line.append(key)
    char_count += 1
    return True

def write_to_file(keys: List[str]):
    with open("log.txt", "a") as f:
        for line in keys:
            f.write(line + "\n")

start = time.time()

while True:
    if time.time() - start >= 10:
        break

    key = getkey()
    on_key_press(key)

    cont = on_key_release(key)
    if cont is False:
        break

# сохраняем оставшийся текст после таймера
if current_line:
    line = "".join(current_line)
    saved_keys.append(line)
    write_to_file([line])
