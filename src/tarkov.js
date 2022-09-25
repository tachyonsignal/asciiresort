function $TARKOV(layoutManager) {
  layoutManager.$q.on('click', function ({ path }) {
    let len = path.length, i = 0, node = path[i];                                // Seek editor that was clicked
    while (i < len && !node.classList.contains('mux-container')) node = path[i++];

    layoutManager.setActivePane(node);                               // Make clicked editor the active one  
  });
  let modifier = false;

  const methodMapper = {
    'Delete': _ => _.delete(),
    'Backspace': _ => _.delete(),
    'Enter': _ => _.newLine(),
    'End': _ => _.moveEol(),
    'Home': _ => _.moveBol()
  };

  layoutManager.$q.on('keydown', ({ code, ctrlKey, key, metaKey, charCodeAt, shiftKey }) => {
    if (ctrlKey) return modifier = code == 'KeyB';                              // begin modifier sequence
    if (modifier && key == 'Shift') return;                                     // extend modifier sequence

    if (modifier) {                                                             // execute modifier sequence
      if (key == '"') layoutManager.split();
      else if (key == '%') layoutManager.splitH();

      return modifier = false;
    }

    const o = layoutManager.getActivePane().editor;
    // TODO: this should scroll page, not single line.
    if (code.startsWith('Page')) o.ViewState.scroll(charCodeAt(4) == 68 ? 1 : -1);
    else if (code.startsWith('Arrow')) {
      // Switch to cursor/selection respondingly.
      if (shiftKey) {
        if (!o.Selection.isSelection) o.Selection.makeSelection();
      } else if (o.Selection.isSelection) o.Selection.makeCursor();

      const direction = code.charCodeAt(5);
      const method = direction == 68 || direction == 85 ? 'moveRow' : 'moveCol';
      const chirality = direction == 68 || direction == 82 ? 1 : -1;
      o.Selection[method](chirality);
    }
    else if (methodMapper[code]) methodMapper[code](o.Selection)
    else if (key.length > 1) console.warn('Ignoring unknown key: ', code, key);
    else if (metaKey) {
      if (code == 'KeyV') {                                                   // paste
        if (!navigator.clipboard.readText) alert("Your browser doesn't allow clipboard access");
        // TODO: this api is only available in chrome at the time. do a browser polyfill.
        navigator.clipboard.readText().then(clipText => {
          o.Selection.insertLines(clipText.split('\n'));
        });
      } else if (code == 'KeyX') {                                            // cut
        if (!navigator.clipboard.readText) alert("Your browser doesn't allow clipboard access");
      } else {
        console.log('Ignoring ', key, ' because meta key is held.');
      }
    } else o.Selection.insert(key);
  });
}

