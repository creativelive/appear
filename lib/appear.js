appear = function(obj){
  'use strict';

  return (function(obj){
    var initd = false, elements = [], elementsLength, appeared = 0, disappeared = 0, timer = null, opts = {};
    var reappear = [];

    // handle debouncing a function for better performance on scroll
    function debounce(fn, delay) {
      return function () {
        var self = this, args = arguments;
        clearTimeout(timer);
        console.log('debounce()');
        timer = setTimeout(function () {
          fn.apply(self, args);
        }, delay);
      };
    }

    // determine if a given element (plus an additional "bounds" area around it) is in the viewport
    function viewable(el){
      var rect = el.getBoundingClientRect();
      return (
        (rect.top + rect.height) >= 0 &&
        (rect.left + rect.width) >= 0 &&
        (rect.bottom - rect.height) <= ( (window.innerHeight || document.documentElement.clientHeight) + opts.bounds) &&
        (rect.right - rect.width) <= ( (window.innerWidth || document.documentElement.clientWidth) + opts.bounds)
      );
    }

    // called on scroll and resize event, so debounce the actual function that does
    // the heavy work of determining if an item is viewable and then "appearing" it
    function checkAppear() {
      (debounce(function() {
        doCheckAppear();
      }, opts.debounce)());
    }

    function end() {
      elements = null;
      if(timer) {
        clearTimeout(timer);
      }
      removeListeners();
    }

    function removeListeners() {
      console.log('remove listeners');
      removeEventListener('scroll', checkAppear);
      removeEventListener('resize', checkAppear);
    }

    function doCheckAppear() {
      console.log('doCheckReappear()');
      elements.forEach(function(n, i){
        if(n && viewable(n)) {
          // only act if the element is eligible to reappear
          if(reappear[i]) {
            // mark this element as not eligible to appear
            reappear[i] = false;
            // increment the count of appeared items
            appeared++;
            console.log('appears:', appeared);
            // call the appear fn
            if(opts.appear(n)) {
              opts.appear(n);
            }
            // if not tracking reappears or disappears, need to remove node here
            if(!opts.disappear && !opts.reappear) {
              // stop tracking this node, which is now viewable
              elements[i] = null;
            }
          }

        } else {
          if(reappear[i] === false) {
            if(opts.disappear) {
              opts.disappear(n);
            }
            // increment the dissappeared count
            disappeared++;
            console.log('disappears:', disappeared);
            // if not tracking reappears, need to remove node here
            if(!opts.reappear) {
              // stop tracking this node, which is now viewable
              elements[i] = null;
            }
          }
          // element is out of view and eligible to be appeared again
          reappear[i] = true;
        }
      });

      // remove listeners if all items have (re)appeared
      if(!opts.reappear && (!opts.appear || opts.appear && appeared === elementsLength) && (!opts.disappear || opts.disappear && disappeared === elementsLength)) {
        removeListeners();
        // all items have appeared, so call the done fn
        if(opts.done){
          opts.done();
        }
      }
    }

    function init() {
      // make sure we only init once
      if(initd) {
        return;
      }
      initd = true;

      // call the obj init fn
      if(opts.init) {
        opts.init();
      }
      // get the elements to work with
      var els;
      if(typeof opts.elements === 'function') {
        els = opts.elements();
      } else {
        els = opts.elements;
      }
      //  put elements into an array object to work with
      elementsLength = els.length;
      for(var i = 0; i < elementsLength; i += 1) {
        elements.push(els[i]);
        reappear.push(true);
      }
      // initial appear check before any scroll or resize event
      doCheckAppear();

      // add relevant listeners
      addEventListener('scroll', checkAppear);
      addEventListener('resize', checkAppear);
    }

    return function(obj) {
      // assign the fn to execute when a node is visible
      opts = {
        // a function to be run when the dom is ready (allows for any setup work)
        init: obj.init,
        // either an array of elements or a function that will return an htmlCollection
        elements: obj.elements,
        // function to call when an element is "viewable", will be passed the element to work with
        appear: obj.appear,
        // function to call when an element is no longer "viewable", will be passed the element to work with
        disappear: obj.disappear,
        // function to call when all the elements have "appeared"
        done: obj.done,
        // keep tracking the elements
        reappear: obj.reappear,
        // the extra border around an element to make it viewable outside of the true viewport
        bounds: obj.bounds || 200,
        // the debounce timeout
        debounce: obj.debounce || 50
      };

      // add an event listener to init when dom is ready
      addEventListener('DOMContentLoaded', init);
      // call init if document was already ready and we missed the event
      if (document.readyState === 'interactive' || document.readyState === 'complete' ) {
        init();
      }

      return {
        // provide a means to stop monitoring all elements
        destroy: function destroy() {
          end();
        }
      };

    };
  }()(obj));
};
