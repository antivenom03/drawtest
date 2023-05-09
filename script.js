const canvas = document.getElementById("canvas");
const lineButton = document.getElementById("line-button");
const selectButton = document.getElementById("select-button");
let startPoint = null;
let active = false;
let selectActive = true;
let selectedElement = null;
let offset = { x: 0, y: 0 };

lineButton.addEventListener("click", lineActive);
selectButton.addEventListener("click", activateSelect);
canvas.addEventListener("click", handleClick);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

function lineActive() {
  if (active) {
    active = false;
    selectActive = true;
    selectButton.classList.add("active");
    lineButton.classList.remove("active");
  } else {
    active = true;
    selectActive = false;
    lineButton.classList.add("active");
    selectButton.classList.remove("active");
  }
}

function activateSelect() {
  active = false;
  selectActive = true;
  selectButton.classList.add("active");
  lineButton.classList.remove("active");
}

function handleClick(event) {
  if (selectActive) {
    const targetElement = event.target;
    if (targetElement.tagName === "line") {
      selectedElement = targetElement;
      selectedElement.classList.add("selected");
      const bbox = selectedElement.getBBox();
      offset.x = event.clientX - bbox.x;
      offset.y = event.clientY - bbox.y;
    } else {
      if (selectedElement) {
        selectedElement.classList.remove("selected");
        selectedElement = null;
      }
    }
    return;
  }
  if (!active) {
    return;
  }
  if (!startPoint) {
    // If this is the first click, save the starting point
    startPoint = { x: event.offsetX, y: event.offsetY };
  } else {
    // If this is the second click, create the line
    const endPoint = { x: event.offsetX, y: event.offsetY };
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startPoint.x);
    line.setAttribute("y1", startPoint.y);
    line.setAttribute("x2", endPoint.x);
    line.setAttribute("y2", endPoint.y);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
    canvas.appendChild(line);
    startPoint = null;
  }
}

function handleMouseMove(event) {
  if (selectedElement) {
    const bbox = selectedElement.getBBox();
    selectedElement.setAttribute("x1", event.clientX - offset.x);
    selectedElement.setAttribute("y1", event.clientY - offset.y);
    selectedElement.setAttribute("x2", event.clientX - offset.x + bbox.width);
    selectedElement.setAttribute("y2", event.clientY - offset.y + bbox.height);
  }
}

function handleMouseUp(event) {
  if (selectedElement) {
    selectedElement.classList.remove("selected");
    selectedElement = null;
  }
}
