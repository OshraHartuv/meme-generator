'use strict';

var gElCanvas;
// var gElTextCanvas
var gCtx;
// var gCtx2;

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  addListeners();
  //   resizeCanvas();
}

function onChangeText(elTextInput) {
  console.log(elTextInput.value);
  var meme = getGmeme();
  //   GET MEME LINE
  meme.lines[0].txt = elTextInput.value;
  renderCanvas(meme);
}

function onOpenEditor(elImg) {
  var elSearch = document.querySelector('.editor-container');
  elSearch.style.display = 'flex';
  var elSearch = document.querySelector('.search-container');
  elSearch.style.display = 'none';
  var elGallery = document.querySelector('.gallery-container');
  elGallery.style.display = 'none';
  updateGmeme(elImg.id);
  var meme = getGmeme();
  resizeCanvas();
}

function drawTextOnCanvas() {
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = 'white';
  gCtx.font = '40px impact';
  gCtx.lineWidth = 2;
  var meme = getGmeme();
  //   CHANGE TO ALL LINES + GET MEME LINES
  var text = meme.lines[0].txt;
  var elTextInput = document.querySelector('.meme-text');
  elTextInput.value = `${text}`;
  gCtx.fillText(`${text}`, 10, 50);
  gCtx.strokeText(`${text}`, 10, 50);
}

function renderCanvas(meme) {
  var url = getUrlByMeme(meme);
  var img = new Image();
  img.src = `../${url}`;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    drawTextOnCanvas();
  };
  //   resizeCanvas();
}

function resizeCanvas() {
  console.log('resize');
  const elContainer = document.querySelector('.canvas-container');
  //   console.log(elContainer.offsetWidth);
  //   console.log(elContainer.offsetHeight);
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height = elContainer.offsetHeight;
  //   console.log(gElCanvas.offsetWidth);
  //   console.log(gElCanvas.offsetHeight);
  var meme = getGmeme();
  renderCanvas(meme);
}

function addListeners() {
  //   addMouseListeners();
  //   addTouchListeners();
  window.addEventListener('resize', resizeCanvas);
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
    y: ev.offsetY,
  };
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault();
    ev = ev.changedTouches[0];
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    };
  }
  return pos;
}

function downloadImg(elLink) {
  // gCtx.fill(drawImgOnCanvas('img/1.jpg'))
  const data = gElCanvas.toDataURL();
  elLink.href = data;
  elLink.download = 'name';
}
