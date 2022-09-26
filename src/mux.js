// Manages a set of panes attaching an editor instance to each.
+ (function (_D, _A, _C, _Z, _Y, _X, _W) {
  $Mux = (
    $q,
    bufferManager,
    paneCount = 0,
    activePane = null,
    fragment = _D.createDocumentFragment(),
    template = _D[_W]('template'),
    newPane = (emoji, node = _D[_W]('div')) => (
      node[_C][_X]("💪", emoji, "mux-container"),
      (node.id = `mux-container-${++paneCount} `),
      node
    ),
    setActivePane = nodePane =>
      activePane[_C].remove(_Y) ||
      (activePane = nodePane)[_C][_X](_Y),
    newPaneAndEditorAsChild = (
      emoji,
      parentOrFragment,
      bufferId = bufferManager.addRandomBuffer(),
      nodePane = newPane(emoji),
      id = `mux-editor-${paneCount}`
    ) => {
      template.innerHTML = `
      <figure class="💪 🪜 🍜 🥷 💯">
        <figcaption><cite>Buffer: ${bufferId}</cite></figcaption>
        <blockquote cite="" class="💪 🍜 🥷 🌕 ">
        <div id="${id}" class="🦄" tabindex="0">
          <div class="🌮 🥷"></div>
          <div class="💪 💸">Line paneCount: <span class="🧛"></span></div>
        </div>
        </blockquote>
      </figure>
    `,
        node = template[_Z].firstElementChild,                            // hold ref before we append and lose 
        nodePane[_A](template[_Z]),
        parentOrFragment[_A](nodePane),
        activePane ?
          (activePane.innerHTML = '',
            activePane[_A](parentOrFragment),                                 // in this branch, it is a
            activePane[_C][emoji == "🌗" ? _X : 'remove']('🪜'),              // update the original pane, now a activePane
            setActivePane(nodePane)) :
          (activePane = nodePane)[_C][_X](_Y),
        activePane.editor = new Oryx(node, bufferManager, bufferId)
    },
    split = (emoji = "🌗", nestedPane = newPane(emoji), activeElement = _D.activeElement) => (
      template[_Z][_A](activePane.editor.node),
      nestedPane[_A](template[_Z]),
      nestedPane.editor = activePane.editor,
      fragment[_A](nestedPane),
      newPaneAndEditorAsChild(emoji, fragment),                                 // create second pane, add fragment to original pane 
      activeElement.focus()                                                      // retain focus on editor
    )) => newPaneAndEditorAsChild("🌕", $q[0]) || {
      $q,
      setActivePane,
      getActivePane: _ => activePane,
      splitH: _ => split("💔"),
      split
    };
})(document, 'appendChild', 'classList', 'content', 'mux-active', 'add', 'createElement');