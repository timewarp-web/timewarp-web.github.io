window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  // Initialize buildup carousel
  $('#buildup-carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay: false,
    initialSlide: 0,
  });

  // Initialize RBY1 teleoperation carousel
  $('#rby1-carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay: false,
    initialSlide: 0,
  });

  // Initialize robot evaluation carousel
  $('#robot-eval-carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay: false,
    initialSlide: 0,
  });

  // Initialize inner (per-environment version) carousels first
  var innerCarouselConfig = {
    dots: true,
    infinite: true,
    speed: 350,
    slidesToShow: 1,
    autoplay: false,
    adaptiveHeight: false,
    swipe: true,
    customPaging: function (slider, i) {
      return '<button type="button">' + (i + 1) + '</button>';
    },
  };

  $('#wiki-carousel').slick(innerCarouselConfig);
  $('#news-carousel').slick(innerCarouselConfig);
  $('#shop-carousel').slick(innerCarouselConfig);

  // Version labels (placeholder years — edit as needed)
  var envLabels = {
    wiki: [
      'Wiki v1, inspired by 2001 Wikipedia',
      'Wiki v2, inspired by 2002-03 Wikipedia',
      'Wiki v3, inspired by 2003-04 Wikipedia',
      'Wiki v4, inspired by 2005-22 Wikipedia',
      'Wiki v5, inspired by 2023-25 Wikipedia',
      'Wiki v6, a minimal Wikipedia theme',
    ],
    news: [
      'News v1, inspired by 1999-2001 BBC News',
      'News v2, inspired by 2002-07 BBC News',
      'News v3, inspired by 2008-15 BBC News',
      'News v4, inspired by 2016-22 BBC News',
      'News v5, inspired by 2023-25 BBC News',
      'News v6, a minimal News website theme',
    ],
    shop: [
      'Shop v1, inspired by 1999-2001 Amazon',
      'Shop v2, inspired by 2005-11 Amazon',
      'Shop v3, inspired by 2012-14 Amazon',
      'Shop v4, inspired by 2015-25 Amazon',
      'Shop v5, inspired by 2025 Temu',
      'Shop v6, the base WebShop theme',
    ],
  };

  var envInfo = [
    { id: '#wiki-carousel', labelId: '#wiki-label', curSel: '.wiki-cur', key: 'wiki' },
    { id: '#news-carousel', labelId: '#news-label', curSel: '.news-cur', key: 'news' },
    { id: '#shop-carousel', labelId: '#shop-label', curSel: '.shop-cur', key: 'shop' },
  ];

  envInfo.forEach(function(env) {
    $(env.id).on('afterChange', function(event, slick, currentSlide) {
      $(env.curSel).text(currentSlide + 1);
      $(env.labelId).text(envLabels[env.key][currentSlide]);
    });
  });

  // Initialize outer (environment switcher) carousel
  $('#env-outer-carousel').slick({
    dots: false,
    infinite: false,
    speed: 450,
    slidesToShow: 1,
    fade: true,
    cssEase: 'ease-in-out',
    arrows: false,
    swipe: false,
    draggable: false,
    touchMove: false,
  });

  // Tab navigation → outer carousel
  $('.env-nav-tab').on('click', function () {
    var slide = parseInt($(this).data('slide'));
    $('#env-outer-carousel').slick('slickGoTo', slide);
    $('.env-nav-tab').removeClass('is-active');
    $(this).addClass('is-active');
  });

  // Prev / next arrow buttons for outer carousel
  $('#env-prev-btn').on('click', function () {
    $('#env-outer-carousel').slick('slickPrev');
    var current = $('#env-outer-carousel').slick('slickCurrentSlide');
    syncEnvTabs(current);
  });

  $('#env-next-btn').on('click', function () {
    $('#env-outer-carousel').slick('slickNext');
    var current = $('#env-outer-carousel').slick('slickCurrentSlide');
    syncEnvTabs(current);
  });

  function syncEnvTabs(index) {
    $('.env-nav-tab').removeClass('is-active');
    $('.env-nav-tab[data-slide="' + index + '"]').addClass('is-active');
  }

  // Prevent inner carousel arrow clicks from bubbling to outer
  $('.inner-carousel .slick-prev, .inner-carousel .slick-next').on('click', function (e) {
    e.stopPropagation();
  });
});

$(window).on("load", function () {
  // Reset gifs once everything is loaded to synchronize playback.
  $('.preload').attr('src', function (i, a) {
    $(this).attr('src', '').removeClass('preload').attr('src', a);
  });

  $('.author-portrait').each(function () {
    $(this).mouseover(function () {
      $(this).find('.depth').css('top', '-100%');
    });
    $(this).mouseout(function () {
      $(this).find('.depth').css('top', '0%');
    });
  });


  const position = { x: 0, y: 0 }
  const box = $('.hyper-space');
  const cursor = $('.hyper-space-cursor');
  interact('.hyper-space-cursor').draggable({
    listeners: {
      start(event) {
        console.log(event.type, event.target)
      },
      move(event) {
        position.x += event.dx
        position.y += event.dy

        event.target.style.transform =
          `translate(${position.x}px, ${position.y}px)`

        let childPos = cursor.offset();
        let parentPos = box.offset();
        let childSize = cursor.outerWidth();
        let point = {
          x: (childPos.left - parentPos.left),
          y: (childPos.top - parentPos.top)
        };
        point = {
          x: (point.x) / (box.innerWidth() - childSize),
          y: (point.y) / (box.innerHeight() - childSize)
        }
        updateHyperGrid(point);
      },
    },
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent'
      })
    ]
  });

});

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};


function updateHyperGrid(point) {
  const n = 20 - 1;
  let top = Math.round(n * point.y.clamp(0, 1)) * 100;
  let left = Math.round(n * point.x.clamp(0, 1)) * 100;
  $('.hyper-grid-rgb > img').css('left', -left + '%');
  $('.hyper-grid-rgb > img').css('top', -top + '%');
}