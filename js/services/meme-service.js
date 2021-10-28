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
    lines: [
      {
        txt: 'I know ',
        size: 20,
        align: 'left',
        color: 'red',
        x: 10,
        y: 50,
        xEnd: 0,
      },
      {
        txt: 'nothing',
        size: 20,
        align: 'left',
        color: 'red',
        x: 10,
        y: 'init',
        xEnd: 0,
      },
    ],
  },
  {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'I never eat Falafel',
        size: 20,
        align: 'left',
        color: 'red',
        x: 10,
        y: 50,
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
  var line =
    idx === null ? gMeme.lines[gMeme.selectedLineIdx] : gMeme.lines[idx];
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
      line.xEnd = value + line.x;
      break;

    // case 'width':
    //   // line.width = value;
    //   line.Xend = value + line.x;
    // return line.width + line.x;

    // case 'initY':
    //   line.y = value;
    //   break;
  }
}

function getLineArea() {
  var line = gMeme.lines[gMeme.selectedLineIdx];
  return {
    x: line.x - 3,
    y: line.y - line.size,
    width: line.xEnd - line.x + 6,
    height: line.size + 3,
  };
}

function updateSelectedLineIdx(idx = null) {
  if (idx) gMeme.selectedLineIdx = idx;
  else if (gMeme.lines.length > 1) {
    gMeme.selectedLineIdx += gMeme.selectedLineIdx === 0 ? 1 : -1;
  }
  // updateLineArea()
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
