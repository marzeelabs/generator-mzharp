$(function() {

  var breakMobile = 730; // viewport px breakpoint

  fixedHeader = function() {
    var viewportWidth = $( window ).width(),
        fixedClass = 'navigation--fixed-top',
        $navElement = $(".navigation");

    if ($(window).scrollTop() > '1' && viewportWidth >= breakMobile) {
      $navElement.addClass(fixedClass);
    } else {
      $navElement.removeClass(fixedClass);
    }
  };

  // Toggle mobile navigation
  $(".navigation__mobile-menu__toggle").click(function() {
    $(this).parent().toggleClass('is-open');
  });

  // Force close mobile navigation when clicking anywhere (except the toggle button itself)
  $( document ).on('mousedown touchstart', function(event) {
    if (!$(event.target).closest(".navigation").length) {
      $(".navigation.is-open").removeClass('is-open');
    }
  });

  $(window).on('resize scroll', fixedHeader);

});
