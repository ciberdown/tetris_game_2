function down(elements) {
  elements.forEach((element) => {
    const px = parseInt(element.style.top);
    px < 600 && (element.style.top = px + 20 + "px");
  });
}
function right(elements) {
  elements.forEach((element) => {
    const px = parseInt(element.style.left);
    px < 400 && (element.style.left = px + 20 + "px");
  });
}
function left(elements) {
  elements.forEach((element) => {
    const px = parseInt(element.style.left);
    px > 0 && (element.style.left = px - 20 + "px");
  });
}
class Shape {
  constructor() {
    this.position = "absolute";
    this.height = "20px";
    this.width = "20px";
    this.boxSizing = "border-box";
    this.border = "1px solid black";
  }
  createElement(left = "0px", top = "0px") {
    const colors = ["red", "white", "green", "lightblue", "pink", "orange"];
    const game = document.getElementById("game");
    const el = document.createElement("div");
    const rnd = Math.random();
    el.style.backgroundColor = colors[Math.floor(rnd * colors.length)];
    el.style.position = this.position;
    el.style.height = this.height;
    el.style.width = this.width;
    el.style.top = top;
    el.style.left = left;
    el.style.boxSizing = this.boxSizing;
    el.style.border = this.border;
    el.id = rnd;
    game.appendChild(el);
    return el;
  }
}
const shape = new Shape();

function rotate_shape1([b0, b1, b2, b3, b4], pos) {
  if (pos == 1) {
    down([b4]);
    down([b4]);
    left([b4]);
    down([b3]);
    down([b3]);
    down([b3]);
    right([b2]);
    down([b2]);
    down([b2]);
    right([b1]);
    right([b1]);
    down([b1]);
    right([b0]);
    right([b0]);
    right([b0]);
  }
}

const b0 = shape.createElement("0px");
const b1 = shape.createElement("20px");
const b2 = shape.createElement("40px");
const b3 = shape.createElement("60px");
const b4 = shape.createElement("60px", "20px");
const shape1 = [b0, b1, b2, b3, b4];
rotate_shape1(shape1, 1);

const a0 = shape.createElement("100px");
const a1 = shape.createElement("120px");
const a2 = shape.createElement("120px", "20px");
const a3 = shape.createElement("140px");
const shape2 = [a0, a1, a2, a3];

const l0 = shape.createElement("180px");
const l1 = shape.createElement("200px");
const l2 = shape.createElement("220px");
const l3 = shape.createElement("240px");
const shape3 = [l0, l1, l2, l3];

const c0 = shape.createElement("280px");
const c1 = shape.createElement("300px");
const c2 = shape.createElement("280px", "20px");
const c3 = shape.createElement("300px", "20px");
const shape4 = [c0, c1, c2, c3];
