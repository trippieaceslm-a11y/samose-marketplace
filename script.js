// Hover preview
const preview = document.getElementById('hover-preview');
if (preview) {
  const previewImg = preview.querySelector('img');
  document.querySelectorAll('.card-img img, .thumbs img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      previewImg.src = img.src;
      preview.style.display = 'block';
    });
    img.addEventListener('mouseleave', () => {
      preview.style.display = 'none';
    });
  });
}

// Thumbnail click swaps the main photo
document.querySelectorAll('.thumbs img').forEach(thumb => {
  thumb.addEventListener('click', () => {
    thumb.closest('.card').querySelector('.card-img img').src = thumb.src;
  });
});

// Neighborhood filter
const tags = document.querySelectorAll('.tag');
const cards = document.querySelectorAll('.card');

tags.forEach(tag => {
  tag.addEventListener('click', () => {
    tags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    const area = tag.dataset.area;
    cards.forEach(card => {
      card.classList.toggle('hidden', area !== 'all' && card.dataset.area !== area);
    });
  });
});

// WhatsApp booking
const whatsappNumber = '254795957955';

document.querySelectorAll('.btn.whatsapp').forEach(btn => {
  // 1. Check if the button has a custom data-message attribute
  let message = "";
  
  if (btn.dataset.message) {
    message = btn.dataset.message;
  } 
  // 2. If not, check if it has a data-property (for BnBs)
  else if (btn.dataset.property) {
    message = `Hello Samose Marketplace, I am interested in: ${btn.dataset.property}. Please share more details.`;
  } 
  // 3. Fallback if neither exists
  else {
    message = `Hello Samose Marketplace, I have an enquiry.`;
  }

  // 4. Set the WhatsApp link
  btn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  btn.target = '_blank';
});

// Tap the main picture to open or close the extra photos
document.querySelectorAll('.card-img').forEach(box => {
  box.addEventListener('click', () => {
    const card = box.closest('.card');
    if (card.querySelector('.thumbs')) {
      card.classList.toggle('open');
    }
  });
});

// ----- Pillar 2: TUM Student Hub filters -----
const bizTags = document.querySelectorAll('.biz-tag');
const bizCards = document.querySelectorAll('.biz-card');
const campusSelect = document.getElementById('campus-select');

let selectedType = 'all';

function filterBiz() {
  const campus = campusSelect ? campusSelect.value : 'all';
  bizCards.forEach(card => {
    const typeMatch = selectedType === 'all' || card.dataset.type === selectedType;
    const campusMatch = campus === 'all' || card.dataset.campus === campus;
    card.classList.toggle('hidden', !(typeMatch && campusMatch));
  });
}

bizTags.forEach(tag => {
  tag.addEventListener('click', () => {
    bizTags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    selectedType = tag.dataset.type;
    filterBiz();
  });
});

if (campusSelect) {
  campusSelect.addEventListener('change', filterBiz);
}

filterBiz();

// ----- Jersey picker -----
document.querySelectorAll('.jersey').forEach(jersey => {
  jersey.addEventListener('click', () => {
    const card = jersey.closest('.biz-card');

    card.querySelectorAll('.jersey').forEach(j => j.classList.remove('selected'));
    jersey.classList.add('selected');

    const name = jersey.dataset.name;
    const price = jersey.dataset.price;
    const msg = `Hello, I would like to order the ${name} (${price}) from the TUM Student Hub. Is it available?`;

    const btn = card.querySelector('.btn.whatsapp');
    btn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    btn.textContent = `Order ${name} on WhatsApp`;

    const hint = card.querySelector('.jersey-hint');
    if (hint) hint.textContent = `Selected: ${name} - ${price}`;
  });
});
const morePopup = document.getElementById('more-popup');
const moreGrid = document.getElementById('more-grid');
const moreTitle = document.getElementById('more-title');
let skipPopup = false;

// --- 3D POPUP CAROUSEL LOGIC ---
let swiperInstance = null; // Keep track of the carousel instance

// Select both jerseys and secondhand gallery items
const clickableItems = document.querySelectorAll('.jersey, .sh-item');

clickableItems.forEach(item => {
  item.addEventListener('click', function() {
    
    // 1. Grab the images
    let images = [];
    if (this.classList.contains('jersey')) {
      const imgData = this.getAttribute('data-more');
      if (imgData) {
        images = imgData.split(',');
      } else {
        images = [this.querySelector('img').src]; // Fallback to main image
      }
    } else {
      images = [this.getAttribute('data-more')];
    }

    // 2. Set the Title
    const title = this.getAttribute('data-name') || "Item Photos";
    document.getElementById("more-title").innerText = title;
    
    // 3. Clear old images from the carousel
    const swiperWrapper = document.getElementById("more-grid");
    swiperWrapper.innerHTML = "";

    // 4. Add new images as Swiper slides
    images.forEach(imgSrc => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      
      const img = document.createElement('img');
      img.src = imgSrc.trim();
      
      // Optional: Clicking an image inside the carousel closes the popup
      img.addEventListener('click', () => {
        document.getElementById("more-popup").classList.remove("open");
      });
      
      slide.appendChild(img);
      swiperWrapper.appendChild(slide);
    });

    // 5. Open the popup container
    document.getElementById("more-popup").classList.add("open");

    // 6. Destroy the previous Swiper instance so it doesn't glitch
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
    }

    // 7. Initialize the 3D Coverflow Carousel
    swiperInstance = new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: false, // Set to false to prevent infinite glitching with few images
      coverflowEffect: {
        rotate: 35, // Angle of the side cards
        stretch: 0,
        depth: 150, // How far back the side cards go
        modifier: 1,
        slideShadows: true, // Adds the cool shadows
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  });
});

// Close popup button logic (if you don't already have it)
const moreCloseBtn = document.getElementById("more-close");
if (moreCloseBtn) {
  moreCloseBtn.addEventListener("click", () => {
    document.getElementById("more-popup").classList.remove("open");
  });
}
document.getElementById('more-close').addEventListener('click', () => {
  morePopup.classList.remove('open');
});

morePopup.addEventListener('click', e => {
  if (e.target === morePopup) morePopup.classList.remove('open');
});

// ----- Floating HOME button -----
const homeBtn = document.getElementById('home-btn');
let scrollTimer;

window.addEventListener('scroll', () => {
  homeBtn.classList.toggle('show', window.scrollY > 300);
  homeBtn.classList.add('scrolling');

  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    homeBtn.classList.remove('scrolling');
  }, 600);
});
// --- SECONDHAND ITEMS POPUP LOGIC ---

// Find all the second-hand images
// Close popup when clicking the X
// --- SECONDHAND ITEMS POPUP LOGIC ---

// 1. Redefine the popup elements locally right here to fix the "not defined" error
const shPopup = document.getElementById("more-popup");
const shTitle = document.getElementById("more-title");
const shGrid = document.getElementById("more-grid");
const shClose = document.getElementById("more-close");

// 2. The click logic for the gallery images
const shItems = document.querySelectorAll('.sh-item');

shItems.forEach(item => {
  item.addEventListener('click', function() {
    const imageData = this.getAttribute('data-more');
    const images = imageData.split(',');
    
    shTitle.innerText = "Item Photos";
    shGrid.innerHTML = "";
    
    images.forEach(imgSrc => {
      const img = document.createElement('img');
      img.src = imgSrc.trim();
      
      img.addEventListener('click', () => {
        shPopup.classList.remove('open');
      });
      
      shGrid.appendChild(img);
    });
    
    shPopup.classList.add('open');
  });
});

// 3. Make sure the close button works locally too
shClose.addEventListener('click', () => {
  shPopup.classList.remove('open');
});
// Close popup when clicking the dark background outside the box
morePopup.addEventListener('click', (e) => {
  if (e.target === morePopup) {
    morePopup.classList.remove('open');
  }
});

// --- THRIFT TABS LOGIC ---
const thriftTabs = document.querySelectorAll('.thrift-tab');
const tabContents = document.querySelectorAll('.tab-content');

thriftTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // 1. Remove 'active' class from all buttons
    thriftTabs.forEach(t => t.classList.remove('active'));
    
    // 2. Add 'active' class to the clicked button
    tab.classList.add('active');
    
    // 3. Hide all content grids
    tabContents.forEach(content => content.classList.remove('active'));
    
    // 4. Show the target grid
    const targetId = tab.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});

// --- SCROLL PROGRESS BAR ---
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  document.getElementById('scroll-progress').style.width = scrollPercentage + '%';
});