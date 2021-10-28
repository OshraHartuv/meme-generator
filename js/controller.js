'use strict';

var gElCanvas;
var gCtx;

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  addListeners();
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

//UPDATE LINE

function onUpdateLine(key, value = null) {
  if (key === 'textDown') value = gElCanvas.offsetHeight;
  else if (
    key === 'align-center' ||
    key === 'align-right'
  )
    value = gElCanvas.offsetWidth;
  updateLine(key, value);
  renderCanvas();
}

// FIRST OPEN
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

// CHANGE TEXT
function changeTextOnCanvas() {
  var meme = getMeme();
  gCtx.lineWidth = 2;
  var elTextInput = document.querySelector('.meme-text');
  meme.lines.forEach((line, idx) => {
    var text = line.txt;
    gCtx.strokeStyle = `${line.strokeColor}`;
    gCtx.fillStyle = `${line.fillColor}`;
    gCtx.font = `${line.size}px ${line['font-family']}`;
    updateLine('width', gCtx.measureText(text).width, idx);
    if (idx === meme.selectedLineIdx) {
      elTextInput.value = `${text}`;
      // text is out of canvas (type text)
      if (line.width > gElCanvas.offsetWidth - 10) {
        updateLine('decreaseFont', 10, idx);
        renderCanvas();
        return;
      }
      else if (line.x + line.width > gElCanvas.offsetWidth - 10) {
        updateLine('moveX', gElCanvas.offsetWidth);
        if (line.x < 10) {
          updateLine('align-left');
          renderCanvas()
          return
        }
      }
    }
    else if (line.y === 'init') {
      updateSecondRowPos(gElCanvas.offsetWidth - 10);
      line = getMeme().lines[1];
    }
    else if (meme.selectedLineIdx === null) {
      elTextInput.placeholder = 'no line selected';
      elTextInput.value = '';
    }
    gCtx.fillText(`${text}`, line.x, line.y);
    gCtx.strokeText(`${text}`, line.x, line.y);
  });
}

// RENDER
function renderCanvas() {
  var meme = getMeme();
  var url = getUrlByMeme(meme);
  var img = new Image();
  img.src = `${url}`;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    changeTextOnCanvas();
    drawLineArea();
  };
}

// RESIZE

function resizeCanvas() {
  // console.log('resize');
  if (!getMeme()) return;
  const elCanvasContainer = document.querySelector('.canvas-container');
  const elEditorContainer = document.querySelector('.editor-container');
  elEditorContainer.width = elCanvasContainer.offsetWidth;
  elEditorContainer.height = elCanvasContainer.offsetHeight;
  gElCanvas.width = elCanvasContainer.offsetWidth;
  gElCanvas.height = elCanvasContainer.offsetHeight;
  updateLinesSize(gElCanvas.width, gElCanvas.height);
  renderCanvas();
}

// *****************

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

// DOWNLOAD

function downloadImg(elLink) {
  // debugger
  // window.removeEventListener('resize', resizeCanvas)
  var meme = getMeme();
  // meme.isExport = true
  // updateSelectedLineIdx('none');
  renderCanvas();
  // elLink = document.querySelector('.btn');
  // const data = gElCanvas.toDataURL();
  // elLink.href = data;
  // elLink.download = 'my-meme';
  // window.addEventListener('resize', resizeCanvas);
}

// function drawCanvas(meme) {
//   gCtx.strokeStyle = 'black';
//   gCtx.fillStyle = 'white';
//   gCtx.font = `20px impact`;
//   gCtx.lineWidth = 2;
//   meme.lines.forEach((line, idx) => {
//     var text = line.txt;
//     if (idx === 0) {
//       var elTextInput = document.querySelector('.meme-text');
//       elTextInput.value = `${text}`;
//       gLineIdx = 0;
//       gLine = line;
//     } else line.y = gElCanvas.offsetWidth - 10;
//     line.width = gCtx.measureText(text).width;
//     gCtx.fillText(`${text}`, line.x, line.y);
//     gCtx.strokeText(`${text}`, line.x, line.y);
//   });
// }
// function onTextDown() {
//   // if (gLine.y + 20 <= gElCanvas.offsetHeight) {
//     updateLine('textDown', gElCanvas.offsetHeight);
//     renderCanvas();
//   // }
// }

// function onTextUp() {
//   // if (gLine.y - gLine.size >= 10) {
//     updateLine('textUp');
//     renderCanvas();
//   // }
// }

// function onDecreaseFont() {
//   // if (gLine.size > 10) {
//     updateLine('decreaseFont');
//     renderCanvas();
//   // }
// }

// function onIncreaseFont() {
//   updateLine('increaseFont');
//   renderCanvas();
// }

// function onTypeText(elTextInput) {
//   updateLine('typeText', elTextInput.value);
//   renderCanvas();
// }
