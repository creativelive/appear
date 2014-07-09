# ![appear](https://raw.githubusercontent.com/creativelive/appear/master/assets/appear-64.png) appear

Track the visibility of dom elements and fire user defined callbacks as they appear and disappear from view.

## Usage

Include the appear.js in your page, it has no dependencies.

Then call `appear()` and pass in an object with the following:

- `init` *optional* function to run when dom is interactive, but appear.js has not yet started tracking items.
- `elements` *required* either an htmlcollection or a function that returns an htmlcollection of items to track. The dom will be interactive at this point.
- `appear` *optional* function to run when an element is in view, passed the element that has come into view. If defined then appear.js will track an item until it comes into view
- `disappear` *optional* function to run when an element goes out of view, passed the element that has come into view. If defined then appear.js will track an item until it goes out of view
- `reappear` *optional* boolean, set to keep tracking an object for successfuive appears and dissappears, false by default
- `bounds` *optional* increase to the threshold of the size of the element so it can be considered "viewable" before it is actually in the viewport (default 200)
- `debounce` *optional* appear.js tracks elements on browser scroll and resize, for performance reasons this check is "debounced" to only happen once for multiple events, 50ms after the last event ends. You can override this value here.
- `done` *optional* function called when appear.js is no longer tracking any items and event listeners have been removed

Example usage:

```javascript
appear({
  init: function init(){
    console.log('starting');
  },
  elements: function elements(){
    // for example, get all elements with the class "lazy"
    return document.getElementsByClassName('lazy');
  },
  appear: function appear(el){
    console.log('visible', el);
  },
  disappear: function disappear(el){
    console.log('no longer visible', el);
  },
  reappear: true
});
```

View `test/index.html` in a browser for more example usage.

---

appear.js logo designed by [Magicon](http://thenounproject.com/magicon) from the [Noun Project](http://thenounproject.com/) :: Creative Commons – Attribution (CC BY 3.0)
