'use strict';

var gElCanvas;
var gCtx;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  createGImgs(15);
  createMemes();
  renderGallery();
  addListeners();
}

function onShowSaved() {
  onHideEditor()
  var galleryContainer = document.querySelector('.gallery-container.main-layout');
  var memes = loadSavedMemes();
  var strHtml = ``;
  memes.forEach((meme,idx )=> {
  var img = new Image();
  img.src = meme;
  strHtml += `<div class="meme-img img-${idx+1}" id='meme-${idx+1}' style="background-image:url(${meme}) ; background-size: cover; background-position: center center;"></div>`;
  })
  galleryContainer.innerHTML = strHtml;
}

function onSaveMeme() {
  updateSelectedLineIdx('none');
  renderCanvas();
  saveMeme(gElCanvas);
  loadSavedMemes();
  console.log(loadSavedMemes());
}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
}

function onSwitchLines() {
  updateSelectedLineIdx();
  renderCanvas();
}

function onAddLine() {
  addLine(gElCanvas.offsetHeight);
  renderCanvas();
}

function onDeleteLine() {
  deleteLine();
  renderCanvas();
}

function onUpdateLine(key, value = null) {
  if (key === 'textDown') value = gElCanvas.offsetHeight;
  updateLine(key, value);
  if (key === 'align-right' || key === 'align-left' || key === 'align-center') {
    alignText(gElCanvas.offsetWidth);
  } else if (key === 'typeText') {
    var meme = getMeme();
    updateRowWidth(getCurrLine(), getCurrLineIdx());
    checkLinesSizes(gElCanvas.offsetWidth, gElCanvas.offsetHeight);
  }
  renderCanvas();
}

function onHideEditor() {
  var elEditor = document.querySelector('.editor-container');
  var elSearch = document.querySelector('.search-container');
  var elGallery = document.querySelector('.gallery-container');
  var elFooter = document.querySelector('.about-container');
  elEditor.style.display = 'none';
  elFooter.style.display = 'flex';
  elGallery.style.display = 'grid';
  elSearch.style.display = 'flex';
  updateGmeme('close');
  toggleMenu();
}

function onShowEditor(elImg = null) {
  var elEditor = document.querySelector('.editor-container');
  var elSearch = document.querySelector('.search-container');
  var elGallery = document.querySelector('.gallery-container');
  var elFooter = document.querySelector('.about-container');
  elEditor.style.display = 'grid';
  elSearch.style.display = 'none';
  elGallery.style.display = 'none';
  elFooter.style.display = 'none';
  updateGmeme(elImg.id);
  resizeCanvas();
}

function changeTextOnCanvas() {
  var meme = getMeme();
  gCtx.lineWidth = 2;
  var elTextInput = document.querySelector('.meme-text');
  if (meme.lines.length) {
    meme.lines.forEach((line, idx) => {
      var txt = line.txt;
      gCtx.strokeStyle = `${line.strokeColor}`;
      gCtx.fillStyle = `${line.fillColor}`;
      gCtx.font = `${line.size}px ${line['font-family']}`;
      updateLine('width', gCtx.measureText(txt).width, idx);
      if (idx === getCurrLineIdx()) {
        if (!txt) {
          elTextInput.placeholder = 'Type line text here';
          elTextInput.value = '';
        } else elTextInput.value = `${txt}`;
        // text too wide for canvas (type text)
        if (line.width > gElCanvas.offsetWidth - 10) {
          updateLine('decreaseFont');
          renderCanvas();
        }
        if (line.isClick) checkLinesSizes(gElCanvas.width, gElCanvas.height);
      } else if (line.y === 'init') {
        updateLine('initY', gElCanvas.offsetWidth);
        line = getMeme().lines[1];
      } else if (meme.selectedLineIdx === 'none') {
        elTextInput.placeholder = 'no line selected';
        elTextInput.value = '';
      }
      gCtx.fillText(`${txt}`, line.x, line.y);
      gCtx.strokeText(`${txt}`, line.x, line.y);
    });
    return;
  }
  elTextInput.placeholder = 'no lines (+ for adding)';
  elTextInput.value = '';
}

function drawLineArea() {
  if (!getLineArea()) return;
  var lineArea = getLineArea();
  gCtx.beginPath();
  gCtx.strokeStyle = 'red';
  gCtx.rect(lineArea.x, lineArea.y, lineArea.width, lineArea.height);
  gCtx.stroke();
}

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

function renderGallery() {
  var imgs = getGImgs();
  var galleryContainer = document.querySelector(
    '.gallery-container.main-layout'
  );
  var strHtml = ``;
  imgs.forEach((img, idx) => {
    strHtml += `<div class="gallery-img img-${
      idx + 1
    }" onclick="onShowEditor(this)" id='${
      idx + 1
    }' style="background-image:url('img/${
      idx + 1
    }.jpg') ; background-size: cover; background-position: center center;"></div>`;
  });
  galleryContainer.innerHTML = strHtml;
}

function resizeCanvas() {
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
  gCtx.font = `${line.size}px ${line['font-family']}`;
  updateLine('width', gCtx.measureText(line.txt).width, idx);
}

function onDown(ev) {
  var pos = getEvPos(ev);
  // var meme = getMeme();
  // meme.isClick = true;
  var line = getLineByPos(pos);
  if (line) renderCanvas();
}

function onMove(ev) {
  var pos = getEvPos(ev);
  console.log();
  var meme = getMeme();
  if (
    !meme.lines.length ||
    getCurrLineIdx() === 'none' ||
    !getCurrLine().isClick
  ) {
    return;
  } else if (
    pos.x === gElCanvas.width ||
    pos.y === gElCanvas.height ||
    !pos.y ||
    !pos.x
  ) {
    onUp();
  } else {
    var line = getLineByPos(pos);
    if (line) {
      moveClickedLine(pos);
      renderCanvas();
    }
  }
}

function onUp() {
  console.log('up');
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

function addListeners() {
  window.addEventListener('resize', resizeCanvas);
  addMouseListeners();
  addTouchListeners();
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

function notLoad(img) {
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
  changeTextOnCanvas();
}

function downloadImg(elLink) {
  updateSelectedLineIdx('none');
  renderCanvas();
  const data = gElCanvas.toDataURL('image/jpeg/png');
  elLink.href = data;
  elLink.download = 'my-meme';
}
