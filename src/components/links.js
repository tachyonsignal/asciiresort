// $drawLink();

// $('#aside-details-files').on('toggle', _e => _e.target.hasAttribute('open') ? $drawLink() : $getCleanContext());
// TODO: reinstate when we reconsider this links component.
// $('#aside-details-buffers-container').on('toggle', _e => _e.target.hasAttribute('open') ? $drawLink() : $getCleanContext());

function $getCleanContext() {
  var canvas = $("#links")[0];
  canvas.width = canvas.height = 600;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return ctx;
}
function $drawLink() {
  var a = $("#file-a")[0],
    b = $("#buffer-a")[0],
    aRect = a.getBoundingClientRect(),
    bRect = b.getBoundingClientRect(),
    padding = 5,
    start = {
      x: aRect.left - padding,
      y: ((aRect.bottom - aRect.top) / 2) + aRect.top // Midpoint
    },
    // TODO: draw point to Details' Summary if Details is collapsed.
    end = {
      x: bRect.left - padding,
      y: ((bRect.bottom - bRect.top) / 2) + bRect.top
    },
    ctx = $getCleanContext();

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(start.x - 10, start.y);
  ctx.lineTo(start.x - 10, end.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function $lazy(_l, _component) {
  _l.removeAttribute('onmouseover');
  return fetch(`./components/${_component}.html`)
    .then(response => response.text())
    .then(html => $(_l).find('.lazy')[0].innerHTML = html);
}