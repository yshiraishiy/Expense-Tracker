const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const dummyTransactions = [
  { id: 1, text: "Flower", amount: -20 },
  { id: 2, text: "Salary", amount: 300 },
  { id: 3, text: "Book", amount: -10 },
  { id: 4, text: "Camera", amount: 150 },
];

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transaction")
);

let transactions =
  localStorage.getItem("transaction") !== null ? localStorageTransactions : [];

// 取引の内容を追加
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

// ランダムなIDを作成
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// 取引をDOMリストに追加
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // 金額に基づいて'class'を追加
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" data-id="${transaction.id}">X</button>
  `;

  list.appendChild(item);
}

// 収入と支出を計算し合計値を計算
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerHTML = `
    $${total}
  `;
  money_plus.innerHTML = `
  $${income}
  `;
  money_minus.innerHTML = `
  $${expense}
  `;
}

// IDを基に取引を削除
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();

  init();
}

// イベントデリゲーションを使用して削除ボタンを監視
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.getAttribute("data-id"));
    removeTransaction(id);
  }
});

// 取引の内容をローカルストレージに保存
function updateLocalStorage() {
  localStorage.setItem("transaction", JSON.stringify(transactions));
}

// アプリを初期化
function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
