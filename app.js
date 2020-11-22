let controller;
let slideScene;
let pageScene;

function animateSlides() {
    //Init controller 
    controller = new ScrollMagic.Controller();
    // console.log("here");
    const sliders = document.querySelectorAll(".slide");
    console.log(sliders);
    const nav = document.querySelectorAll(".nav-header");
    // loop over sildes 
    sliders.forEach((slide, index, slides) => {
        // console.log("inside loop");
        const revealImg = slide.querySelector(".reveal-img");
        const img = slide.querySelector("img");
        const revealText = slide.querySelector(".reveal-text");
        const heroDesc = slide.querySelector(".hero-desc");
        // GSAP
        // gsap.to(revealImg, {x: "100%"})

        // Using gsap timeline now 
        // const slideTl = gsap.timeline({defaults: {duration: 1, ease: "power2.inOut"}});
        // slideTl.fromTo(revealImg, {x: '0%'}, {x: '100%'});
        // slideTl.fromTo(revealImg, {}, {})

        const slideTl = gsap.timeline({defaults: {duration: 1, ease: 'power2.inOut'}})
        slideTl.fromTo(revealImg, {x: '0%'}, {x: '100%'});
        slideTl.fromTo(img, {scale: 2}, {scale: 1} ,'-=1');
        slideTl.fromTo(revealText, {x: '0%'}, {x: '100%'}, '-=0.75')
        // slideTl.fromTo(heroDesc, {scale: 2}, {scale: 1} ,'-=1');
        slideTl.fromTo(nav, {y: '-100%'}, {y: '0%'}, "-=0.5");

        // Creating slidescene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25, 
            reverse: false

        })
        //This is important. To integrate with GSAP, just add the slide tl to the 
        .setTween(slideTl)
        // Indicators are so that you can see these objects on the page
        // .addIndicators({colorStart: 'white', colorTrigger: 'white', name: "slide"})
        .addTo(controller);



        //New animation 
        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        

        pageTl.fromTo(nextSlide, {y: '0%'}, {y: '50%'});
        pageTl.fromTo(slide, {opacity: 1, scale: 1}, {opacity: 0, scale: 0.5});
        pageTl.fromTo(nextSlide, {y: '50%'}, {y: '0%'}, "-=0.5");
        // Create new scene and add pagetl as tween 
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%', 
            triggerHook: 0
        })
        // .addIndicators({colorStart: 'red', colorTrigger: 'red', name: "page", indent: 200})
        .setPin(slide, { pushFollowers: false})
        .setTween(pageTl)
        .addTo(controller);

    });
}

let mouse = document.querySelector(".cursor");
let mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");
const logo = document.querySelector("#logo");
function cursorevent(e) {
    
    // console.log(e);
    // console.log(mouse);
    mouse.style.top = e.pageY + "px";
    mouse.style.left = e.pageX + "px";
    
}


function activeCursor(e) {
    const item = e.target;
    console.log(item);
    if(item.id === 'logo' || item.classList.contains('burger')) {
        mouse.classList.add("nav-active");
    } else {
        mouse.classList.remove("nav-active");
    }

    if(item.classList.contains('explore')) {
        mouse.classList.add("explore-active");
        mouseText.innerText = "Tap";
        gsap.to(".title-swipe", 1, {y: "100%"})
    } else {
        mouse.classList.remove("explore-active");
        mouseText.innerText = "";
        gsap.to(".title-swipe", 1, {y: "0%"})
    }
}

function navToggle(event) {
    if(!event.target.classList.contains("active")) {
    event.target.classList.add("active");
    gsap.to(".line1", 0.5, {rotate: "45", y: 5, background:"black"})
    gsap.to(".line2", 0.5, {rotate: "-45", y: -5, background:"black"})
    gsap.to("#logo", 0.5, {color:"black"})
    gsap.to(".nav-bar", 1, {clipPath: 'circle(2500px at 100%)'})
    document.body.classList.add("hide");
    } else {
        event.target.classList.remove("active");
    gsap.to(".line1", 0.5, {rotate: "0", y: -5, background:"white"})
    gsap.to(".line2", 0.5, {rotate: "0", y: 5, background:"white"})
    gsap.to("#logo", 0.5, {color:"white"})
    gsap.to(".nav-bar", 1, {clipPath: 'circle(50px at 100% -10%)'})
    document.body.classList.remove("hide");
    }

}

//Barba page transitions 
barba.init({
    views: [
      {
        namespace: "home",
        beforeEnter() {
          animateSlides();
          logo.href = "./index.html";
        },
        beforeLeave() {
          slideScene.destroy();
          pageScene.destroy();
          controller.destroy();
        }
      },
      {
        namespace: "fashion",
        beforeEnter() {
          logo.href = "../index.html";
          detailAnimation();
        },
        beforeLeave() {
          controller.destroy();
          detailScene.destroy();
        }
      }
    ],
    transitions: [
      {
        leave({ current, next }) {
          let done = this.async();
          //An Animation
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
          tl.fromTo(
            ".swipe",
            0.75,
            { x: "-100%" },
            { x: "0%", onComplete: done },
            "-=0.5"
          );
        },
        enter({ current, next }) {
          let done = this.async();
          //Scroll to the top
          window.scrollTo(0, 0);
          //An Animation
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          tl.fromTo(
            ".swipe",
            1,
            { x: "0%" },
  
            { x: "100%", stagger: 0.2, onComplete: done }
          );
          tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
          tl.fromTo(
            ".nav-header",
            1,
            { y: "-100%" },
            { y: "0%", ease: "power2.inOut" },
            "-=1.5"
          );
        }
      }
    ]
  });


  function detailAnimation() {
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll(".detail-slide");
    slides.forEach((slide, index, slides) => {
      const slideTl = gsap.timeline({ defaults: { duration: 1 } });
      let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
      const nextImg = nextSlide.querySelector("img");
      slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
      slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
      slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
      //Scene
      detailScene = new ScrollMagic.Scene({
        triggerElement: slide,
        duration: "100%",
        triggerHook: 0
      })
        .setPin(slide, { pushFollowers: false })
        .setTween(slideTl)
        // .addIndicators({
        //   colorStart: "white",
        //   colorTrigger: "white",
        //   name: "detailScene"
        // })
        .addTo(controller);
    });
  }

window.addEventListener('mousemove', cursorevent);
window.addEventListener('mouseover', activeCursor);
burger.addEventListener('click', navToggle)
