'use strict';

var gKeywords = { happy: 12, 'funny puk': 1 };

var gImgs = [{ id: 1, url: 'img/2.jpg', keywords: ['happy'] }];

var gMeme = {
  selectedImgId,
  selectedLineIdx: 0,
  lines: [
    { txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' },
  ],
};

function updateGmeme(elImgId) {
  var currImg = gImgs.find((img) => {
    return `${img.id}` === elImgId;
  });
  drawImgOnCanvas(currImg.url)
  gMeme.selectedImgId =currImg.id

}
