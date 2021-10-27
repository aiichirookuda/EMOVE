const $NAV = $('.mainNav, .subNav');

$(function () {
  function noScroll(e) {
    e.preventDefault();
  }

  $('.hamburger').click(function () {
    $(this).toggleClass('open');
    if ($(this).hasClass('open')) {
      $NAV.slideDown();
      document.addEventListener('touchmove', noScroll, { passive: false });
      document.addEventListener('mousewheel', noScroll, { passive: false });
      $('header').animate({ height: '100vh' });
    } else {
      $NAV.slideUp();
      document.removeEventListener('touchmove', noScroll, { passive: false });
      document.removeEventListener('mousewheel', noScroll, { passive: false });
      $('header').css('height', 'auto');
    }
  });
});

$(window).on('load resize', function () {
  if ($(this).width() > 768) {
    $NAV.css('display', 'block');
  } else {
    $NAV.css('display', 'none');
    $('.hamburger').removeClass('open');
  }
});
