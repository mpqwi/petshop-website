// =========================
//  CARRINHO
// =========================
const cart = [];

const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartEmptyEl = document.getElementById("cart-empty");
const pixValueEl = document.getElementById("pix-value");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart");

const addButtons = document.querySelectorAll(".add-to-cart");

addButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    addToCart(name, price);
    renderCart();
  });
});

function addToCart(name, price) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// deixa a função global pra funcionar no onclick gerado no HTML da tabela
window.removeFromCart = removeFromCart;

function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartEmptyEl.style.display = "block";
    cartTotalEl.textContent = "R$ 0,00";
    pixValueEl.textContent = "R$ 0,00";
    clearQRCode();
    return;
  }

  cartEmptyEl.style.display = "none";

  let total = 0;

  cart.forEach((item, index) => {
    const tr = document.createElement("tr");
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>R$ ${itemTotal.toFixed(2).replace(".", ",")}</td>
      <td>
        <button
          style="border:none;background:none;color:#e74c3c;cursor:pointer;font-size:0.8rem;"
          onclick="removeFromCart(${index})"
        >
          remover
        </button>
      </td>
    `;

    cartItemsEl.appendChild(tr);
  });

  cartTotalEl.textContent = "R$ " + total.toFixed(2).replace(".", ",");
  pixValueEl.textContent = "R$ " + total.toFixed(2).replace(".", ",");
}

// limpar carrinho
clearCartBtn.addEventListener("click", () => {
  cart.length = 0;
  renderCart();
});

// =========================
//  PIX / QR CODE (MODELO)
// =========================
let qrCodeInstance = null;

function clearQRCode() {
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";
  qrCodeInstance = null;
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;
  });

  const pixKey = document.getElementById("pix-key-text").textContent;
  const payload = `Chave PIX: ${pixKey} | Valor: ${total.toFixed(2)}`;

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  qrCodeInstance = new QRCode(qrContainer, {
    text: payload,
    width: 160,
    height: 160,
  });

  alert("QR Code PIX de exemplo gerado com o valor do carrinho. ✅");
});

// =========================
//  AGENDAMENTO (WHATSAPP)
// =========================
const bookingForm = document.getElementById("booking-form");
const whatsappDirectBtn = document.getElementById("whatsapp-direct");

// TROQUE ESTE NÚMERO PELO WHATSAPP REAL DA CLÍNICA
const WHATSAPP_NUMBER = "5599999999999";

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("cliente").value;
    const telefone = document.getElementById("telefone").value;
    const pet = document.getElementById("pet").value;
    const data = document.getElementById("data").value;
    const servico = document.getElementById("servico").value;
    const obs = document.getElementById("obs").value;

    const mensagem =
      `Olá! Gostaria de agendar um atendimento:%0A%0A` +
      `👤 Nome: ${nome}%0A` +
      `📱 Telefone: ${telefone}%0A` +
      `🐾 Pet: ${pet}%0A` +
      `📅 Data desejada: ${data}%0A` +
      `🩺 Serviço: ${servico}%0A` +
      `📝 Observações: ${obs || "Nenhuma."}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;
    window.open(url, "_blank");
  });
}

if (whatsappDirectBtn) {
  whatsappDirectBtn.addEventListener("click", () => {
    const mensagem = encodeURIComponent(
      "Olá! Gostaria de informações sobre agendamento para meu pet. 🐾"
    );
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;
    window.open(url, "_blank");
  });
}

// =========================
//  FOOTER – ANO ATUAL
// =========================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
