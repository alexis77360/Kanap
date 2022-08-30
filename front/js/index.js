let cardRequest = function () {

    let target = document.querySelector("#items");


    // !Requete vers Api
    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(res => createCard(res))
        .catch(error => alert("Erreur : " + error));

    //? Fonction génération du contenu des cards
    let createCard = function (res) {

        for (i = 0; i < res.length; i++) {
            
        let cardProduct =

        `<a href="./product.html?id=${res[i].id}">
        <article>
        <img src="${res[i].imageUrl}"
        alt="${res[i].altTxt}">
        <h3 class="productName">${res[i].name}</h3>
        <p class="productDescription">${res[i].description}</p>
        </article>
        </a>`;

            target.innerHTML += cardProduct;
        }
    };
}

cardRequest();