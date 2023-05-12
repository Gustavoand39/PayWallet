const newOrder = document.getElementById("newOrder");
const orders = document.getElementById("orders");

const nav_2 = document.getElementById("nav_2");
nav_2.addEventListener("click", () => {
    window.location.href = "inventory.html";
});

newOrder.addEventListener("click", () => {
    window.location.href = "new_order.html";
});

orders.addEventListener("click", () => {
    window.location.href = "orders.html";
});