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
        width: 0,
      },
      {
        txt: 'nothing',
        size: 20,
        align: 'left',
        color: 'red',
        x: 10,
        y: 100,
        width: 0,
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
        width: 0,
      },
    ],
  },
];

var gMeme;

function updateLine(line, key,textInput = null) {
  switch (key) {
    case 'textDown':
      line.y += 10
      break;
    
    case 'textUp':
      line.y -= 10;
      break;
    
    case 'decreaseFont':
      line.size -= 10
      break;
    
    case 'increaseFont':
      line.size += 10;
      if (line.size > line.y) line.y = line.size;
      break;
    
    case 'typeText':
      line.text  = textInput;
      break;
    
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
