/*
  Daca Sport Landing Page
  Cambia este número si el WhatsApp oficial es otro. Formato requerido: país + número, solo dígitos.
  Ejemplo Venezuela: 584245329551
*/
const WHATSAPP_NUMBER = "584245329551";

const PRODUCT_NAME = "Balón Molten Vantaggio";
const COMPANY_NAME = "Daca Sport C.A.";
const STORE_LOCATION = "C.C. Girarma, local #2, Guanare Edo. Portuguesa";

const PRICING = {
  divisas: {
    label: "Divisas / Zelle / USDT / Wally",
    currency: "$",
    single: 25,
    bulk: 20,
    suffix: "",
    help: "pagando en divisas/Zelle/USDT/Wally"
  },
  bs: {
    label: "Transferencia Bs / Pago móvil",
    currency: "$",
    single: 35,
    bulk: 28,
    suffix: " BCV",
    help: "pagando por transferencia Bs o pago móvil a tasa BCV"
  }
};

const form = document.querySelector("#orderForm");
const quantityInput = document.querySelector("#quantity");
const summaryProduct = document.querySelector("#summaryProduct");
const summaryPrice = document.querySelector("#summaryPrice");
const summaryHelp = document.querySelector("#summaryHelp");
const stickyPrice = document.querySelector("#stickyPrice");
const selectProductButtons = document.querySelectorAll(".select-product");
const revealElements = document.querySelectorAll("[data-reveal]");

function getCheckedValue(name) {
  return form.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function getQuantity() {
  const rawValue = Number.parseInt(quantityInput.value, 10);
  if (Number.isNaN(rawValue) || rawValue < 1) return 1;
  if (rawValue > 99) return 99;
  return rawValue;
}

function getUnitPrice(payment, quantity) {
  const paymentConfig = PRICING[payment];
  return quantity >= 4 ? paymentConfig.bulk : paymentConfig.single;
}

function formatPrice(payment, quantity) {
  const paymentConfig = PRICING[payment];
  const unitPrice = getUnitPrice(payment, quantity);
  const total = unitPrice * quantity;

  if (payment === "bs") {
    return {
      unit: `${paymentConfig.currency}${unitPrice}${paymentConfig.suffix}`,
      total: `${paymentConfig.currency}${total}${paymentConfig.suffix}`,
      help: `Precio para ${quantity} ${quantity === 1 ? "unidad" : "unidades"} ${paymentConfig.help}. El monto final en Bs se confirma al momento de pagar.`
    };
  }

  return {
    unit: `${paymentConfig.currency}${unitPrice}`,
    total: `${paymentConfig.currency}${total}`,
    help: `Precio para ${quantity} ${quantity === 1 ? "unidad" : "unidades"} ${paymentConfig.help}.`
  };
}

function getOrderData() {
  const formData = new FormData(form);
  const payment = getCheckedValue("payment");
  const quantity = getQuantity();
  const price = formatPrice(payment, quantity);

  return {
    product: PRODUCT_NAME,
    color: getCheckedValue("color"),
    type: getCheckedValue("tipo"),
    quantity,
    payment,
    paymentLabel: PRICING[payment].label,
    delivery: getCheckedValue("delivery"),
    customerName: String(formData.get("customerName") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    note: String(formData.get("note") || "").trim(),
    price
  };
}

function updateSummary() {
  const order = getOrderData();
  summaryProduct.textContent = `${order.product} · ${order.color} · ${order.type}`;
  summaryPrice.textContent = `${order.price.unit} c/u · Total ${order.price.total}`;
  summaryHelp.textContent = order.price.help;
  stickyPrice.textContent = `${order.price.unit} c/u`;
}

function buildWhatsAppMessage(order) {
  const nameLine = order.customerName ? `\nNombre: ${order.customerName}` : "";
  const cityLine = order.city ? `\nCiudad/Estado: ${order.city}` : "";
  const noteLine = order.note ? `\nNota: ${order.note}` : "";
  const bcvLine = order.payment === "bs" ? "\nNota de pago: confirmar monto exacto en Bs a tasa BCV vigente." : "";

  return `Hola ${COMPANY_NAME}, quiero comprar este producto:\n\n` +
    `Producto: ${order.product}\n` +
    `Color: ${order.color}\n` +
    `Tipo: ${order.type}\n` +
    `Cantidad: ${order.quantity}\n` +
    `Método de pago: ${order.paymentLabel}\n` +
    `Precio estimado: ${order.price.unit} por unidad / total ${order.price.total}${bcvLine}\n` +
    `Entrega: ${order.delivery}\n` +
    `Tienda: ${STORE_LOCATION}${nameLine}${cityLine}${noteLine}\n\n` +
    `¿Está disponible para comprar ahora?`;
}

function openWhatsApp(order) {
  const message = encodeURIComponent(buildWhatsAppMessage(order));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function setRadioValue(name, value) {
  const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) {
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function scrollToOrder() {
  document.querySelector("#pedido")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupQuantityControls() {
  document.querySelectorAll("[data-qty]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.qty;
      const current = getQuantity();
      const next = direction === "plus" ? current + 1 : current - 1;
      quantityInput.value = String(Math.min(Math.max(next, 1), 99));
      updateSummary();
    });
  });

  quantityInput.addEventListener("input", () => {
    quantityInput.value = String(getQuantity());
    updateSummary();
  });
}

function setupProductSelectors() {
  selectProductButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedColor = button.dataset.selectColor;
      if (selectedColor) setRadioValue("color", selectedColor);
      scrollToOrder();
    });
  });
}

function setupForm() {
  form.addEventListener("change", updateSummary);
  form.addEventListener("input", updateSummary);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    quantityInput.value = String(getQuantity());
    openWhatsApp(getOrderData());
  });
}

function setupRevealAnimations() {
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach((element) => observer.observe(element));
}

setupQuantityControls();
setupProductSelectors();
setupForm();
setupRevealAnimations();
updateSummary();


function setupStickyBuyVisibility() {
  const sticky = document.querySelector(".sticky-buy");
  const hero = document.querySelector("#inicio");
  if (!sticky || !hero) return;

  sticky.hidden = false;

  const updateSticky = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    document.body.classList.toggle("has-sticky-buy", heroBottom < 120);
  };

  updateSticky();
  window.addEventListener("scroll", updateSticky, { passive: true });
  window.addEventListener("resize", updateSticky);
}

setupStickyBuyVisibility();
