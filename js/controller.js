'use strict';

var gElCanvas;
// var gElTextCanvas
var gCtx;
// var gCtx2;

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  gCtx.lineWidth = 2;
  gCtx.font = '60px impact';
  addListeners();
  resizeCanvas();
  //   renderCanvas();
}

function onChangeText(elTextInput){
    console.log(elTextInput.value);
}


function onOpenEditor(elImg) {
    var elSearch = document.querySelector('.editor-container');
    elSearch.style.display = 'flex';
    var elSearch = document.querySelector('.search-container');
    elSearch.style.display = 'none';
    var elGallery = document.querySelector('.gallery-container');
    elGallery.style.display = 'none';
    updateGmeme(elImg.id);
    renderCanvas(getUrlById(elImg.id));
}

function drawTextOnCanvas() {
    gCtx.font = '40px impact';
    var meme = getGmeme();
  console.log(meme.lines[0].txt);
  var text = meme.lines[0].txt;
  var elTextInput = document.querySelector('.meme-text');
  elTextInput.value = `${text}`;
  gCtx.strokeStyle = 'black';
  gCtx.strokeText(`${text}`, 10, 50);
}

function renderCanvas(currImgUrl) {
    var img = new Image();
    img.src = `../${currImgUrl}`;
    img.style.position = 'absolute';
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        drawTextOnCanvas();
    };
    resizeCanvas();
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
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