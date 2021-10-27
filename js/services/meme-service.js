'use strict';

var gKeywords = { happy: 12, 'funny puk': 1 };

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['happy'] }];
var gMemes=[{
  selectedImgId :1,
  selectedLineIdx: 0,
  lines: [
    { txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' },
  ],
}]
var gMeme = {
  selectedImgId :1,
  selectedLineIdx: 0,
  lines: [
    { txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' },
  ],
};

function getUrlById(imgId){
  var img  = gImgs.find((img) => {
    return `${img.id}` === imgId;   
  });
  return img.url

}

// function getImgById(imgId){
//  return  gImgs.find((img) => {
//     return `${img.id}` === imgId;   
//   });
// }

// function getUrlByMeme(meme){
//   var img =  gImgs.find((img) => {
//     return img.id === meme.selectedImgId;   
//   });
//   return img.url
// }

function getGmeme(){
  return gMeme
}

function updateGmeme(elImgId) {
  var currMeme = gMemes.find((meme) => {
    return `${meme.selectedImgId}` === elImgId;
  });
  gMeme = currMeme
}
