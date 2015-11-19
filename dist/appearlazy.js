/* appearlazy.js 1.0.3 */
appear(
  (function() {
    'use strict';
    var nodes = [];

    function addClass(el) {
      if (el.classList) {
        el.classList.add('appeared');
      } else {
        // IE9 compat
        el.className += ' ' + 'appeared';
      }
    }

    // set the image src or background attribute
    function doReveal(el) {
      var orig = el.getAttribute('src') || false;

      el.addEventListener('error', function handler(e) {
        // on error put back the original image if available (usually a placeholder)
        
        if (orig) {
          el.setAttribute('src', orig);
        }
        el.removeEventListener('error', handler); // hate this.
      });

      var src = el.getAttribute('data-src');
      if (src) {
        el.setAttribute('src', src);
        addClass(el);
        return;
      }
      src = el.getAttribute('data-bkg');
      if (src) {
        el.style.backgroundImage = 'url("' + src + '")';
        addClass(el);
        return;
      }
    }

    // find what element to work with, as we support containers of images
    function reveal(el) {
      if (el.hasChildNodes()) {
        // dealing with a container try and find children
        var els = el.querySelectorAll('[data-src], [data-bkg]');
        var elsl = els.length;
        if (elsl === 0) {
          // node has children, but none have the attributes, so reveal
          // the node itself (use case: div with a background)
          doReveal(el);
        } else {
          for (var j = 0; j < elsl; j++) {
            doReveal(els[j]);
          }
        }
      } else {
        doReveal(el);
      }
    }

    // reveal an image after a specified timeout
    function delayAppear(el, delay) {
      setTimeout(function() {
        reveal(el);
      }, delay);
    }

    return {
      // function executed when dom is interactive
      init: function init() {
        // find all elements with the class "appear"
        var els = document.getElementsByClassName('appear');
        var elsl = els.length;
        //  put html elements into an array object to work with
        for (var i = 0; i < elsl; i += 1) {
          // some images are revealed on a simple timeout, instead of
          // viewport appears. These delays appears must have
          // the appear class on them directly
          var delay = els[i].getAttribute('data-delay');
          if (delay) {
            delayAppear(els[i], delay);
          } else {
            nodes.push(els[i]);
          }
        }
      },
      elements: nodes,
      // function to run when an element is determined to be in view
      appear: reveal,
      // larger bounds area for reveal images
      bounds: 200
    };

  }())
);
