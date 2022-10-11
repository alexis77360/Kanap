//? Requête d'un produit
function getProduct(id) {

    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status} - ${res.statusText}`);
            }
            return res.json();
        })
}


//? création du DOM pour la page produit
let cardCreation = function (product) {


    let img = document.querySelector(".item__img");
    img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

    let title = document.querySelector("#title");
    title.innerText = product.name;

    let price = document.querySelector("#price");
    price.innerText = product.price;

    let description = document.querySelector("#description");
    description.innerText = product.description;

    let select = document.querySelector("#colors");

    //! boucle sur tableau avec valeur  
    for (const color of product.colors) {
        /*select.innerHTML += `<option value="${color}">${color}</option>`; */
        let option = document.createElement("option");
        option.text = color;
        select.add(option);
    }
};

//! Appel de l'api + appel création du DOM

let url = new URL(window.location.href);
let id = url.searchParams.get("id");

getProduct(id)
    .then(product => {
        cardCreation(product);
        document.querySelector("#addToCart").onclick = addProduct(product);
    })
    .catch(error => console.log(error));


//! Ajout Produit au panier
function addProduct(product) {

    return () => {

        let qtyProduct = parseInt(document.querySelector("#quantity").value);
        let colorProduct = document.querySelector("#colors").value;
        let idProduct = id;

        if (qtyProduct < 1 || qtyProduct > 100 || colorProduct === undefined) {
            alert("Veuillez choisir une couleur et une quantité");
        } else {

            let cart = getCart();

            //! Renvoi l'élément trouvé 
            const found = cart.find(cartItem => cartItem.idProduct === idProduct && cartItem.colorProduct === colorProduct);

            if (found == undefined) {
                cart.push({
                    idProduct,
                    colorProduct,
                    qtyProduct
                });
            } else {
                found.qtyProduct += qtyProduct;

            }
            localStorage.setItem("monPanier", JSON.stringify(cart));
            document.location.href = "./cart.html";

        }
    }
}

//? Affichage du panier dans le local storage
function getCart() {
    //! Opérateur de coalescence ( si null/undefined renvoie la 2eme valeur)
    return JSON.parse(localStorage.getItem("monPanier")) ?? [];
}