/* ===================================================================
 * Sublime - Main JS
 *
 * ------------------------------------------------------------------- */

(function ($) {
  "use strict";

  var cfg = {
    scrollDuration: 800, // smoothscroll duration
    mailChimpURL:
      "https://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e6957d85dc", // mailchimp url
  },
    $WIN = $(window);

  // Add the User Agent to the <html>
  // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
  var doc = document.documentElement;
  doc.setAttribute("data-useragent", navigator.userAgent);

  // svg fallback
  if (!Modernizr.svg) {
    $(".header-logo img").attr("src", "images/logo.png");
  }

  // Function to handle form submission
  function handleFormSubmission(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the form input values
    var name = $("#inputName").val();
    var email = $("#inputEmail").val();
    var message = $("#inputMessage").val();

    // Construct the request body object
    var requestBody = {
      to_email: email,
      subject: name,
      body: message,
    };

    // Make the POST request using AJAX
    $.ajax({
      url: "https://kteqa1.kothaiimpex.com/core/website-mail",
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(requestBody),
      success: function (response) {
        // Request successful, do something
        $("#inputName").val("");
        $("#inputEmail").val("");
        $("#inputMessage").val("");
        alert(response?.response);
      },
      error: function (xhr, status, error) {
        // Request failed, handle the error
        console.log("Request failed", error);
      },
    });
  }

  //   Form event Listener
  $("#contactForm").submit(handleFormSubmission);


  function buildGalleryImageCard(image) {
    // This function constructs the HTML for an image card.
    return '<div class="masonry__brick" data-aos="fade-up">' +
      '<div class="item-folio">' +
      '<div class="item-folio__thumb">' +
      '<a href="' + image.file + '" class="thumb-link" title="' + image.title + '" data-size="1050x700">' +
      '<img src="' + image.file + '" alt="' + image.title + '">' +
      '</a>' +
      '</div>' +
      '<div class="item-folio__text">' +
      '<h3 class="item-folio__title">' + image.title + '</h3>' +
      '</div>' +
      '<a href="' + image.file + '" class="item-folio__project-link" title="Project link">' +
      '<i class="icon-link"></i>' +
      '</a>' +
      '<div class="item-folio__caption">' +
      '<p>' + image.caption + '</p>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function buildGalleryVideoCard(video) {
    // This function constructs the HTML for a video card.
    // It uses the HTML5 video tag to display the first frame as a thumbnail.
    // The `controls` attribute adds video controls like play, pause, etc.
    return '<div class="masonry__brick" data-aos="fade-up">' +
      '<div class="item-folio">' +
      '<div class="item-folio__thumb">' +
      // Assuming the video file URL is directly playable in the browser
      '<video class="video-preview" controls>' +
      '<source src="' + video.file + '" type="video/mp4">' +
      'Your browser does not support the video tag.' +
      '</video>' +
      '</div>' +
      '<div class="item-folio__text">' +
      '<h3 class="item-folio__title">' + video.title + '</h3>' +
      '</div>' +
      '<div class="item-folio__caption">' +
      '<p>' + video.caption + '</p>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  /* Preloader
   * -------------------------------------------------- */
  var ssPreloader = function () {
    $("html").addClass("ss-preload");

    // Make GET request to the API
    $.ajax({
      url: "https://kteqa.kothaiimpex.com/api/v1/website/exhibitions",
      method: "GET",
      dataType: "json",
      success: function (response) {
        // API request successful

        // Process the response and perform necessary actions
        var exhibitionData = response.data;

        // Update your code with the logic using the API response
        // Loop through exhibitionData and create exhibition cards
        var exhibitionCards = "";
        exhibitionData.forEach(function (exhibition) {
          var card =
            '<div class="exhibition-card">' +
            '<div class="wrapper">' +
            '<div class="banner-image"><img src="' +
            exhibition.picture +
            '" alt=""></div>' +
            '<h3 style="color: #FFF; font-weight: 600; font-size: 2rem; margin-top: 0; margin-bottom: 2.5em;">' +
            exhibition.name +
            "</h3>" +
            '<p style="text-align: left; margin-bottom: 0;">' +
            '<i class="fa-solid fa-calendar" style="color: #FFFFFF;"></i>' +
            "&nbsp;" +
            exhibition.start_date +
            "</p>" +
            '<p style="text-align: left; margin-bottom: 0;">' +
            '<i class="fa-solid fa-location-dot" style="color: #FFFFFF;"></i>' +
            "&nbsp;" +
            exhibition.venue +
            "</p>" +
            '<p style="text-align: left; margin-bottom: 0;">' +
            '<i class="fa-solid fa-circle-info" style="color: #FFFFFF;"></i>' +
            "&nbsp;" +
            exhibition.booth_details +
            "</p>" +
            '<a href="' +
            exhibition.link +
            '" target="_blank" style="text-align: left !important; margin-bottom: 0; color: darkgrey; text-decoration: underline; font-size: 16px;">More Details</a>' +
            "</div>" +
            "</div>";

          exhibitionCards += card;
        });

        // Insert the generated exhibition cards into the "exhibitions-main" div
        $(".exhibitions-main").html(exhibitionCards);
      }
    });

    $.ajax({
      url: "https://kteqa.kothaiimpex.com/api/v1/website/gallery",
      method: "GET",
      dataType: "json",
      success: function (response) {
        var galleryData = response.data;
        $(".masonry").html('');
        // Create cards for websiteImages and append them to the "masonry" div

        var galleryCards = "";
        galleryData.forEach(function (item) {
          if (item.item_type === 'image') {
            // Build image card
            galleryCards += buildGalleryImageCard(item);
          } else if (item.item_type === 'video') {
            // Build video card
            galleryCards += buildGalleryVideoCard(item);
          }
        });

        // Append the generated website image cards to the "masonry" div
        $(".masonry").append(galleryCards);
        ssMasonryFolio();
        ssPhotoswipe();

        $("html, body").animate({ scrollTop: 0 }, "normal");

        // will first fade out the loading animation
        $("#loader").fadeOut("slow", function () {
          // will fade out the whole DIV that covers the website.
          $("#preloader").delay(300).fadeOut("slow");
        });

        // for hero content animations
        $("html").removeClass("ss-preload");
        $("html").addClass("ss-loaded");
      },
      error: function () {
        // API request failed
        console.log("Error occurred while making the API request.");
      },
    });
  };

  /* Menu on Scrolldown
   * ------------------------------------------------------ */
  var ssMenuOnScrolldown = function () {
    var menuTrigger = $(".header-menu-toggle");

    $WIN.on("scroll", function () {
      if ($WIN.scrollTop() > 150) {
        menuTrigger.addClass("opaque");
      } else {
        menuTrigger.removeClass("opaque");
      }
    });
  };

  /* OffCanvas Menu
   * ------------------------------------------------------ */
  var ssOffCanvas = function () {
    var menuTrigger = $(".header-menu-toggle"),
      nav = $(".header-nav"),
      closeButton = nav.find(".header-nav__close"),
      siteBody = $("body"),
      mainContents = $("section, footer");

    // open-close menu by clicking on the menu icon
    menuTrigger.on("click", function (e) {
      e.preventDefault();
      siteBody.toggleClass("menu-is-open");
    });

    // close menu by clicking the close button
    closeButton.on("click", function (e) {
      e.preventDefault();
      menuTrigger.trigger("click");
    });

    // close menu clicking outside the menu itself
    siteBody.on("click", function (e) {
      if (
        !$(e.target).is(
          ".header-nav, .header-nav__content, .header-menu-toggle, .header-menu-toggle span"
        )
      ) {
        siteBody.removeClass("menu-is-open");
      }
    });
  };

  /* Masonry
   * ---------------------------------------------------- */
  var ssMasonryFolio = function () {
    var containerBricks = $(".masonry");

    containerBricks.imagesLoaded(function () {
      containerBricks.masonry({
        itemSelector: ".masonry__brick",
        resize: true,
      });
    });
  };

  /* photoswipe
   * ----------------------------------------------------- */
  var ssPhotoswipe = function () {
    var items = [],
      $pswp = $(".pswp")[0],
      $folioItems = $(".item-folio");
    // get items
    $folioItems.each(function (i) {
      var $folio = $(this),
        $thumbLink = $folio.find(".thumb-link"),
        $title = $folio.find(".item-folio__title"),
        $caption = $folio.find(".item-folio__caption"),
        $titleText = "<h4>" + $.trim($title.html()) + "</h4>",
        $captionText = $.trim($caption.html()),
        $href = $thumbLink.attr("href"),
        $size = $thumbLink.attr("data-size") ? $thumbLink.data("size").split("x") : ["0", "0"],
        $width = $size[0],
        $height = $size[1];
      var item = {
        src: $href,
        w: $width,
        h: $height,
      };
      if ($caption.length > 0) {
        item.title = $.trim($titleText + $captionText);
      }
      items.push(item);
    });
    // bind click event
    $folioItems.each(function (i) {
      $(this).on("click", function (e) {
        e.preventDefault();
        var options = {
          index: i,
          showHideOpacity: true,
        };
        // initialize PhotoSwipe
        var lightBox = new PhotoSwipe(
          $pswp,
          PhotoSwipeUI_Default,
          items,
          options
        );
        lightBox.init();
      });
    });
  };

  /* slick slider
   * ------------------------------------------------------ */
  var ssSlickSlider = function () {
    $(".testimonials__slider").slick({
      arrows: false,
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      pauseOnFocus: false,
      autoplaySpeed: 1500,
    });
  };

  /* Smooth Scrolling
   * ------------------------------------------------------ */
  var ssSmoothScroll = function () {
    $(".smoothscroll").on("click", function (e) {
      var target = this.hash,
        $target = $(target);

      e.preventDefault();
      e.stopPropagation();

      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $target.offset().top,
          },
          cfg.scrollDuration,
          "swing"
        )
        .promise()
        .done(function () {
          // check if menu is open
          if ($("body").hasClass("menu-is-open")) {
            $(".header-menu-toggle").trigger("click");
          }

          window.location.hash = target;
        });
    });
  };

  /* Alert Boxes
   * ------------------------------------------------------ */
  var ssAlertBoxes = function () {
    $(".alert-box").on("click", ".alert-box__close", function () {
      $(this).parent().fadeOut(500);
    });
  };

  /* Animate On Scroll
   * ------------------------------------------------------ */
  var ssAOS = function () {
    AOS.init({
      offset: 200,
      duration: 600,
      easing: "ease-in-sine",
      delay: 300,
      once: true,
      //   TODO:
      //   disable: "mobile",
    });
  };

  /* Initialize
   * ------------------------------------------------------ */
  (function clInit() {
    ssPreloader();
    ssMenuOnScrolldown();
    ssOffCanvas();
    ssSlickSlider();
    ssSmoothScroll();
    ssAlertBoxes();
    ssAOS();
  })();
})(jQuery);
