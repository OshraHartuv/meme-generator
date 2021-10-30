'use strict';

var gKeywords = { happy: 12, 'funny puk': 1 };

var gImgs = [
  { id: 1, url: 'img/1.jpg', keywords: ['trump'] },
  { id: 2, url: 'img/2.jpg', keywords: ['dogs'] },
  { id: 3, url: 'img/3.jpg', keywords: ['dogs' ,'baby'] },
  { id: 4, url: 'img/4.jpg', keywords: ['cat'] },
  { id: 5, url: 'img/5.jpg', keywords: ['baby'] },
  { id: 6, url: 'img/6.jpg', keywords: ['man'] },
  { id: 7, url: 'img/7.jpg', keywords: ['baby'] },
  { id: 8, url: 'img/8.jpg', keywords: ['man'] },
  { id: 9, url: 'img/9.jpg', keywords: ['baby'] },
  { id: 10, url: 'img/10.jpg', keywords: ['man'] },
];

var gMemes = [];
var gMeme;

function createMeme(id) {
  var meme = {
    selectedImgId: id,
    selectedLineIdx: 0,
    lines: [{}, {}],
  };
  meme.lines.forEach((line, idx) => {
    line['txt'] = '';
    line['size'] = 30;
    line['fillColor'] = 'white';
    line['strokeColor'] = 'black';
    line['align'] = 'left';
    line['font-family'] = 'impact';
    line['width'] = 0;
    line['x'] = 10;
    line['isClick'] = false;
    if (idx === 0) line['y'] = 50;
    else line['y'] = 'init';
  });
  // console.log(meme);
  return meme;
}

function updateNoClick() {
  gMeme.isClick = false;
  gMeme.lines[gMeme.selectedLineIdx].isClick = false;
}

function moveClickedLine(pos) {
  var lineClicked = gMeme.lines[gMeme.selectedLineIdx];
  lineClicked.x = pos.x - lineClicked.width / 2;
  lineClicked.y = pos.y + lineClicked.size / 2;
}

function checkLinesPos(pos) {
  var clickedLine = gMeme.lines.find((line) => {
    var xStart = line.x;
    var xEnd = line.width + line.x;
    var yEnd = line.y;
    var yStart = line.y - line.size;
    if (pos.x <= xEnd && pos.x >= xStart && pos.y >= yStart && pos.y <= yEnd)
      return line;
  });
  if (clickedLine) {
    var idx = gMeme.lines.findIndex((line) => {
      return line === clickedLine;
    });
    gMeme.selectedLineIdx = idx;
    gMeme.lines[idx].isClick = true;
  }
  return clickedLine;
}

function getImgLength() {
  return gImgs.length;
}

function createMemes() {
  for (var i = 0; i < gImgs.length; i++) {
    var meme = createMeme(i + 1);
    gMemes.push(meme);
  }
}

function deleteLine() {
  gMeme.lines.splice(gMeme.selectedLineIdx, 1);
  gMeme.selectedLineIdx = gMeme.lines.length ? 0 : 'no lines';
}

function addLine(CanvasHeight) {
  var line = {
    txt: '',
    size: 20,
    fillColor: 'white',
    strokeColor: 'black',
    align: 'left',
    'font-family': 'impact',
    x: 10,
    y: CanvasHeight / 2 + 10,
    width: 0,
  };
  gMeme.lines.push(line);
  gMeme.selectedLineIdx = gMeme.lines.length - 1;
  console.log(gMeme.lines);
  console.log(gMeme.selectedLineIdx);
}

function checkLinesSizes(CanvasWidth, CanvasHeight) {
  gMeme.lines.forEach((line, idx) => {
    if (!line.isClick) {
      // RESIZE
      // if text is too wide
      if (line.width + 20 > CanvasWidth) {
        line.size -= 5;
        line.x = 10;
        updateRowWidth(line, idx);
        checkLinesSizes(CanvasWidth, CanvasHeight);
      }
      // text is too big
      else if (line.size > CanvasHeight) {
        line.size = CanvasHeight - 10;
      }
    }

    // text is too low
    if (line.y > CanvasHeight - 10) {
      line.y = CanvasHeight - 10;
    }
    // text is too high
    if (line.y < line.size) line.y = line.size + 5;

    // line is too left
    if (line.width + line.x > CanvasWidth)
    line.x = CanvasWidth - line.width - 10;
    if (line.isClick) {
      // line is too right
      if (line.x < 10) line.x = 10;
    }

    // alignText(line.align, idx);
  });
}

function alignText(CanvasWidth, idx = null) {
  if (!gMeme.lines.length || gMeme.selectedLineIdx === 'none') return;
  var line = idx ? gMeme.lines[idx] : gMeme.lines[gMeme.selectedLineIdx];
  switch (line.align) {
    case 'left':
      if ((line.x = 10)) return;
      line.x = 10;
      break;

    case 'center':
      line.x = (CanvasWidth - line.width) / 2;
      break;

    case 'right':
      line.x = CanvasWidth - 10 - line.width;
      break;
  }
}

function updateLine(key, value, idx = null) {
  if (gMeme.selectedLineIdx === 'none' || !gMeme.lines.length) return;
  var line =
    idx === null ? gMeme.lines[gMeme.selectedLineIdx] : gMeme.lines[idx];
  switch (key) {
    case 'initY':
      // value is gElCanvas.offsetHeight
      gMeme.lines[1].y = value - 10;
      break;

    case 'textDown':
      // value is gElCanvas.offsetHeight
      line.y += line.y + 20 <= value ? 10 : 0;
      break;

    case 'textUp':
      line.y -= line.y - line.size >= 10 ? 10 : 0;
      break;

    case 'decreaseFont':
      line.size -= line.size > 10 ? 5 : 0;
      break;

    case 'increaseFont':
      line.size += 10;
      if (line.size > line.y) line.y = line.size;
      break;

    case 'typeText':
      line.txt = `${value}`;
      break;

    case 'width':
      // value is gCtx.measureText(text).width, idx
      line.width = value ? value : 20;
      break;

    case 'font-family':
      line['font-family'] = value;
      break;

    case 'fill-color':
      line.fillColor = value;
      break;

    case 'stroke-color':
      line.strokeColor = value;
      break;

    case 'align-left':
      line.align = 'left';
      break;

    case 'align-center':
      line.align = 'center';
      break;

    case 'align-right':
      line.align = 'right';
      break;
  }
}

function getLineArea() {
  if (gMeme.selectedLineIdx === 'none' || !gMeme.lines.length) return;
  var line = gMeme.lines[gMeme.selectedLineIdx];
  return {
    x: line.x - 3,
    y: line.y - line.size + 3,
    width: line.width + 5,
    height: line.size + 3,
  };
}

function updateSelectedLineIdx(value = null) {
  if (!gMeme.lines.length) {
    return;
  } else if (value === 'none') {
    gMeme.selectedLineIdx = 'none';
    // console.log(gMeme.selectedLineIdx);
  // } else if (typeof value === 'number') {
  //   gMeme.selectedLineIdx = value;
  } else if (
    gMeme.selectedLineIdx === 'none' ||
    gMeme.selectedLineIdx === gMeme.lines.length - 1 ||
    gMeme.lines.length === 1
  )
    gMeme.selectedLineIdx = 0;
  else {
    gMeme.selectedLineIdx += 1;
  }
}

function getUrlByMeme(meme) {
  var img = gImgs.find((img) => {
    return img.id === meme.selectedImgId;
  });
  return img.url;
}

function getMeme() {
  return gMeme;
}

function updateGmeme(elImgId) {
  if (elImgId === 'close') {
    gMeme = null;
    return;
  }
  var currMeme = gMemes.find((meme) => {
    return `${meme.selectedImgId}` === elImgId;
  });
  gMeme = currMeme;
}
