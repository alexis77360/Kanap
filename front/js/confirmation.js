//! Récupèrer l'id dans le liens pour l'afficher
function getOrderId() {
    let url = new URL(window.location.href);
    let id = url.searchParams.get("id");

    document.getElementById("orderId").textContent = id;
    localStorage.clear();
}
getOrderId();