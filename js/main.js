

'use strict';

jQuery(document).ready(function($) {

  /* Parallax effect */
  var top_header = $('.parallax');
  top_header.css({'background-position':'center center'});

  // Offset background on scroll
  $(window).scroll(function () {
    var st = $(this).scrollTop();
    top_header.css({'background-position':'center calc(50% + '+(st*.5)+'px)'});
  });

  /* Update navbar selection */
  $('body').scrollspy({ 
      target: '.fixed-side-navbar',
      offset: 200
  });

  /* Smooth linking */
  $(".smoothlink a, a.smoothlink").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;
      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function() {
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    }
  });

  /* Interactive boxes */
  new FourierSeries('fourierseries-box', 'fourierseries', 500, 500);
  new PolarPlot('polarplot', 'polarplot-box', 500, 500);
  new CenterOfMass('centerofmass', 'centerofmass-box', 500, 500);
  new FourierTransform('fouriertransform', 'fouriertransform-box', 500, 500);

  /* Scroll Progress Bar */
  let scrollingbar = document.getElementById("scrollingbar");
  window.onscroll = () => {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollingbar.style.width = (winScroll / height * 100) + '%';
  };

  /* Desmos Integration */
  var elt = document.getElementById('graph1');
  var calculator = Desmos.GraphingCalculator(elt);

  calculator.updateSettings({
    invertedColors: true,
    keypad: false,
    settingsMenu: false,
    zoomButtons: false,
    expressionsCollapsed: true
  });

  calculator.setExpression({ id: 'k', latex: 'k=20' });
  calculator.setExpression({ id: 'k', sliderBounds: { min: 1, max: 50, step: 1 }});
  calculator.setExpression({ id: 'graph1', latex: '\\sum_{n=1}^{k}\\frac{2-2\\cos\\left(\\pi n\\right)}{\\pi n}\\sin\\left(nx\\right)' });
});