let layoutManager;
document.addEventListener('DOMContentLoaded', () => {
  layoutManager = $Mux($('#mux'), $WINSTON());
  $TARKOV(layoutManager);

  // Execute the lazy directives. Currently they assume each element only 
  // has 1 child that is a lazy slot.
  $('[data-lazy]').each(_l => $lazy(_l, _l.getAttribute('data-lazy')));
  $('[data-component]').each((_l, c = _l.getAttribute('data-component')) => {
    Promise.all([
      $lazy(_l, c, true),                                                     // get HTML
      $g(`./components/${c}.js`)                                              // get JS
    ]).then(([_, js]) => {
      var g = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];
      g.text = js;
      s.parentNode.insertBefore(g, s);
    });
  });
  // End lazy directives.
});