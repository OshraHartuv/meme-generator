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
      { txt: 'I know ', size: 20, align: 'left', color: 'red' },
    ],
  },
  {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [
      { txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' },
    ],
  }
];

var gMeme;

//

function getUrlByMeme(meme) {
  var img = gImgs.find((img) => {
    return img.id === meme.selectedImgId;
  });
  return img.url;
}

function getGmeme() {
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
