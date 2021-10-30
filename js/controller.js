'use strict';

var gElCanvas;
var gCtx;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function onInit() {
  createMemes();
  renderPhotos();
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  addListeners();
}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
}
// function renderStickers() {
//   // var length = getImgLength();
//   // for (var i = 1; i < length + 1; i++) {
//   var img = document.querySelector(`.s1`);
//   img.style.backgroundImage = `url('img/sticker-${1}.jpg')`;
//   img.style.backgroundSize = `cover`;
//   img.style.backgroundPosition = `center center`;
//   // }
// }

function renderPhotos() {
  var length = getImgLength();
  for (var i = 1; i < length + 1; i++) {
    var img = document.querySelector(`.img-${i}`);
    img.style.backgroundImage = `url('img/${i}.jpg')`;
    img.style.backgroundSize = `cover`;
    img.style.backgroundPosition = `center center`;
  }
}

function drawLineArea() {
  if (getLineArea() === undefined) return;
  var lineArea = getLineArea();
  gCtx.beginPath();
  gCtx.strokeStyle = 'white';
  gCtx.rect(lineArea.x, lineArea.y, lineArea.width, lineArea.height);
  gCtx.stroke();
}

function onSwitchLines() {
  updateSelectedLineIdx();
  renderCanvas();
}

// ADD LINE

function onAddLine() {
  addLine(gElCanvas.offsetHeight);
  renderCanvas();
}

// DELETE LINE

function onDeleteLine() {
  deleteLine();
  renderCanvas();
}

//UPDATE LINE

function onUpdateLine(key, value = null) {
  if (key === 'textDown') value = gElCanvas.offsetHeight;
  updateLine(key, value);
  renderCanvas();
}

function onCloseEditor() {
  var elSearch = document.querySelector('.editor-container');
  elSearch.style.display = 'none';
  var elSearch = document.querySelector('.search-container');
  elSearch.style.display = 'flex';
  var elGallery = document.querySelector('.gallery-container');
  elGallery.style.display = 'grid';
  var elFooter = document.querySelector('.about-container');
  elFooter.style.display = 'flex';
  updateGmeme('close');
  toggleMenu();
}

// FIRST OPEN
function onOpenEditor(elImg) {
  var elSearch = document.querySelector('.editor-container');
  elSearch.style.display = 'grid';
  var elSearch = document.querySelector('.search-container');
  elSearch.style.display = 'none';
  var elGallery = document.querySelector('.gallery-container');
  elGallery.style.display = 'none';
  var elFooter = document.querySelector('.about-container');
  elFooter.style.display = 'none';
  updateGmeme(elImg.id);
  resizeCanvas();
}

// CHANGE TEXT
function changeTextOnCanvas() {
  var meme = getMeme();
  gCtx.lineWidth = 2;
  var elTextInput = document.querySelector('.meme-text');
  if (meme.lines.length) {
    meme.lines.forEach((line, idx) => {
      var text = line.txt;
      gCtx.strokeStyle = `${line.strokeColor}`;
      gCtx.fillStyle = `${line.fillColor}`;
      gCtx.font = `${line.size}px ${line['font-family']}`;
      updateLine('width', gCtx.measureText(text).width, idx);
      if (idx === meme.selectedLineIdx) {
        if (!text) {
          elTextInput.placeholder = 'Type line text here';
          elTextInput.value = '';
        } else elTextInput.value = `${text}`;
        // text too wide for canvas (type text)
        if (line.width > gElCanvas.offsetWidth - 10) {
          updateLine('decreaseFont');
          renderCanvas();
        }
        if (!line.isClick) alignText(gElCanvas.offsetWidth);
        else checkLinesSizes(gElCanvas.width, gElCanvas.height);
      } else if (line.y === 'init') {
        updateLine('initY', gElCanvas.offsetWidth);
        line = getMeme().lines[1];
      } else if (meme.selectedLineIdx === 'none') {
        elTextInput.placeholder = 'no line selected';
        elTextInput.value = '';
      }
      gCtx.fillText(`${text}`, line.x, line.y);
      gCtx.strokeText(`${text}`, line.x, line.y);
    });
    return;
  }
  elTextInput.placeholder = 'no lines (+ for adding)';
  elTextInput.value = '';
}

// RENDER
function renderCanvas() {
  var meme = getMeme();
  var url = getUrlByMeme(meme);
  var img = new Image();
  img.src = `${url}`;
  // BUG WHEN DOWNLOAD
  if (!img.onload && gMeme.selectedLineIdx === 'none') notLoad(img);
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    changeTextOnCanvas();
    if (gMeme.selectedLineIdx !== 'none') drawLineArea();
  };
}

function notLoad(img) {
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
  changeTextOnCanvas();
}

// RESIZE

function resizeCanvas() {
  console.log('resize');
  if (!getMeme()) return;
  const elCanvasContainer = document.querySelector('.canvas-container');
  const elEditorContainer = document.querySelector('.editor-container');
  elEditorContainer.width = elCanvasContainer.offsetWidth;
  elEditorContainer.height = elCanvasContainer.offsetHeight;
  gElCanvas.width = elCanvasContainer.offsetWidth;
  gElCanvas.height = elCanvasContainer.offsetHeight;
  checkLinesSizes(gElCanvas.width, gElCanvas.height);
  renderCanvas();
}

function updateRowWidth(line, idx) {
  // var line =getMeme().lines[idx]
  gCtx.font = `${line.size}px ${line['font-family']}`;
  updateLine('width', gCtx.measureText(line.txt).width, idx);
}

// *****************
function onDown(ev) {
  var pos = getEvPos(ev);
  var meme = getMeme();
  var line = checkLinesPos(pos);
  if (line) renderCanvas();
}

function onMove(ev) {
  var pos = getEvPos(ev);
  // if (!getMeme().isClick) return;
  var meme = getMeme();
  if (
    !meme.lines.length ||
    meme.selectedLineIdx === 'none' ||
    !meme.lines[meme.selectedLineIdx].isClick
  )
    return;
  else if (
    pos.x === gElCanvas.width ||
    pos.y === gElCanvas.height ||
    !pos.y ||
    !pos.x
  ) {
    onUp();
  } else {
    var line = checkLinesPos(pos);
    if (line) {
      moveClickedLine(pos);
      renderCanvas();
    }
  }
}

function onUp() {
  updateNoClick();
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

// function getClientPos(ev) {
//   var pos = {
//     x: ev.clientX,
//     y: ev.clientY,
//   };
//   if (gTouchEvs.includes(ev.type)) {
//     ev.preventDefault();
//     ev = ev.changedTouches[0];
//     pos = {
//       x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
//       y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
//     };
//   }
//   return pos;
// }

// function onStickerDown(ev) {
//   var pos = getClientPos(ev);
//   var img = document.querySelector(`.s1`);
//   // img.style.backgroundImage = `url('img/sticker-${1}.jpg')`;
//   // img.style.backgroundSize = `cover`;
//   // img.style.backgroundPosition = `center center`;
//   img.style.position = `relative`;
//   // console.log(img.clientX);
//   // img.offsetX = pos.x;
//   var clientRect = img.getBoundingClientRect();
//   var clientX = clientRect.left;
//   var clientY = clientRect.top;
//   if (clientX < pos.x && clientY < pos.y && pos.x < clientX +40 && pos.y < clientY +40)
//   {img.style.top = `${clientY - pos.y}px`
//   img.style.right = `${clientX - pos.x}px`}
//   console.log(clientX, pos.x);
//   console.log(clientY, pos.y);
// }

// function onBodyDown(ev) {
//   var meme = getMeme();
//   if (!meme || !meme.moveSticker) return;
// }
// function onBodyMove(ev) {
//   var meme = getMeme();
//   if (!meme || !meme.moveSticker) return;
// }
// function onBodyUp(ev) {
//   var meme = getMeme();
//   if (!meme || !meme.moveSticker) return;
// }

function addListeners() {
  window.addEventListener('resize', resizeCanvas);
  addMouseListeners();
  addTouchListeners();
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousemove', onMove);
  gElCanvas.addEventListener('mousedown', onDown);
  gElCanvas.addEventListener('mouseup', onUp);
  // document.body.addEventListener('mousemove', onBodyMove);
  // document.body.addEventListener('mousedown', onBodyDown);
  // document.body.addEventListener('mouseup', onBodyUp);
  // var elStickerContainer = document.querySelector('.stickers-container');
  // // elStickerContainer.addEventListener('mousemove', onStickerMove)
  // elStickerContainer.addEventListener('mousedown', onStickerDown);
  // // elStickerContainer.addEventListener('mouseup', onStickerUp)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchmove', onMove);
  gElCanvas.addEventListener('touchstart', onDown);
  gElCanvas.addEventListener('touchend', onUp);
}

// DOWNLOAD

function downloadImg(elLink) {
  updateSelectedLineIdx('none');
  renderCanvas();
  const data = gElCanvas.toDataURL('image/jpeg/png');
  elLink.href = data;
  elLink.download = 'my-meme';
}
