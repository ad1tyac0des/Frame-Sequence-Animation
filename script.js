const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d")

const frames = {
    currentIndex: 0,
    maxIndex: 708
};
let imagesLoaded = 0;
const images = [];

// Preloader elements
function disableScroll() {
    // Get the current page scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function() {
        window.scrollTo(scrollLeft, scrollTop);
    };
}

function enableScroll() {
    window.onscroll = function() {};
}


const preloader = document.getElementById('preloader');
const progressBar = document.querySelector('.progress');
const progressText = document.querySelector('.progress-text');

function updateProgress(loaded, total) {
    const progress = (loaded / total) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

function hidePreloader() {
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
        enableScroll(); // Enable scrolling after preloader is hidden
    }, 500);
}

// Preloader elements END

function preloadImages(){
    disableScroll(); // Disable scrolling when preloading starts
    for (var i=1; i<=frames.maxIndex; i++){
        const imageUrl = `./cinematic_images/frame_${i.toString().padStart(4, '0')}.jpg`;
        const img = new Image();
        img.src = imageUrl;

        img.onload = () =>{
            imagesLoaded++;

            // Preloader fn
            updateProgress(imagesLoaded, frames.maxIndex);

            if(imagesLoaded === frames.maxIndex){
                console.log('all images loaded');
                loadImage(frames.currentIndex);
                startAnimation();

                 // Preloader fn
                hidePreloader();
            }
            
        }

        images.push(img);
    }
}

function loadImage(index){
    if (index>=0 && index<=frames.maxIndex){
        const img = images[index];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.max(scaleX, scaleY);

        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        const offsetX = (canvas.width - newWidth)/2;
        const offsetY = (canvas.height - newHeight)/2;

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(img, offsetX, offsetY, newWidth, newHeight)

        frames.currentIndex = index;
    }
}

function startAnimation(){
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#parent",
            start: "top top",
            scrub: .7,
            // markers: true,
        }
    })

    tl.to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: function(){
            loadImage(Math.floor(frames.currentIndex));
        }
    })
}

preloadImages();