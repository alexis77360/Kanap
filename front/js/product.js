let url = new URL(window.location.href);
let id = url.searchParams.get("id");
/* console.log(id);
 */

// !! Requete vers Api + création du DOM pour la page produit
let cardCreation = function () {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let img = document.querySelector(".item__img");
            img.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;

            let title = document.querySelector("#title");
            title.innerHTML = data.name;

            let price = document.querySelector("#price");
            price.innerHTML = data.price;

            let description = document.querySelector("#description");
            description.innerHTML = data.description;

            for (let i = 0; i < data.colors.length; i++) {
                let colors = document.querySelector("#colors");
                colors.innerHTML += `<option value="${data.colors[i]}">${data.colors[i]}</option>`;
            }

})};

cardCreation();
