//----------------- DOM VARIABLES --------------------

const openMenu = document.getElementsByClassName('bi-list');
const carouselToggleOff = document.getElementsByClassName('bi-x-lg');
const mobileNavigation = document.getElementsByClassName('nav__menu');
const navEffect = document.getElementsByClassName('nav__effect');
const navNavigate = document.getElementsByClassName('nav__navigate');
const photoShowcase = document.getElementsByClassName('page__photo-showcase');
const navHeader = document.getElementsByClassName('nav__header');
const carouselMove = document.getElementsByClassName('carousel__move');
const carouselImageContainer = document.getElementsByClassName(
  'carousel__image-container'
);
const carouselOpen = document.getElementsByClassName('carousel__open');
const carousel = document.getElementsByClassName('carousel');
const galleryContainerWidth = document.getElementsByClassName(
  'photo-showcase_masonry'
);
const nav = document.getElementsByTagName('NAV');
const footer = document.getElementsByTagName('FOOTER');
const body = document.getElementsByTagName('BODY');

//----------------- DOM LIST TO ARRAY -----------------

const photoShowcaseArray = Array.from(photoShowcase);
const navNavigateArray = Array.from(navNavigate);

//----------------- GLOBAL VARIABLES ------------------

let saveSection;
let carouselPositionCorrection;
let photoShowcaseLengthArray = [];
let initialCarouselPosition = 0;
let galleryItemCount = 0;
let colCount = 0;
let colWidth = 0;
let galleryPhotoMargin = 1;
let galleryWidth = 0;
let photoBlocks = [];
let blocksParentArray = [];
let blockParent;
let saveCarouselItem;
let min;
let index;
let minFunction;
let leftPosPx;
let minHeight;
let leftPosVw;
let j = 0;
let itemHeightVh;
let saveSectionHeight;
let photoSlideItemHeight;
let photoSlideItemWidth;
let vh = window.innerHeight * 0.01;
let bodyHeight;
var timeOut;
let debounceCarouselImageSize;
if (window.innerWidth < 421) {
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
const getBodyHeight = (n) => {
  bodyHeight = photoShowcase[n].offsetHeight;
  bodyHeight =
    (100 * (bodyHeight + footer[0].offsetHeight)) / window.innerHeight +
    5 +
    'vh';
  body[0].style.height = bodyHeight;
};

for (let i = 1; i < photoShowcaseArray.length; i++) {
  for (let j = 0; j < photoShowcaseArray[i].children[1].children.length; j++) {
    galleryItemCount++;
    if (j == photoShowcaseArray[i].children[1].children.length - 1) {
      photoShowcaseLengthArray.push(galleryItemCount);
      galleryItemCount = 0;
    }
  }
}

let secondCarousel = photoShowcaseLengthArray[0];
let thirdCarousel = photoShowcaseLengthArray[0] + photoShowcaseLengthArray[1];
let fourthCarousel =
  photoShowcaseLengthArray[0] +
  photoShowcaseLengthArray[1] +
  photoShowcaseLengthArray[2];

function setupBlocks(galleryCategoryNumber) {
  photoBlocks = [];
  galleryWidth = galleryContainerWidth[galleryCategoryNumber].scrollWidth;
  if (galleryCategoryNumber == 0) {
    colWidth = carouselOpen[1].offsetWidth;
    saveCarouselItem = carouselOpen[1];
  } else if (galleryCategoryNumber == 1) {
    colWidth = carouselOpen[secondCarousel].offsetWidth;
    saveCarouselItem = carouselOpen[secondCarousel];
  } else if (galleryCategoryNumber == 2) {
    colWidth = carouselOpen[thirdCarousel].offsetWidth;
    saveCarouselItem = carouselOpen[thirdCarousel];
  } else if (galleryCategoryNumber == 3) {
    colWidth = carouselOpen[fourthCarousel].offsetWidth;
    saveCarouselItem = carouselOpen[fourthCarousel];
  }
  colCount = Math.round(galleryWidth / (colWidth + galleryPhotoMargin));
  for (var i = 0; i < colCount; i++) {
    photoBlocks.push(galleryPhotoMargin);
  }
}

let setupBlocksCurried = function (galleryCategoryNumber) {
  return function curried_func(e) {
    photoBlocks = [];
    galleryWidth = galleryContainerWidth[galleryCategoryNumber].scrollWidth;
    if (galleryCategoryNumber == 0) {
      colWidth = carouselOpen[1].offsetWidth;
      saveCarouselItem = carouselOpen[1];
    } else if (galleryCategoryNumber == 1) {
      colWidth = carouselOpen[secondCarousel].offsetWidth;
      saveCarouselItem = carouselOpen[secondCarousel];
    } else if (galleryCategoryNumber == 2) {
      colWidth = carouselOpen[thirdCarousel].offsetWidth;
      saveCarouselItem = carouselOpen[thirdCarousel];
    } else if (galleryCategoryNumber == 3) {
      colWidth = carouselOpen[fourthCarousel].offsetWidth;
      saveCarouselItem = carouselOpen[fourthCarousel];
    }
    colCount = Math.round(galleryWidth / (colWidth + galleryPhotoMargin));
    for (var i = 0; i < colCount; i++) {
      photoBlocks.push(galleryPhotoMargin);
    }
  };
};

function debounce(func, timeout = 50) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function positionBlocks() {
  if (galleryWidth > 481) {
    blockParent = saveCarouselItem.parentElement.children;
    blocksParentArray = Array.from(blockParent);
    blocksParentArray.forEach(function (item, index) {
      j++;
      min = Math.min(...photoBlocks);
      minHeight = min;
      minFunction = (element) => element == min;
      index = photoBlocks.findIndex(minFunction);
      leftPosPx = galleryPhotoMargin + index * (colWidth + galleryPhotoMargin);
      leftPosVw = Math.round((100 * leftPosPx) / galleryWidth);
      item.style.left = leftPosVw + '%';
      item.style.top = 25 + minHeight + 'vh';
      itemHeightVh = (item.scrollHeight * 100) / window.innerHeight;
      photoBlocks[index] =
        photoBlocks[index] + galleryPhotoMargin + itemHeightVh;
    });
    if (photoBlocks.length == 1) {
      saveSectionHeight = photoBlocks;
    } else {
      saveSectionHeight = photoBlocks.reduce(function (a, b) {
        return Math.max(a, b);
      }, -Infinity);
    }
    saveSectionHeight = Number(saveSectionHeight);
    saveSectionHeight = saveSectionHeight + 25;
    footer[0].style.top = saveSectionHeight + 'vh';
  } else {
    blocksParentArray.forEach(function (item, index) {
      item.style.left = '2vw';
      item.style.top = null;
    });
  }
}

const debounceBlockPosition = debounce(() => positionBlocks());
const debounceSetupBlocks = debounce(() => setupBlocksCurried());

for (let i = 0; i < carouselOpen.length; i++) {
  carouselOpen[i].addEventListener('click', function () {
    footer[0].classList.add('footer_hidden');
    let carouselParent = carouselOpen[i].parentElement;
    let carouselItem;
    body[0].style.height = '100vh';
    for (let i = 0; i < carouselParent.children.length; i++) {
      carouselItem = Array.from(carouselParent.children);
      let clone = carouselItem[i].cloneNode(true);
      carouselImageContainer[0].appendChild(clone);
    }
    for (let j = 0; j < carouselImageContainer[0].children.length; j++) {
      carouselImageContainer[0].children[j].style.position = 'relative';
      carouselImageContainer[0].children[j].style.top = '0';
      carouselImageContainer[0].children[j].style.left = '0';
    }
    if (i == 0) {
      carouselMove[0].style.color = 'blue';
      initialCarouselPosition = 0;
      let carouselPosition = 0;
      carousel[0].style.display = 'block';
      carouselImageContainer[0].style.transform =
        'translateX(' + carouselPosition + 'vw)';
      for (let i = 0; i < photoShowcaseArray.length; i++) {
        photoShowcaseArray[i].style.display = 'none';
        nav[0].style.display = 'none';
      }
    } else if (i < secondCarousel) {
      if (i == secondCarousel - 1) {
        carouselMove[1].style.color = 'blue';
      }
      initialCarouselPosition = i * -90;
      let carouselPosition = i * -90;
      carousel[0].style.display = 'block';
      carouselImageContainer[0].style.transform =
        'translateX(' + carouselPosition + 'vw)';
      for (let i = 0; i < photoShowcaseArray.length; i++) {
        photoShowcaseArray[i].style.display = 'none';
        nav[0].style.display = 'none';
      }
    } else if (i >= fourthCarousel) {
      initialCarouselPosition = (i - fourthCarousel) * -90;
      let carouselPosition = (i - fourthCarousel) * -90;
      carousel[0].style.display = 'block';
      carouselImageContainer[0].style.transform =
        'translateX(' + carouselPosition + 'vw)';
      for (let i = 0; i < photoShowcaseArray.length; i++) {
        photoShowcaseArray[i].style.display = 'none';
        nav[0].style.display = 'none';
      }
      if (i == fourthCarousel - 1) {
        carouselMove[0].style.color = 'blue';
      } else if (
        i ==
        fourthCarousel + carouselImageContainer[0].children.length - 1
      ) {
        carouselMove[0].style.color = 'blue';
      }
    } else if (i >= thirdCarousel) {
      let carouselPosition = (i - thirdCarousel) * -90;
      carousel[0].style.display = 'block';
      carouselImageContainer[0].style.transform =
        'translateX(' + carouselPosition + 'vw)';
      for (let j = 0; j < photoShowcaseArray.length; j++) {
        photoShowcaseArray[j].style.display = 'none';
        nav[0].style.display = 'none';
      }
      if (j == thirdCarousel) {
        carouselMove[0].style.color = 'blue';
      } else if (j == fourthCarousel - 1) {
        carouselMove[0].style.color = 'blue';
      }
    } else if (i >= secondCarousel) {
      let carouselPosition = (i - secondCarousel) * -90;
      carousel[0].style.display = 'block';
      carouselImageContainer[0].style.transform =
        'translateX(' + carouselPosition + 'vw)';
      for (let j = 0; j < photoShowcaseArray.length; j++) {
        photoShowcaseArray[j].style.display = 'none';
        nav[0].style.display = 'none';
      }
      if (j == secondCarousel) {
        carouselMove[0].style.color = 'blue';
      } else if (j == thirdCarousel - 1) {
        carouselMove[0].style.color = 'blue';
      }
    }
    function calculateImageMargin() {
      let calculateMargin;
      let itemWidth;
      for (let j = 0; j < carouselImageContainer[0].children.length; j++) {
        photoSlideItemHeight =
          carouselImageContainer[0].children[j].naturalHeight;
        photoSlideItemWidth =
          carouselImageContainer[0].children[j].naturalWidth;
        if (
          (100 * carouselImageContainer[0].children[j].offsetWidth) /
            window.innerWidth >
          80
        ) {
          carouselImageContainer[0].children[j].style.width = '70vw';
          carouselImageContainer[0].children[j].style.height = 'auto';
        }
        calculateMargin =
          85 -
          (100 * carouselImageContainer[0].children[j].offsetWidth) /
            window.innerWidth +
          5;
        itemWidth =
          (100 * carouselImageContainer[0].children[j].offsetWidth) /
          window.innerWidth;
        calculateMargin = calculateMargin / 2;
        calculateMarginFirstItem = calculateMargin + 5;
        calculateMarginFirstItem = calculateMarginFirstItem + 'vw';
        calculateMargin = calculateMargin + 'vw';
        if (j == 0) {
          carouselImageContainer[0].children[j].style.margin =
            '0 ' + calculateMargin + ' 0 ' + calculateMarginFirstItem;
        } else if (j > 0) {
          carouselImageContainer[0].children[j].style.margin =
            '0 ' + calculateMargin;
        } else if (j == carouselImageContainer[0].children.length - 1) {
          carouselImageContainer[0].children[j].style.margin =
            '0 ' + calculateMargin + ' 0 10vw';
        }
      }
    }
    debounceCarouselImageSize = debounce(() => calculateImageMargin());
    debounceCarouselImageSize();
    window.removeEventListener('resize', debounceCarouselImageSize);
    window.addEventListener('resize', debounceCarouselImageSize);
  });
}

carouselToggleOff[0].addEventListener('click', function () {
  carouselMove[1].style.color = '#333';
  carouselMove[0].style.color = '#333';
  carousel[0].style.display = 'none';
  photoShowcaseArray[saveSection].style.display = 'block';
  footer[0].classList.remove('footer_hidden');
  nav[0].style.display = 'block';
  while (carouselImageContainer[0].firstChild) {
    carouselImageContainer[0].removeChild(carouselImageContainer[0].firstChild);
  }
  setupBlocks(saveSection - 1);
  positionBlocks();
  initialCarouselPosition = null;
});

carouselMove[0].addEventListener('click', function () {
  if (initialCarouselPosition == 0) {
  } else if (initialCarouselPosition == -90) {
    carouselMove[0].style.color = 'blue';
    initialCarouselPosition += 90;
    carouselImageContainer[0].style.transform =
      'translateX(' + initialCarouselPosition + 'vw)';
  } else {
    carouselMove[1].style.color = '#333';
    carouselMove[0].style.color = '#333';
    initialCarouselPosition += 90;
    carouselImageContainer[0].style.transform =
      'translateX(' + initialCarouselPosition + 'vw)';
  }
});

carouselMove[1].addEventListener('click', function () {
  if (
    initialCarouselPosition <
    carouselImageContainer[0].children.length * -90 + 100
  ) {
  } else if (
    initialCarouselPosition ==
    carouselImageContainer[0].children.length * -90 + 180
  ) {
    carouselMove[1].style.color = 'blue';
    initialCarouselPosition = initialCarouselPosition - 90;
    carouselImageContainer[0].style.transform =
      'translateX(' + initialCarouselPosition + 'vw)';
  } else {
    carouselMove[0].style.color = '#333';
    carouselMove[1].style.color = '#333';
    initialCarouselPosition = initialCarouselPosition - 90;
    carouselImageContainer[0].style.transform =
      'translateX(' + initialCarouselPosition + 'vw)';
  }
});
for (let i = 0; i < navNavigateArray.length; i++) {
  navNavigateArray[i].addEventListener('click', function () {
    if (i == 0) {
      openMenu[0].style.color = '#f4f4f4';
      navHeader[0].classList.remove('nav__header_visible');
      photoShowcaseArray.map((item) => (item.style.display = 'none'));
      photoShowcaseArray[0].style.display = 'flex';
      footer[0].classList.add('footer_hidden');
      body[0].style.height = '100vh';
    } else if (i == navNavigateArray.length - 1) {
      saveSection = i;
      carouselPositionCorrection = photoShowcase[1].children[1].children.length;
      openMenu[0].style.color = '#222222';
      navHeader[0].classList.add('nav__header_visible');
      photoShowcaseArray.map((item) => (item.style.display = 'none'));
      photoShowcaseArray[i].style.display = 'block';
      photoShowcaseArray[0].style.display = 'none';
      mobileNavigation[0].classList.remove('slide-in');
      mobileNavigation[0].classList.add('slide-out');
      navEffect[0].classList.add('nav__effect_off');
      navEffect[0].classList.remove('nav__effect_on');
      footer[0].classList.remove('footer_visible');
      footer[0].classList.add('footer_hidden');
      body[0].style.height = '100vh';
    } else if (i > 0) {
      saveSection = i;
      carouselPositionCorrection = photoShowcase[1].children[1].children.length;
      openMenu[0].style.color = '#222222';
      navHeader[0].classList.add('nav__header_visible');
      photoShowcaseArray.map((item) => (item.style.display = 'none'));
      photoShowcaseArray[i].style.display = 'block';
      photoShowcaseArray[0].style.display = 'none';
      mobileNavigation[0].classList.remove('slide-in');
      mobileNavigation[0].classList.add('slide-out');
      navEffect[0].classList.add('nav__effect_off');
      navEffect[0].classList.remove('nav__effect_on');
      setupBlocks(i - 1);
      positionBlocks();
      window.removeEventListener('resize', setupBlocksCurried(i - 1));
      window.removeEventListener('resize', debounceBlockPosition);
      window.addEventListener('resize', setupBlocksCurried(i - 1));
      window.addEventListener('resize', debounceBlockPosition);
      photoShowcaseArray[i].style.height = saveSectionHeight + 'vh';
      footer[0].classList.remove('footer_hidden');
      getBodyHeight(i);
      window.addEventListener('resize', getBodyHeight(i));
    }
    initialCarouselPosition = null;
  });
}

openMenu[0].addEventListener('click', function () {
  mobileNavigation[0].style.transition = '1s';
  mobileNavigation[0].classList.add('slide-in');
  mobileNavigation[0].classList.remove('slide-out');
  navEffect[0].classList.add('nav__effect_on');
  navEffect[0].classList.remove('nav__effect_off');
  setTimeout(() => {
    mobileNavigation[0].style.transition = 'none';
  }, 1000);
});

carouselToggleOff[1].addEventListener('click', function () {
  mobileNavigation[0].style.transition = '1s';
  mobileNavigation[0].classList.remove('slide-in');
  mobileNavigation[0].classList.add('slide-out');
  navEffect[0].classList.add('nav__effect_off');
  navEffect[0].classList.remove('nav__effect_on');
  setTimeout(() => {
    mobileNavigation[0].style.transition = 'none';
  }, 1000);
});
