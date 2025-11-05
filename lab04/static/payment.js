const cardInput = document.getElementById('card');
cardInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '').slice(0, 16); // только цифры, максимум 16
  e.target.value = value.replace(/(.{4})/g, '$1 ').trim();   // пробелы каждые 4 цифры
});

const expiryInput = document.getElementById('expiry');
expiryInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (value.length >= 3) {
    value = value.slice(0, 2) + '/' + value.slice(2);
  }
  e.target.value = value;
});

// заменяем getElementById на querySelector
const form = document.querySelector('.payment-form');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // всегда перехватываем

  const card = cardInput.value.replace(/\s/g, '');
  const expiry = expiryInput.value;
  const cvv = document.getElementById('cvv').value;

  let errors = [];

  if (card.length !== 16) errors.push('Card number must be 16 digits');
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) errors.push('Expiration date must be MM/YY');
  if (!/^\d{3,4}$/.test(cvv)) errors.push('CVV must be 3 or 4 digits');

  if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  // Если ошибок нет — тут отправка на сервер
  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ card_number: card, expiry_date: expiry, cvv: cvv })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Data sent successfully");
      form.reset();
    })
    .catch(err => {
      console.error(err);
      alert("Something went wrong.");
    });
});

