let can;
let context;
let activeMap = {
  id: "AlabamaCounty",
  width: 255,
  height: 404,
};
window.onload = init;

function init() {
  can = document.getElementById("can");
  context = can.getContext("2d");
  window.onresize = resize;
  resize();
}

function resize() {
  let isLandscape = window.innerWidth > window.innerHeight;
  if (isLandscape) {
    document.getElementById("controls").className = "controlsLandscape";
    document.getElementById("display").className = "displayLandscape";
  } else {
    document.getElementById("controls").className = "controlsPortrait";
    document.getElementById("display").className = "displayPortrait";
  }
  can.width = document.getElementById("display").getBoundingClientRect().width;
  can.height = document
    .getElementById("display")
    .getBoundingClientRect().height;
  drawMap();
}

function drawMap() {
  let mapAspectRatio = activeMap.width / activeMap.height;
  let displayRatio = can.width / can.height;
  let drawWidth;
  let drawHeight;
  let drawTop;
  let drawLeft;
  if (mapAspectRatio > displayRatio) {
    drawWidth = can.width;
    drawHeight = drawWidth / mapAspectRatio;
    drawLeft = 0;
    drawTop = (can.height - drawHeight) / 2;
  } else {
    drawHeight = can.height;
    drawWidth = drawHeight * mapAspectRatio;
    drawLeft = (can.width - drawWidth) / 2;
    drawTop = 0;
  }
  context.clearRect(0, 0, can.width, can.height);
  context.drawImage(
    document.getElementById(activeMap.id),
    drawLeft,
    drawTop,
    drawWidth,
    drawHeight
  );
}