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
        xEnd: 0,
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
        xEnd: 0,
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
        xEnd: 0,
      },
      {
        txt: 'I love falafel',
        size: 20,
        fillColor: 'white',
        strokeColor: 'black',
        align: 'left',
        'font-family': 'impact',
        x: 10,
        xEnd: 0,
      },
    ],
  },
];

var gMeme;

function updateSecondRowPos(value) {
  gMeme.lines[1].y = value;
  // line.y = value
}

function updateLine(key, value, idx = null) {
  if (gMeme.selectedLineIdx === null) return;
  var line =
    idx === null ? gMeme.lines[gMeme.selectedLineIdx] : gMeme.lines[idx];
  var lineWidth = line.xEnd - line.x;
  // console.log(line);
  switch (key) {
    case 'textDown':
      line.y += line.y + 20 <= value ? 10 : 0;
      break;

    case 'textUp':
      line.y -= line.y - line.size >= 10 ? 10 : 0;
      break;

    case 'decreaseFont':
      line.size -= line.size > value ? value : 0;
      break;

    case 'increaseFont':
      line.size += 10;
      if (line.size > line.y) line.y = line.size;
      break;

    case 'typeText':
      line.txt = `${value}`;
      break;

    case 'xEnd':
      // line.width = value;
      // if (line.xEnd > value - 10) {
      //   line.xEnd = value - 10;
      //   line.x = value - lineWidth - 10;
      // } else
       line.xEnd = value + line.x;
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
      if (line.x <= 10) return;
      line.x = 10;
      line.xEnd = lineWidth + 10;
      line.align = 'left';
      break;

    case 'align-center':
      line.align = 'center';
      line.x = (value - lineWidth) / 2;
      line.xEnd = lineWidth + line.x;
      break;

    case 'align-right':
      console.log(value);
      // var width = line.xEnd - line.x;
      if (lineWidth >= value - 20) return;
      line.align = 'right';
      line.xEnd = value - 10;
      line.x = line.xEnd - lineWidth;
      console.log(line);
      break;
  }
}

function getLineArea() {
  // debugger
  if (gMeme.selectedLineIdx === null) return;
  var line = gMeme.lines[gMeme.selectedLineIdx];
  return {
    x: line.x - 3,
    y: line.y - line.size,
    width: line.xEnd - line.x + 6,
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

// function getUrlById(imgId){
//   var img  = gImgs.find((img) => {
//     return `${img.id}` === imgId;
//   });
//   return img.url

// }

// function getImgById(imgId){
//  return  gImgs.find((img) => {
//     return `${img.id}` === imgId;
//   });
// }
