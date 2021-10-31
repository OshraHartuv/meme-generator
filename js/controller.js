'use strict';

var gElCanvas;
var gCtx;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  createGImgs(15);
  createMemes();
  renderKeys()
  renderGallery();
  addListeners();
}

// SEARCH

function onSearch() {
  var elInput = document.querySelector('.search-input');
  var key = elInput.value;
  var imgs = setImgByKey(key);
  if (imgs.length === 15) {
    elInput.placeholder = 'No images found';
    elInput.value = '';
  }
  renderGallery();
}

function onSetImgByKey(val,elKey){
  console.log(val);
  setImgByKey(val)
  updateKeys(val)
  renderKeys()
  renderGallery()
}

// SAVED MEMES

function onShowSaved() {
  onHideEditor();
  var galleryContainer = document.querySelector(
    '.gallery-container.main-layout'
  );
  var memes = loadSavedMemes();
  var strHtml = ``;
  if (memes)
    memes.forEach((meme, idx) => {
      var img = new Image();
      img.src = meme;
      strHtml += `<div class="meme-img img-${idx + 1}" id='meme-${
        idx + 1
      }' style="background-image:url(${meme}) ; background-size: cover; background-position: center center;"></div>`;
    });
  else strHtml = '<h1>no saved memes<h1>';
  galleryContainer.innerHTML = strHtml;
}

function onSaveMeme(elBtn) {
  updateSelectedLineIdx('none');
  renderCanvas();
  saveMeme(gElCanvas);
  loadSavedMemes();
  elBtn.innerText('saved!');
  setTimeout(() => {
    elBtn.innerText('save');
  }, 1000);
  // console.log(loadSavedMemes());
}

// ROW EDITORS

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

function drawLineArea() {
  if (!getLineArea()) return;
  var lineArea = getLineArea();
  gCtx.beginPath();
  gCtx.strokeStyle = 'red';
  gCtx.rect(lineArea.x, lineArea.y, lineArea.width, lineArea.height);
  gCtx.stroke();
}

// RENDER


function renderKeys(){
  var keywords = getKeywords()
  var keysContainer = document.querySelector('.keywords-container')
  var strHtml = `<p style="font-size: ${(keywords['man'])*2 + 16 }px ;" class="key man" onclick="onSetImgByKey('man',this)">man</p>
  <p class="key trump" style="font-size: ${(keywords['trump'])*2 + 16 }px ;"  onclick="onSetImgByKey('trump',this)">trump</p>
  <p class="key dog"style="font-size: ${(keywords['dog'])*2 + 16 }px;"  onclick="onSetImgByKey('dog',this)">dog</p>
  <p class="key baby" style="font-size: ${(keywords['baby'])*2 + 16 }px;"  onclick="onSetImgByKey('baby',this)">baby</p>
  <p class="key cat" style="font-size: ${(keywords['cat'])*2 + 16 }px; " onclick="onSetImgByKey('cat',this)">cat</p>
  <p class="key obama" style="font-size: ${(keywords['obama'])*2 + 16 }px;"  onclick="onSetImgByKey('obama',this)">obama</p>
  `
  keysContainer.innerHTML = strHtml
}

function renderCanvas(value = null) {
  var meme = getMeme();
  var url = getUrlByMeme(meme);
  var img = new Image();
  img.src = `${url}`;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    changeTextOnCanvas();
    if (gMeme.selectedLineIdx !== 'none') drawLineArea();
    else if (value === 'isExport') {
      uploadImg();
    } else if (value === 'isDownload') {
      const elLink = document.createElement('a');
      const data = gElCanvas.toDataURL('image/jpeg');
      elLink.setAttribute('download', 'my-meme');
      elLink.href = data;
      document.body.appendChild(elLink);
      elLink.click();
      document.body.removeChild(elLink);
    }
  };
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

function renderGallery() {
  var imgs = getGImgs();
  var galleryContainer = document.querySelector(
    '.gallery-container.main-layout'
  );
  var strHtml = ``;
  imgs.forEach((img) => {
    strHtml += `<div class="gallery-img img-${img.id}" onclick="onShowEditor(this)" id='${img.id}' style="background-image:url('img/${img.id}.jpg') ; background-size: cover; background-position: center center;"></div>`;
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
  if (isNaN(getCurrLineIdx())) return;
  gCtx.font = `${line.size}px ${line['font-family']}`;
  updateLine('width', gCtx.measureText(line.txt).width, idx);
}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
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


// LISTENERS

function onDown(ev) {
  var pos = getEvPos(ev);
  var line = getLineByPos(pos);
  if (line) renderCanvas();
}

function onMove(ev) {
  var pos = getEvPos(ev);
  var meme = getMeme();
  if (
    !meme.lines.length ||
    getCurrLineIdx() === 'none' ||
    !getCurrLine().isClick
  ) {
    return;
  } else if (
    pos.x === gElCanvas.width - 1 ||
    pos.y === gElCanvas.height - 1 ||
    pos.y === 1 ||
    pos.x === 1
  ) {
    onUp();
    return;
  } else {
    moveClickedLine(pos);
    renderCanvas();
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

// DOWNLOAD & UPLOAD

function onDownloadImg() {
  updateSelectedLineIdx('none');
  renderCanvas('isDownload');
}

function onUploadImg() {
  updateSelectedLineIdx('none');
  renderCanvas('isExport');
}
