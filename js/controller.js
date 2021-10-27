'use strict';

var gElCanvas;
var gCtx;
var gLineIdx;
var gLine;

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  gLineIdx = 'initCanvas';
  addListeners();
}

function onTextDown() {
  if (gLine.y + 20 <= gElCanvas.offsetHeight) {
    updateLine(gLine, 'textDown')
    renderCanvas();
  }
}

function onTextUp() {
  if (gLine.y - gLine.size >= 10) {
    updateLine(gLine,'textUp')
    renderCanvas();
}
}

function onDecreaseFont() {
    if (gLine.size > 10) {
      updateLine(gLine,'decreaseFont')
      renderCanvas();
    }
}

function onIncreaseFont() {
    updateLine(gLine,'increaseFont');
    renderCanvas();
}

function onTypeText(elTextInput) {
    updateLine(gLine,'typeText',elTextInput.value)
//   gLine.txt = elTextInput.value;
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

function drawCanvas(meme) {
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = 'white';
  gCtx.font = `20px impact`;
  gCtx.lineWidth = 2;
  meme.lines.forEach((line, idx) => {
    var text = line.txt;
    if (idx === 0) {
      var elTextInput = document.querySelector('.meme-text');
      elTextInput.value = `${text}`;
      gLineIdx = 0;
      gLine = line;
    } else line.y = gElCanvas.offsetWidth - 10;
    line.width = gCtx.measureText(text).width;
    gCtx.fillText(`${text}`, line.x, line.y);
    gCtx.strokeText(`${text}`, line.x, line.y);
  });
}

function getLineIdx() {
  return gLineIdx;
}

function changeTextOnCanvas() {
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = 'white';
  gCtx.lineWidth = 2;
  var meme = getMeme();
  var lineIdx = getLineIdx();
  if (lineIdx === 'initCanvas') drawCanvas(meme);
  else {
    meme.lines.forEach((line, idx) => {
      var text = line.txt;
      gCtx.font = `${line.size}px impact`;
      if (idx === lineIdx) {
        var elTextInput = document.querySelector('.meme-text');
        elTextInput.value = `${text}`;
      }
      line.width = gCtx.measureText(text).width;
      if (line.width + line.x > gElCanvas.offsetWidth) {
        line.size -= 5;
        renderCanvas();
        changeTextOnCanvas();
      }
      gCtx.fillText(`${text}`, line.x, line.y);
      gCtx.strokeText(`${text}`, line.x, line.y);
    });
  }
}

function renderCanvas() {
  var meme = getMeme();
  //   if (!meme) return;
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
