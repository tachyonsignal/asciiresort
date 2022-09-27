// You can assume this code runs before any other JavaScript.
//
// Style Guide: all global identifiers should be prefixed with $


$g = u => fetch(u).then(r => r.text());
$lazy = (_l, _component) => {
  return $g(`./components/${_component}.html`)
    .then(r => $(_l).find(':scope > .lazy')[0].innerHTML = r);
};

$PS = () => ({
  history: [],
  events: {},
  pub(event, ...args) {
    this.history.push(`e: ${event}`);

    let callbacks = this.events[event] || []
    for (let i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i](...args)
    }
  },
  sub(event, cb) {
    this.events[event]?.push(cb) || (this.events[event] = [cb])
    return () => {
      this.events[event] = this.events[event]?.filter(i => cb !== i)
    }
  }
});
$PS = $PS(); // Make singleton / global namespace for now.

// Event codes
const _0 = 0; $PS.sub(_0, _l => {                                // 'LAZY_LOAD_LAYOUTS_START';
  _l.removeAttribute('onmouseover');
  $lazy(_l, 'layouts');
});
const _2 = 2; $PS.sub(_2, _l => {                                // 'LAZY_LOAD_HINTS_START';
  _l.removeAttribute('onmouseover');
  $lazy(_l, 'hints');
});
const _49 = 49; $PS.sub(_49, () => {                                       // 'VIEWPORT_RESIZE'
  const viewportStart = parseInt($('#viewport-start')[0].value);
  const viewportSize = parseInt($('#viewport-size')[0].value);

  // this assumes layoutManager is loaded.
  const editor = layoutManager.getActivePane().editor;
  editor.ViewState.set(viewportStart, viewportSize);
  editor.Selection.setCursor(0, 0);
  editor.render();
});
const _50 = 50; $PS.sub(_50, () => {                                     // 'DOCUMENT_LOAD'
  const t0 = performance.now();
  const f = $("#file-input")[0].files[0];
  if (!f) {
    alert("No file selected");
  }
  f.text().then(text => {
    // this assumes layoutManager is loaded.
    layoutManager.getActivePane().editor.Model.text = text;
    const t1 = performance.now();
    console.log(`Reading file took ${t1 - t0} millis.`);
  });
});
const _30 = 30; $PS.sub(_30, _file => {
  let nBytes = _file.size,
    sOutput = "";
  // optional code for multiples approximation
  const aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  for (nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
    sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
  }
  $("#file-size")[0].innerHTML = sOutput || (nBytes + " bytes");
});
const _51 = 51; $PS.sub(_51, _ => {                                             // 'DOCUMENT_APPEND''
  const f = document.getElementById("file-input").files[0];
  if (!f) alert("No file selected");
  f.text().then(text => {
    const index = parseInt(document.getElementById('append-index').value);

    const s = text.split("\n");
    const t0 = performance.now();
    const o = layoutManager.getActivePane().editor;
    o.Model.splice(index, s);
    o.ViewState.start = 0;
    o.Selection.setCursor(0, 0);

    o.render();
    const t1 = performance.now();
    console.log(`Took ${parseFloat(t1 - t0).toFixed(2)} millis to splice ${s.length.toLocaleString()} elements at ${index.toLocaleString()} w/ ${o.ViewState.lc.toLocaleString()} lines.`);
  });
})
const _100 = 100; $PS.sub(_100, _ => layoutManager.getActivePane().editor.ViewState.scroll(-1)); // 'VIEWPORT_SCROLL_UP_1'
const _101 = 101; $PS.sub(_101, _ => layoutManager.getActivePane().editor.ViewState.scroll(1));  // 'VIEWPORT_SCROLL_DOWN_1'
// Usage Guide
//   $(<selector>) or $(<domNode>) to get a minimal jQuery-like object, which is collection of elements
//   $(<jqueryLikeObject>).on('click', <fn>) to handle click events
//   $(<jQueryLikeObject>).find(<selector>) to query for all children.
//
// Function Name Convention
//   $<function name>
//
// Variable naming Convention
//   globals
//     _A: the array-like element
//     _D: document
//     _W: watch
//   function scoped ( add an underscore, otherwise if only uses once, don't need )
//     _: placeholder
//     _c: context
//     _e: event
//     _f: function
//     _i: array length
//     _j: alternative use for index number
//     _k: key
//     _l: HTMLElement
//     _n: general element or selector
//     _r: response
//     _s: selector
//     _t: this
//     _u: url
//     _v: value
// 
// Do not use variables that start with a number after the underscore.
// Those are are reserved for event codes.

+ function (_D, _A, _W) {                                                        // Main
  $ = (_n, _c) => new i(_n, _c);                                                    // Factory
  function i(_n, _c, _, _i) {
    for (_ = (
      _n && _n.nodeType ? [_n] :                                                   // DomNode
        '' + _n === _n ? $q(_n, _c) :                                                // QueryString
          _A                                                                     // Default
    ), _i = _.length; _i--; _A.unshift.call(this, _[_i]));
  }
  $q = (_s, _c) => _c ? Array.from(_c).flatMap(_l => [..._l.querySelectorAll(_s)]) : _D.querySelectorAll(_s);

  i.prototype = {                                                                      // The prototype.
    on: function (_e, _f) { return this.each(_c => _c[_W](_e, _f)) },
    each: function (_f, _b, _t = this, _i = _t.length) {
      while (_i--) _f.call(_b || _t[_i], _t[_i]);
      return _t
    },
    attr: function (_k, _v) {
      // https://flaviocopes.com/how-to-check-undefined-property-javascript/#:~:text=May%2029%202019-,In%20a%20JavaScript%20program%2C%20the%20correct%20way%20to%20check%20if,to%20use%20the%20typeof%20operator.&text=If%20the%20value%20is%20not,returns%20the%20'undefined'%20string.
      return typeof _k === 'undefined' ? _A[0].getAttribute(k) : _A[0].setAttribute(_k, _v);
    },
    find: function (_s) {
      return $(_s, this);
    },
    parent: function () {
      return (this.length == 1) ? $(this[0].parentNode) : [];
    }
  }
}(document, [], 'addEventListener');