let can;
let context;
let mapIsDelivered = false;
const activeMap = {
  img: undefined,
  width: undefined,
  height: undefined,
  name: undefined,
};
window.onload = init;

function init() {
  can = document.getElementById("can");
  context = can.getContext("2d");
  document
    .getElementById("button-submit")
    .addEventListener("click", handleSubmit);

  document
    .getElementById("button-start")
    .addEventListener("click", handleStart);
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
  if (!mapIsDelivered) {
    return;
  }
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
  context.drawImage(activeMap.img, drawLeft, drawTop, drawWidth, drawHeight);
}

function handleSubmit() {
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      x: 42,
      pizza: "pretty good",
    }),
  })
    .then((response) => response.json()) // we are expecting json
    .then((json) => console.log(json))
    .catch((reason) => console.error("ERROR: " + reason));
  //when we are then chaining, we can just use the => without {} to do one
  // action and return it
}

function handleStart() {
  fetch("/start/meta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      x: 42,
      pizza: "pretty good",
    }),
  })
    .then((response) => response.json()) // we are expecting json
    .then((json) => {
      fetch("/start/img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          y: 89,
          sushi: "wicked gnarly",
        }),
      })
        .then((response) => response.blob()) // we are expecting binary data(file/img)
        .then((blob) => {
          // to do:
          const img = new Image();
          img.onload = () => {
            mapIsDelivered = true; //now map has been delivered so we changed the flag
            activeMap.img = img;
            activeMap.name = json.name;
            activeMap.width = json.width;
            activeMap.height = json.height;
            drawMap();
          };
          img.src = URL.createObjectURL(blob);
        })
        .catch((reason) => console.error("ERROR: " + reason));
    })
    .catch((reason) => console.error("ERROR: " + reason));

  //when we are then chaining, we can just use the => without {} to do one
  // action and return it
}
