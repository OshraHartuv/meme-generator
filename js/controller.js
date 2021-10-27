'use strict';

var gElCanvas;
var gCtx;

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  addListeners();
}

function onTextUp(){
    var meme = getMeme()
}

function onDecreaseFont(){
    var meme = getMeme()
      //   GET MEME LINE
    meme.lines[0].size -= 10
    renderCanvas()
}

function onIncreaseFont(){
    var meme = getMeme()
      //   GET MEME LINE
    meme.lines[0].size += 10
    renderCanvas()
}

function onTypeText(elTextInput) {
  //   GET MEME LINE
  var meme = getMeme();
  meme.lines[0].txt = elTextInput.value;
  console.log(getMeme());
  renderCanvas();
}

function onOpenEditor(elImg) {
  var elSearch = document.querySelector('.editor-container');
  elSearch.style.display = 'flex';
  var elSearch = document.querySelector('.search-container');
  elSearch.style.display = 'none';
  var elGallery = document.querySelector('.gallery-container');
  elGallery.style.display = 'none';
  updateGmeme(elImg.id);
  resizeCanvas();
}

function changeTextOnCanvas() {
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = 'white';
  gCtx.lineWidth = 2;
  var meme = getMeme();
  //   CHANGE TO ALL LINES + GET MEME LINES
  var text = meme.lines[0].txt;
  gCtx.font = `${meme.lines[0].size}px impact`;
  var elTextInput = document.querySelector('.meme-text');
  elTextInput.value = `${text}`;
  gCtx.fillText(`${text}`, 10, 50);
  gCtx.strokeText(`${text}`, 10, 50);
  gCtx.stroke()
}

function renderCanvas() {
  var meme = getMeme();
  if (!meme) return;
  var url = getUrlByMeme(meme);
  var img = new Image();
  img.src = `../${url}`;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    changeTextOnCanvas();
  };
}

function resizeCanvas() {
  console.log('resize');
  const elCanvasContainer = document.querySelector('.canvas-container');
  const elEditorContainer = document.querySelector('.editor-container');
  elEditorContainer.width = elCanvasContainer.offsetWidth;
  elEditorContainer.height = elCanvasContainer.offsetHeight;
  gElCanvas.width = elCanvasContainer.offsetWidth;
  gElCanvas.height = elCanvasContainer.offsetHeight;
  renderCanvas();
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
