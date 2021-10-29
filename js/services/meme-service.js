'use strict';

var gKeywords = { happy: 12, 'funny puk': 1 };

var gImgs = [
  { id: 1, url: 'img/1.jpg', keywords: ['trump'] },
  { id: 2, url: 'img/2.jpg', keywords: ['dogs'] },
];

var gMemes = [
  {
    selectedImgId: 1,
    selectedLineIdx: 0,
    // isExport: false,
    lines: [
      {
        txt: 'I know',
        size: 20,
        fillColor: 'white',
        strokeColor: 'black',
        align: 'left',
        'font-family': 'impact',
        x: 10,
        y: 50,
        width: 0,
      },
      {
        txt: 'you',
        size: 20,
        fillColor: 'white',
        strokeColor: 'black',
        align: 'left',
        'font-family': 'impact',
        x: 10,
        y: 'init',
        width: 0,
      },
    ],
  },
  {
    selectedImgId: 2,
    selectedLineIdx: 0,
    // isExport: false,
    lines: [
      {
        txt: 'I never eat Falafel',
        size: 20,
        fillColor: 'white',
        strokeColor: 'black',
        align: 'left',
        'font-family': 'impact',
        x: 10,
        y: 50,
        width: 0,
      },
      {
        txt: 'I love falafel',
        size: 20,
        fillColor: 'white',
        strokeColor: 'black',
        align: 'left',
        'font-family': 'impact',
        x: 10,
        width: 0,
      },
    ],
  },
];

var gMeme;



function updateLinesSize(CanvasWidth, CanvasHeight) {
  gMeme.lines.forEach((line,idx) => {
    // if text is too wide
    if (line.width + 20 > CanvasWidth) {
      line.size -= 10;
      line.x = 10;
      updateRowWidth(line,idx)
      updateLinesSize(CanvasWidth, CanvasHeight);
    }
    // text is too low
    if (line.y > CanvasHeight - 10) {
      line.y = CanvasHeight - 10;
    }
    // text is too big
    if (line.size > CanvasHeight) {
      line.size =  CanvasHeight - 10;
    }
    alignText(line.align, idx);
  });
}

function alignText(CanvasWidth, idx = null) {
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
  if (gMeme.selectedLineIdx === null) return;
  var line =
    idx === null ? gMeme.lines[gMeme.selectedLineIdx] : gMeme.lines[idx];
  switch (key) {
    case 'initY':
      // value is gElCanvas.offsetHeight
      gMeme.lines[1].y = value - 10;
      break;

    case 'textDown':
      // value is gElCanvas.offsetHeight
      line.y += line.y + 15 <= value ? 5 : 0;
      break;

    case 'textUp':
      line.y -= line.y - line.size >= 5 ? 5 : 0;
      break;

    case 'decreaseFont':
      line.size -= line.size > 10 ? 10 : 0;
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
      line.width = value;
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
  if (gMeme.selectedLineIdx === null) return;
  var line = gMeme.lines[gMeme.selectedLineIdx];
  return {
    x: line.x - 3,
    y: line.y - line.size + 3,
    width: line.width + 5,
    height: line.size + 3,
  };
}

function updateSelectedLineIdx(value = null) {
  if (value === 'none') {
    gMeme.selectedLineIdx = null;
    console.log(gMeme.selectedLineIdx);
  } else if (
    gMeme.selectedLineIdx === null ||
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
  var currMeme = gMemes.find((meme) => {
    return `${meme.selectedImgId}` === elImgId;
  });
  gMeme = currMeme;
}
