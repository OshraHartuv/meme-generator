'use strict';

var gElCanvas;
var gCtx;

function onInit() {
  gElCanvas = document.getElementById('my-canvas');
  gCtx = gElCanvas.getContext('2d');
  addListeners();
}

function drawLineArea() {
  var lineArea = getLineArea()
  gCtx.beginPath()
  gCtx.strokeStyle = 'white'
  gCtx.rect(lineArea.x,lineArea.y,lineArea.width, lineArea.height)
  gCtx.stroke()
}

function onSwitchLines() {
  updateSelectedLineIdx()
  renderCanvas()
}

//UPDATE LINE

function onUpdateLine(key, value = null) {
  if (key === 'textDown') value = gElCanvas.offsetHeight;
  updateLine(key, value);
  // updateLineArea()
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
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = 'white';
  gCtx.lineWidth = 2;
  var meme = getMeme();
  // var lineIdx = meme.selectedLineIdx;
  meme.lines.forEach((line, idx) => {
    var text = line.txt;
    gCtx.font = `${line.size}px impact`;
    if (idx === meme.selectedLineIdx) {
      var elTextInput = document.querySelector('.meme-text');
      elTextInput.value = `${text}`;
      updateLine('xEnd', gCtx.measureText(text).width);
      if (line.xEnd > gElCanvas.offsetWidth) {
        updateLine('decreaseFont', 5);
        renderCanvas();
      }
    }
    // var lineXEnd = updateLine('width', gCtx.measureText(text).width,idx);
    else if (line.y === 'init') {
      updateSecondRowPos(gElCanvas.offsetWidth - 10);
      line = getMeme().lines[1]
      // updateSelectedLineIdx(0)
      // line.y = meme.lines[1].y
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
  img.src = `../${url}`;
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    changeTextOnCanvas();
    drawLineArea()
  };
}

// RESIZE
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

function downloadImg(elLink) {
  const data = gElCanvas.toDataURL();
  elLink.href = data;
  elLink.download = 'name';
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