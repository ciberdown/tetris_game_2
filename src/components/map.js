class Map {
  constructor() {
    this.size = 21;
    this.canvas = document.getElementById("canvas").getContext("2d");
    this.margin_left = 50;
    this.margin_top = 20;
    this.padding = 1;
    this.shapes = [
      [
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
      ],
      [
        [6, 0],
        [7, 0],
        [8, 0],
        [9, 0],
      ],
      [
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 3],
      ],
    ];
    this.active_shape = this.shapes[1];
    this.active_shape_name = "square";
    this.encoder = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    this.create_map();
    this.create_shape(this.active_shape);
  }
  correction() {}
  rotation() {
    let newShape;
    if (this.active_shape_name === "square") {
      let mid = this.active_shape[Math.floor(this.active_shape.length / 2)]; //[8,0]
      let n = -1;
      if (this.active_shape[0][1] === this.active_shape[1][1]) {
        //horizantal
        newShape = this.active_shape.map((i) => {
          n++;
          return [mid[0], mid[1] + n];
        });
      } else if (this.active_shape[1][0] === this.active_shape[0][0]) {
        //vertical
        newShape = this.active_shape.map((i) => {
          n++;
          return [mid[0] + n, mid[1]];
        });
      }
      this.clear_shape(this.active_shape);
      this.create_shape(newShape, "green");
    }
    this.active_shape = newShape;
  }
  permission(newShape) {
    let per = true;
    newShape.forEach((pos) => {
      (pos[1] < 0 || pos[1] >= this.encoder[0].length) && (per = false);
      (pos[0] < 0 || pos[0] >= this.encoder.length) && (per = false);
    });
    return per;
  }
  create_map() {
    for (let i = 0; i < this.encoder.length; i++) {
      for (let j = 0; j < this.encoder[0].length; j++) {
        this.create_canvas(i, j, "red");
      }
    }
    document.getElementById("game").addEventListener("keydown", (e) => {
      e.preventDefault();
      e.key === "d" && this.move("right");
      e.key === "a" && this.move("left");
      e.key === "w" && this.move("up");
      e.key === "s" && this.move("down");
      e.key === " " && this.rotation();
    });
  }
  create_shape(shape, color) {
    color === undefined && (color = "green");
    shape.forEach((pos) => {
      this.create_canvas(pos[0], pos[1], color);
      color !== "red" && (this.encoder[pos[0]][pos[1]] = 5);
    });
    color === "red" && (this.active_shape = shape);
  }
  clear_shape(shape) {
    shape.forEach((pos) => {
      this.clear_canvas(pos[0], pos[1]);
      this.encoder[pos[0]][pos[1]] = 1;
    });
    this.create_shape(shape, "red");
  }
  move(dir) {
    // it has return value so pay attention
    let newShape;
    if (dir === "down") {
      newShape = this.active_shape.map((i) => {
        return [i[0], i[1] + 1];
      });
    } else if (dir === "up") {
      newShape = this.active_shape.map((i) => {
        return [i[0], i[1] - 1];
      });
    } else if (dir === "left") {
      newShape = this.active_shape.map((i) => {
        return [i[0] - 1, i[1]];
      });
    } else if ((dir = "right")) {
      newShape = this.active_shape.map((i) => {
        return [i[0] + 1, i[1]];
      });
    }
    if (this.permission(newShape)) {
      this.clear_shape(this.active_shape);
      this.create_shape(newShape, "green");
      this.active_shape = newShape;
      return newShape;
    } else {
      return this.active_shape;
    }
  }
  create_canvas(x, y, color) {
    this.canvas.fillStyle = color;
    this.canvas.fillRect(
      x * this.size + this.margin_left,
      y * this.size + this.margin_top,
      this.size - this.padding,
      this.size - this.padding
    );
  }
  clear_canvas(x, y) {
    this.canvas.clearRect(
      x * this.size + this.margin_left,
      y * this.size + this.margin_top,
      this.size - this.padding,
      this.size - this.padding
    );
  }
}

const map = new Map();
