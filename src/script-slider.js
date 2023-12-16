import "./index.html";

let images = [{
    slide: "slide-1",
    url: require("./img/bg1.png"),
    title: "Black friday sale",
    info1: "up to",
    info2: "60",
    info3: "%",
},{
    slide: "slide-2",
    url:require("./img/bg2.png"),
    title: "for entrepreneurs",
    info1: "top",
    info2: "10",
    info3: "books",
},{
    slide: "slide-3",
    url:require("./img/bg3.png"),
    title: "Check out",
    info1: "our",
    info2: "cozy books",
    info3: "selections",
}];


function initSlider(options) {
    if(!images || !images.length) return;
    options = options || {
        info: false,
        dots: true,
        autoplay: false,
    };

    let block_slide = document.querySelector(".main-container-block"); 
    let sliderDots = document.querySelector(".slider-dots");
    
    initImages();

    if(options.dots) {
        initDots()
    }

    if(options.title) {
        initTitles()
    }

    if(options.autoplay) {
        initAutoplay();
    }
    

    function initImages() {
    
        images.forEach((image, index) => {

         let imageDiv = `<div class="main-content image n${index} ${index===0? "active" : ""}" style="background-image:url(${images[index].url})" data-index="${index}">
            <h1 class="slider-title slide${index}">${images[index].title}</h1>
            <div class="slider-info slide${index} n${index}">
              <div class="info1"><h2>${images[index].info1}</h2></div> 
              <div class="info2"><h1>${images[index].info2}</h1></div> 
              <div class="info3"><h2>${images[index].info3}</h2></div> 
            </div>
        </div>
         `

         block_slide.innerHTML += imageDiv;
        
        })
    }

    function initArrows () {

        sliderArrows.querySelectorAll(".slider__arrow").forEach(arrow => {arrow.addEventListener("click", function() {
            let curNumber = +block_slide.querySelector(".active").dataset.index;
            let nextNumber;
            if (arrow.classList.contains("left")){
                nextNumber = curNumber === 0? images.length - 1 : curNumber - 1; 
                
            } else {
                nextNumber = curNumber === images.length - 1? 0 : curNumber + 1;
                
            }
            moveSlider(nextNumber);
            
            });
        });
    }

    function initButtons() {
        sliderButton.querySelectorAll(".btn_img").forEach(button => {button.addEventListener("click", function(){
            let curNumber = +block_slide.querySelector(".active").dataset.index;
            let nextNumber;
            if (button.classList.contains("button-left")){
                nextNumber = curNumber === 0? images.length - 1 : curNumber - 1; 
                
            } else {
                nextNumber = curNumber === images.length - 1? 0 : curNumber + 1;
                
            }
            moveSlider(nextNumber);
            })
        })
    }

    function initNavigateSlide() {
        images.forEach((image, index) => {
            let eliElement = `<li class="town_item ">
            <a class="click_A n${index} ${index ===0? "active_hover_A": "" } " data-index="${index}" href="#">${images[index].name}</a>
            </li>`
            
            ulConteiner.innerHTML += eliElement;
        });
        ulConteiner.querySelectorAll(".click_A").forEach(element => {
            element.addEventListener("click", function(evt){
                evt.preventDefault();
                moveSlider(this.dataset.index);
                ulConteiner.querySelector(".active_hover_A").classList.remove("active_hover_A");
                this.classList.add("active_hover_A");
                
            })
        })
    }

    function initDots() {
        images.forEach((image, index) => {
            let dot = `<div class="slider-dots-item n${index} ${index ===0? "active": "" }" data-index="${index}"></div>`
            sliderDots.innerHTML += dot;
        });
        sliderDots.querySelectorAll(".slider-dots-item").forEach(dot => {
            dot.addEventListener("click", function(){
                moveSlider(this.dataset.index);
                sliderDots.querySelector(".active").classList.remove("active");
                this.classList.add("active");
                
            })
        })
    };

    function moveSlider(num) {
        block_slide.querySelector(".active").classList.remove("active");
        block_slide.querySelector(".n" + num).classList.add("active");
        if (options.dots) {
            sliderDots.querySelector(".active").classList.remove("active");
            sliderDots.querySelector(".n" + num).classList.add("active");
        }
        if(options.navigate) {
            ulConteiner.querySelector(".active_hover_A").classList.remove("active_hover_A");
            ulConteiner.querySelector(".n" + num).classList.add("active_hover_A");
        }
    }

    function initTitles() {
        let titleDiv = `<div class="slider__images-title">${images[0].title}</div>`
        sliderImages.innerHTML += cropTitle(titleDiv, 50)
    }

    function initAutoplay() {
        setInterval (()=> {
            let curNumber = +block_slide.querySelector(".active").dataset.index;
            let nextNumber = curNumber === images.length - 1? 0 : curNumber + 1;
            moveSlider(nextNumber);
        }, options.autoplayInterval)
    }
}

let sliderOptions = {
    title: false,
    info: true,
    dots: true,
    autoplay: true,
    autoplayInterval:2500,
    navigate: false,
};

document.addEventListener("DOMContentLoaded", function() {
    initSlider(sliderOptions)
})
