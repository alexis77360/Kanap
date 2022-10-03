// Récupèrer l'id transmis dans le liens pour l'afficher
function getOrderId() {
    let actualUrl = document.location.href;
    actualUrl = new URL(actualUrl);
    let id = actualUrl.searchParams.get("id");

    // affiche l'id de commande dans le text
    document.getElementById("orderId").textContent = id;
}
getOrderId();