function Oryx(node, bufferManager, _bufferId, fontSize = 12, initialSize = 100) {
  // https://usefulangle.com/post/323/javascript-check-if-function-called-with-new#:~:text=How%20to%20Check%20If%20a%20Javascript%20Function%20Was%20Called%20Using%20new%20Operator&text=The%20new.,%22new%22%20operator%20then%20new.
  if (new.target === undefined) throw new Error('Function not called using new');

  const $e = node.querySelector('.🌮');
  const $lc = node.querySelector('.🧛');
  const $container = node.querySelector('.🦄');

  let numSelections = initialSize;
  const fragmentSelections = document.createDocumentFragment();
  const selectionEls = [];
  populateSelections(numSelections);
  selectionEls[0].style.visibility = 'visible';
  selectionEls[0].style.display = 'block';

  const fragmentLines = document.createDocumentFragment();

  const Model = {
    // Pointer to buffer instance.
    lines: bufferManager.get(_bufferId),
    get lastIndex() { return this.lines.length - 1 },
    set text(value) {
      this.lines = value.split("\n");
      RENDER_FLAGS.lineContentsStart = 0;
      RENDER_FLAGS.lineContentsEnd = ViewState.size;
      render(RENDER_FLAGS);
    },
    splice(i, lines, n = 0) {
      // TODO: revaluate this. Seems very inefficient to splice like this.
      this.lines.splice(i, n, ...lines);
    },
    delete(i) {
      this.lines.splice(i, 1);
    }
  };
  const ViewState = {
    start: 0,
    size: initialSize,
    get lines() {
      return Model.lines.slice(this.start, this.end + 1);
    },
    get end() {
      return Math.min(this.start + this.size - 1, Model.lastIndex);
    },
    scroll(delta, render = true) {
      this.start = Math.min(Math.max(0, this.start + delta), Model.lastIndex);
      RENDER_FLAGS.lineContentsStart = 0;
      RENDER_FLAGS.lineContentsEnd = ViewState.size;
      if (render) render(RENDER_FLAGS);
    },
    set(start, size) {
      // TODO: use a proxy to validate.
      this.start = Math.min(Math.max(0, start), Model.lastIndex);
      // Create separate method for size.
      if (this.size != size) {
        this.size = size;
        populateSelections(size - numSelections);
      }
      render(RENDER_ALL); // TODO: revisit
    },
  }

  let tailDistinct = { row: 0, col: 0 };                                        // the tail value when tail is distinct from head.
  let tail = head = { row: 0, col: 0 };

  function populateSelections(quantity) {
    const start = selectionEls.length;
    const end = start + quantity;
    for (let i = start; i < end; i++) {
      const div = selectionEls[i] = document.createElement('div');
      div.style.display = 'block';
      div.style.visibility = 'hidden';
      div.style.top = `${fontSize * i}px`;
      div.classList.add('🧹');
      fragmentSelections.appendChild(div);
    }
    $container.appendChild(fragmentSelections);
  }

  const Selection = {
    get isSelection() { return tail != head },
    // Assumes we are in selection
    get isForwardSelection() {
      return head.row == tail.row && head.col < tail.col || head.row < tail.row;
    },
    makeSelection() {
      tail = tailDistinct;
      tail.row = head.row;
      tail.col = head.col;
    },
    setCursor(row, col) {
      tail.row = row;
      tail.col = col;
      this.makeCursor();
    },
    makeCursor() {
      head.row = tail.row;
      head.col = tail.col;
      tail = head;
    },
    // Returns (head, tail) in order of appearance.
    get ordered() { return this.isForwardSelection ? [head, tail] : [tail, head] },
    moveRow(value) {
      if (value > 0) {
        if (tail.row < (ViewState.end - ViewState.start)) {                     // Inner line, Move down
          tail.row += value;
          tail.col = Math.min(tail.col, ViewState.lines[tail.row].length);
          RENDER_FLAGS.selections = true;
        } else {                                                                // Last line of viewport, scroll viewport down
          if (ViewState.end != (Model.lastIndex)) {
            ViewState.scroll(1, false);
            tail.col = Math.min(tail.col, ViewState.lines[tail.row].length);
            RENDER_FLAGS.selections = true;
          } else { }                                                             // Last line of file, No-Op.
        }
      } else {
        if (tail.row == 0) {                                                    // First line of viewport, scroll viewport up
          ViewState.scroll(-1, false);
          tail.col = Math.min(tail.col, ViewState.lines[tail.row].length);
          RENDER_FLAGS.selections = true;
        } else {                                                                // Inner line, move up.
          tail.row += value;
          tail.col = Math.min(tail.col, ViewState.lines[tail.row].length);
          RENDER_FLAGS.selections = true;
        }
      }
      render(RENDER_FLAGS);
    },
    moveEol() {
      if (this.isSelection) Unimplemented();

      tail.col = ViewState.lines[head.row].length;
      RENDER_FLAGS.selections = true;
      render(RENDER_FLAGS);
    },
    moveBol() {
      if (this.isSelection) Unimplemented();

      tail.col = 0;
      RENDER_FLAGS.selections = true;
      render(RENDER_FLAGS);
    },
    moveCol(value) {
      if (value == 1) {
        if (tail.col < ViewState.lines[tail.row].length) {    // Move right 1 character.
          tail.col += value;
          RENDER_FLAGS.selections = true;
        } else {
          if (tail.row < (ViewState.end - ViewState.start)) { // Move to beginning of next line.
            tail.col = 0;
            tail.row++;
          } else {
            if (ViewState.end < Model.lastIndex) {               // Scroll from last line. 
              tail.col = 0;
              ViewState.scroll(1, false);
              RENDER_FLAGS.selections = true;
            } else {                                          // End of file 

            }
          }
        }
      } else if (value == -1) {
        if (tail.col > 0) {                                   // Move left 1 character.
          tail.col += value;
          RENDER_FLAGS.selections = true;
        } else {
          if (tail.row > 0) {                                 // Move to end of previous line
            tail.row--;
            tail.col = ViewState.lines[tail.row].length;
          } else {
            if (ViewState.start != 0) {                       // Scroll then move tail to end of new current line.
              ViewState.scroll(-1, false);
              tail.col = ViewState.lines[tail.row].length;
              RENDER_FLAGS.selections = true;
            } else {
            }
          }
        }
      } else {
        console.warning(`Do not handle moving by ${value}`);
      }
      render(RENDER_FLAGS);
    },
    insert(c) {
      if (this.isSelection) {
        // Sort head and tail by order of appearance ( depends on chirality )
        const [first, second] = this.ordered;
        const { index, left } = this.partitionLine(first);
        const { right } = this.partitionLine({ row: second.row, col: second.col + 1 });
        Model.splice(index, [left + c + right], second.row - first.row + 1);

        tail.row = first.row;
        tail.col = first.col;
        this.makeCursor();
        RENDER_FLAGS.lineContentsStart = first.row;
        RENDER_FLAGS.lineContentsEnd = second.row + 1;
        RENDER_FLAGS.selections = true;
      } else {
        const { index, left, right } = this.partitionLine(head);
        Model.lines[index] = left + c + right;
        tail.col++;
        RENDER_FLAGS.lineContentsStart = head.row;
        RENDER_FLAGS.lineContentsEnd = head.row + 1;
        RENDER_FLAGS.selections = true;
      }
      render(RENDER_FLAGS);
    },
    // TODO: consider a generalized version where we can insert before the selection.
    // Here, all insertions is relative to the selection
    insertLines(lines = '') {
      const { index, left, right } = this.partitionLine(head);
      Model.splice(index, lines, 1);
      Model.lines[index] = left + Model.lines[index];

      const lastIndex = index + lines.length - 1;
      Model.lines[lastIndex] += right;
      tail.col = Model.lines[lastIndex].length;

      const r = lines.length % ViewState.size;
      ViewState.start += lines.length - r;
      tail.row = r - 1;

      // TODO: verify we properly updated line count in all cases
      // TODO: We tested case where paste is small, paste is larger than viewport,
      // but what about case where paste is larger than remaining amount of viewport?
      RENDER_FLAGS.lineContentsStart = head.row; // TODO: This is partially redundant. Our custom splice does this, but we do more work afterards.
      RENDER_FLAGS.lineContentsEnd = ViewState.end; // Not optimal, may be more than enoug, but we assume we insert many lines.
      render(RENDER_FLAGS);
    },
    delete() {
      // TODO: Possibly, insert can be defined in terms of delete.
      if (this.isSelection) {
        return this.insert('');
      }

      const { index, left, right } = this.partitionLine(head);
      if (head.col > 0) {
        Model.lines[index] = left.slice(0, left.length - 1) + right;
        tail.col--;
        RENDER_FLAGS.lineContentsStart = head.row;
        RENDER_FLAGS.lineContentsEnd = head.row + 1;
        RENDER_FLAGS.selections = true;
      } else if (head.row > 0) {
        tail.col = Model.lines[index - 1].length;
        tail.row--;
        Model.lines[index - 1] += Model.lines[index];
        Model.delete(index);
        // TODO: might we be concerned with ViewState.end < viewport size?
        RENDER_FLAGS.selections = true;
        RENDER_FLAGS.lineContentsStart = head.row;
        RENDER_FLAGS.lineContentsEnd = ViewState.size + 1;
      }
      render(RENDER_FLAGS);
    },
    newLine() {
      // TODO: handle redundant rendering
      if (this.isSelection) Selection.insert('');

      const { index, left, right } = this.partitionLine(head);
      Model.lines[index] = left;
      Model.splice(index + 1, [right]);
      tail.col = 0;
      if (head.row < ViewState.size - 1) {
        tail.row++;
        RENDER_FLAGS.lineContentsStart = head.row;
        RENDER_FLAGS.lineContentsEnd = ViewState.size + 1;
        RENDER_FLAGS.selections = true;
      } else {
        ViewState.scroll(1, false);
      }
      render(RENDER_FLAGS);
    },
    // Utility to extract the text left, right, and character at the col of the 
    // position for the row of the position.
    partitionLine({ row, col }) {
      const index = ViewState.start + row;
      const line = Model.lines[index];
      return {
        index,
        left: line.slice(0, col),
        right: line.slice(col)
      }
    }
  };

  const lastRender = {
    lineCount: -1,
    firstRow: 0,
    secondRow: 0,
  };
  function render(flags) {
    if (!flags) {
      console.warn("Calling rendering without args");
      flags = RENDER_ALL;
    }
    const lineCount = Model.lastIndex + 1;
    if (lastRender.lineCount != lineCount) {
      lastRender.lineCount = lineCount;
      // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
      $lc.textContent = lineCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    if (flags.lineContainers) {
      $e.textContent = null;
      let i = ViewState.size;
      while (i--) fragmentLines.appendChild(document.createElement('pre'));
      $e.appendChild(fragmentLines);
    }
    if (flags.lineContentsStart != flags.lineContentsEnd) {
      let i = ViewState.size
      while (i--) $e.children[i].textContent = ViewState.lines[i] || null;
    }

    const [firstEdge, secondEdge] = Selection.ordered;
    const lines = ViewState.lines;

    // Toggle visibility
    const queued = {}
    for (let i = lastRender.firstRow; i <= lastRender.secondRow; i++) queued[i] = true;  // Previously rendered, flag for deletion
    for (let i = firstEdge.row; i <= secondEdge.row; i++)
      if (queued[i]) delete queued[i];                                          // was being rendered, keep being rendered.
      else {
        selectionEls[i].style.visibility = 'visible';
        selectionEls[i].style.left = 0;
        selectionEls[i].style.width = `${lines[lastRender.firstRow].length + 1}ch`;
      }
    const keys = Object.keys(queued);
    for (let i = 0; i < keys.length; i++) selectionEls[keys[i]].style.visibility = 'hidden';

    // This is the only reliable way to tweak the prior two edges. We actually 
    // can't assume just one edged moved, and exactly by 1, either.
    selectionEls[lastRender.secondRow].style.width = `${lines[lastRender.secondRow].length + 1}ch`;
    selectionEls[lastRender.firstRow].style.left = 0;
    selectionEls[lastRender.firstRow].style.width = `${lines[lastRender.firstRow].length + 1}ch`;

    // Configure the two new edges.
    selectionEls[firstEdge.row].style.left = `${firstEdge.col}ch`;
    if (secondEdge.row == firstEdge.row) {
      selectionEls[firstEdge.row].style.width = `${secondEdge.col - firstEdge.col + 1}ch`;
    } else {
      selectionEls[firstEdge.row].style.width = `${lines[firstEdge.row].length - firstEdge.col + 1}ch`;
      selectionEls[secondEdge.row].style.width = `${secondEdge.col + 1}ch`;
    }


    lastRender.firstRow = firstEdge.row;
    lastRender.secondRow = secondEdge.row;

    RENDER_FLAGS.selections = RENDER_FLAGS.lineContainers = RENDER_FLAGS.lineCount = false;
    RENDER_FLAGS.lineContentsEnd = RENDER_FLAGS.lineContentsStart = 0;
  }

  const RENDER_ALL = {
    lineContainers: true,
    lineContentsStart: 0,
    lineContentsEnd: ViewState.size,
    selections: true,
  };
  const RENDER_FLAGS = {
    lineContainers: false,
    lineContentsStart: 0,
    lineContentsEnd: 0,
    selections: false,
  };

  render(RENDER_ALL);
  this.render = render;
  this.Model = Model;
  this.ViewState = ViewState;
  this.Selection = Selection;
  this.node = node;

  // TODO: move this somewhere else.
  // Proof that this works.
  // 1. Add a new buffer
  //    bufferManager[3] = ['a', 'b'];
  // 2. Point this editor ( assume id 0 here ) to the new buffer
  //    layoutManager.getEditorInstances()[0].attach(3);
  // 3. Observe the text is loaded
  // 4. Make some text changes
  // 5. observe changes reflected
  // 6. switch the editor back to the old buffer
  //  layoutManager.getEditorInstances()[0].attach(0);
  // 7. observe the contents reflect old buffer
  // 8. switch back to new buffer
  //    layoutManager.getEditorInstances()[0].attach(3);
  // 9. observe the changes made to the old buffer is modified
  // Q.E.D.
  //
  // TODO: Followup:
  //  - how is concurrency handled? ( multiple editors pointing to same buffer)
  this.attach = function (_bufferId) {
    Model.lines = bufferManager.get(_bufferId);
    this.render(RENDER_ALL);
  }

  return this;
}

function Unimplemented() {
  throw new Error('Unimplemented')
}