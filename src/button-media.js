const buttonMobileHeader = document.querySelector('.menu-btn-mobile');
const navBar = document.querySelector('.navbar__nav');
const buttonMobileCategory = document.querySelector('.menu-mobile-category');
const mobileCategory = document.querySelector('.categories-books');
const backgroundButtonCategory = document.querySelector('.div-back-ground-list')



buttonMobileHeader.addEventListener('click', ()=> {
    navBar.classList.toggle('active');

})

buttonMobileCategory.addEventListener('click', ()=> {
    mobileCategory.classList.toggle('active');
    backgroundButtonCategory.classList.toggle('active');

})
