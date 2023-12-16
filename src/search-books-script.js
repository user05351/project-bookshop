
let averages = [`<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#F2C94C">
<path d="M31.547 12a.848.848 0 00-.677-.577l-9.427-1.376-4.224-8.532a.847.847 0 00-1.516 0l-4.218 8.534-9.427 1.355a.847.847 0 00-.467 1.467l6.823 6.664-1.612 9.375a.847.847 0 001.23.893l8.428-4.434 8.432 4.432a.847.847 0 001.229-.894l-1.615-9.373 6.822-6.665a.845.845 0 00.214-.869z" />
</svg>`];

let categoryActive;
let startIndex = 0;

let localCart = getDataFromLocalStorage() || {};

const len = Object.keys(localCart).length;
console.log('длина ' + len);

const output = document.querySelector(".output-books");
const divCategoriesBooksList = document.querySelector(".categories-list");
const key = 'AIzaSyDmkxWqx4frhzmp0LmcAXduhWusNo2XKC4';
const urlDefault = new URL(`https://www.googleapis.com/books/v1/volumes?q="subject:Art & Fashion"&key=${key}&printType=books&startIndex=0&maxResults=6&langRestrict=en`);
const placeHolderImageBooks = {
    url:require("./img/image-book-placeholder.png"),
};

divCategoriesBooksList.querySelectorAll(".menu-item").forEach(item => {

item.addEventListener("click", async function(e){
    output.innerHTML = "";
    moveActiveCategory(item.dataset.index);       
    categoryActive = e.target.dataset.name;
    startIndex = 0;
    console.log("target" + " " + categoryActive)
    console.log('active category is ' + categoryActive);
    await fetchRequest(categoryActive,startIndex,localCart);
    
    });
});


function moveActiveCategory(num) {
    divCategoriesBooksList.querySelector('.active').classList.remove('active');
    divCategoriesBooksList.querySelector('.n' + num).classList.add('active');
};


async function defaultFetch(urlDefault){
    const local = getDataFromLocalStorage();
    categoryActive = 'subject:Art';
    console.log('default category if ' +  categoryActive + ' and start Index is ' + startIndex );
    let responseDefault = await fetch(urlDefault)
            .then(response => response.json());
            
    showBooksGallery(responseDefault, local);
    loadLocalStorage(len);
    createButtonLoadMore();
};

async function fetchRequest(value, index, local) {
    const url = new URL(`https://www.googleapis.com/books/v1/volumes?q=&key=${key}&printType=books&startIndex=0&maxResults=6&langRestrict=en`);
        url.searchParams.set("q", value);
        url.searchParams.set("startIndex", index);
    const responce = await fetch(url);
    const data = await responce.json();        
    console.log(data.items);

    showBooksGallery(data, local);

    createButtonLoadMore();
};


async function loadMore(value, index) {
    index = startIndex +=6;
    await fetchRequest(value, index);
};



function showBooksGallery(data, local) {
    
    data.items.forEach(item => {
        
        let stringAuthors = `${item.volumeInfo.authors !== undefined? item.volumeInfo.authors.join(", ") : ' '}`;
        let description = `${item.volumeInfo.description !== undefined? item.volumeInfo.description.slice(0,100) + "..." : " "}`; 
        let card = document.createElement("div");
        card.classList.add('cardBook');
        if(local) {
            console.log('data storage is ' + JSON.stringify(local))
        card.innerHTML = `
        <div class="containerImageBook">
            <img class="image-books" src="${item.volumeInfo.imageLinks !== undefined? item.volumeInfo.imageLinks.thumbnail : placeHolderImageBooks.url}" alt="image-books">
        </div>
        <div class="infoBooks">
            <div class="div-author">
                <h2 class="author">${stringAuthors}</h2>
            </div>
            <div class="div-title">
                <p class="title-books">${item.volumeInfo.title}</p>
            </div>
            ${item.volumeInfo.averageRating === undefined? " " : `
                <div class="container-stars">
                <div class="stars">
                    ${averages.join('').repeat(item.volumeInfo.averageRating)}
                </div>
                <div class="raiting-count">
                    <p class="raiting">${item.volumeInfo.ratingsCount} review</p>
                </div>
                </div>
                `
            }
            <div class="descriptions">
                <p class="text-descriptions">${description}</p>
            </div>
            <div class="price">
                <p class="money-value">${item.saleInfo.retailPrice !== undefined? item.saleInfo.retailPrice.currencyCode + " " + item.saleInfo.retailPrice.amount : ""}</p>
            </div>
            <div class="button">
                <button class="buy-now ${(local[item.id] || localCart[item.id])? 'active' : ''}" data-id="${item.id}">${(local[item.id] || localCart[item.id])? 'remove from the cart' : 'buy now'}</button>
            </div>
        `;
        } else {
            card.innerHTML = `
        <div class="containerImageBook">
            <img class="image-books" src="${item.volumeInfo.imageLinks !== undefined? item.volumeInfo.imageLinks.thumbnail : placeHolderImageBooks.url}" alt="image-books">
        </div>
        <div class="infoBooks">
            <div class="div-author">
                <h2 class="author">${stringAuthors}</h2>
            </div>
            <div class="div-title">
                <p class="title-books">${item.volumeInfo.title}</p>
            </div>
            ${
                (item.volumeInfo.averageRating === undefined || item.volumeInfo.ratingCount === undefined)? 
                "" :
                `
                <div class="container-stars">
                <div class="stars">
                    ${averages.join('').repeat(item.volumeInfo.averageRating)}
                </div>
                <div class="raiting-count">
                    <p class="raiting">${item.volumeInfo.ratingCount} review</p>
                </div>
                </div>
                `
            }
            <div class="descriptions">
                <p class="text-descriptions">${description}</p>
            </div>
            <div class="price">
                <p class="money-value">${item.saleInfo.retailPrice !== undefined? item.saleInfo.retailPrice.currencyCode + " " + item.saleInfo.retailPrice.amount : ""}</p>
            </div>
            <div class="button">
                <button class="buy-now" data-id="${item.id}">buy now</button>
            </div>
        `;
    };
    
    output.appendChild(card);
    
    })

    const button = document.querySelectorAll('.buy-now');
    button.forEach(item => {
        item.addEventListener('click', (e)=>{
            let currentButton = e.target;
            let currentDataId = e.target.dataset.id;
            console.log('current id button is ' + currentDataId);
            click(currentButton, currentDataId);
        })
    });
};

function addItemShopBag(bookId, localCart) {
    localCart[bookId] = true;
    return localCart;
};
function deleteItemShopBag(bookId, localCart) {
    delete localCart[bookId];
    return localCart;
};   

function getDataFromLocalStorage () {
    const resp = localStorage.getItem('localCart');
    console.log('responce from local is' + resp)
    const data = JSON.parse(resp);
    return data;
};

function click(item, id) {
    
    if(localCart[id] === undefined) {
        addItemShopBag(id, localCart);
        console.log('local Cart Added items and Cart is : ' + id)
        item.textContent = "remove from the cart";
        item.classList.add('active');
    } else {
        deleteItemShopBag(id, localCart);
        console.log('local Cart delete items and Cart is : ' + id)
        item.textContent = "buy now";
        item.classList.remove('active');
    }
    localStorage.setItem(`localCart`, JSON.stringify(localCart));
    const len = Object.keys(localCart).length;
    loadLocalStorage(len)
    console.log('loaded of elements books of localStorage is:' + len);
}

function loadLocalStorage(item){
    const shopBags = document.querySelector('.bags-items');
    
    if(item === 0) {
        shopBags.classList.remove('active');
        return
    } else {
        shopBags.classList.add('active');
        shopBags.textContent = item;
    }
};

async function createButtonLoadMore(){
    let divMoreButton = document.createElement("div");
    divMoreButton.classList.add('load');
    let buttonMoreLoad = document.createElement('button');
    buttonMoreLoad.classList.add('load-more');
    buttonMoreLoad.innerHTML = 'load more';
    divMoreButton.appendChild(buttonMoreLoad);
    
    output.appendChild(divMoreButton);
    
    divMoreButton.addEventListener('click', ()=> {
        output.innerHTML = "";
        loadMore(categoryActive,startIndex)
        console.log('active category:' + categoryActive , 'startIndex:' + startIndex);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    defaultFetch(urlDefault);
    
});
