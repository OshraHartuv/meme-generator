'use strict';

var gElCanvas;
var gCtx;

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  addListeners()
  resizeCanvas();
//   renderCanvas();
}

function onOpenCanvas(elImg) {
    // console.log(elImg.id);
    updateGmeme(elImg.id)
}


function drawImgOnCanvas(currImgUrl){
    var img = new Image();
    img.src = `${currImgUrl}`;
    img.onload = () => {
      gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    };
    resizeCanvas()
}



function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    // elContainer.width = gElCanvas.offsetWidth
    // elContainer.height = gElCanvas.offsetHeight
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function addListeners() {
  addMouseListeners();
  addTouchListeners();
  window.addEventListener('resize', () => {
    resizeCanvas();
    // renderCanvas();
  });
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousemove', onMove);
  gElCanvas.addEventListener('mousedown', onDown);
  gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchmove', onMove);
  gElCanvas.addEventListener('touchstart', onDown);
  gElCanvas.addEventListener('touchend', onUp);
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}
