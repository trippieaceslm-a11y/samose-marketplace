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

document.querySelectorAll('.jersey[data-more]').forEach(jersey => {
  const baseName = jersey.dataset.name;
  const firstPhoto = jersey.querySelector('img').getAttribute('src');

  jersey.addEventListener('click', () => {
    if (skipPopup) return;
    moreTitle.textContent = baseName + ' jerseys';
    moreGrid.innerHTML = '';

    const files = [firstPhoto,...jersey.dataset.more.split(',').map(f => f.trim())];
    files.forEach(file => {
      const img = document.createElement('img');
      img.src = file;
      img.addEventListener('click', () => {
        jersey.querySelector('img').src = file;
        jersey.dataset.name = `${baseName} (${file})`;
        morePopup.classList.remove('open');
        skipPopup = true;
        jersey.click();
        skipPopup = false;
      });
      moreGrid.appendChild(img);
    });

    morePopup.classList.add('open');
  });
});

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