class Map {
  constructor() {
    this.size = 21;
    this.canvas = document.getElementById("canvas").getContext("2d");
    this.margin_left = 50;
    this.margin_top = 20;
    this.padding = 1;
    this.shapes = [
      [
        [
          [1, 0],
          [1, 1],
          [2, 0],
          [2, 1],
        ],
        "square",
      ],
      [
        [
          [6, 0],
          [7, 0],
          [8, 0],
          [9, 0],
        ],
        "rectangle",
      ],
      [
        [
          [7, 0],
          [7, 1],
          [7, 2],
          [7, 3],
        ],
        "rectangle",
      ],
      [
        [
          [6, 0],
          [7, 0],
          [8, 0],
          [9, 0],
          [9, 1],
        ],
        "l_shape",
      ],
    ];
    this._game_speed = 2; //move per sec
    this.active_shape;
    this.active_shape_name;
    this.stop = false;
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
    this.game_logic();
  }
  set_active_shape(shape_num) {
    if (shape_num === undefined) {
      this.active_shape = this.shapes[0][0];
      this.active_shape_name = this.shapes[0][1];
    } else {
      this.active_shape = this.shapes[shape_num][0];
      this.active_shape_name = this.shapes[shape_num][1];
    }
    this.create_shape(this.active_shape);
  }
  correction(newShape) {
    newShape.forEach((dot, index) => {
      //left
      while (newShape[index][0] < 0) {
        newShape = this.movment("right", newShape);
      }
      //right
      while (newShape[index][0] >= this.encoder.length) {
        newShape = this.movment("left", newShape);
      }
      //up
      while (newShape[index][1] < 0) {
        newShape = this.movment("down", newShape);
      }
      //down
      while (newShape[index][1] >= this.encoder[0].length) {
        newShape = this.movment("up", newShape);
      }
    });
    return newShape;
  }
  rectangle_rotation(newShape, mid) {
    if (this.active_shape[0][1] === this.active_shape[1][1]) {
      //horizontal rect
      newShape = this.active_shape.map((i, index) => {
        return [mid[0], mid[1] + index];
      });
    } else if (this.active_shape[1][0] === this.active_shape[0][0]) {
      //vertical rect
      newShape = this.active_shape.map((i, index) => {
        return [mid[0] + index, mid[1]];
      });
    }
    return newShape;
  }
  l_shape_rotation(newShape, mid) {
    if (
      this.active_shape[1][1] === this.active_shape[2][1] //horizental L
    ) {
      if (this.active_shape[3][0] === this.active_shape[4][0]) {
        //---|
        mid[1] -= 2;
        newShape = [
          [mid[0], mid[1]],
          [mid[0], mid[1] + 1],
          [mid[0], mid[1] + 2],
          [mid[0], mid[1] + 3],
          [mid[0] - 1, mid[1] + 3],
        ];
      } else {
        mid[0] += 1;
        mid[1] -= 1;
        //|___
        mid[0] -= 1;
        mid[1] -= 1;
        newShape = [
          [mid[0] + 1, mid[1]],
          [mid[0], mid[1] + 1],
          [mid[0], mid[1] + 2],
          [mid[0], mid[1] + 3],
          [mid[0], mid[1]],
        ];
      }
    } else if (this.active_shape[3][0] === this.active_shape[2][0]) {
      //vertical L
      if (this.active_shape[3][0] === this.active_shape[4][0] + 1) {
        //_|
        mid[0] -= 1;
        newShape = [
          [mid[0], mid[1] - 1],
          [mid[0], mid[1]],
          [mid[0] + 1, mid[1]],
          [mid[0] + 2, mid[1]],
          [mid[0] + 3, mid[1]],
        ];
      } else {
        //|-
        mid[0] -= 2;
        console.log("first");
        newShape = [
          [mid[0], mid[1]],
          [mid[0] + 1, mid[1]],
          [mid[0] + 2, mid[1]],
          [mid[0] + 3, mid[1]],
          [mid[0] + 3, mid[1] + 1],
        ];
      }
    }
    return newShape;
  }
  rotation() {
    let newShape = this.active_shape; //square has no rotation
    let mid = this.active_shape[Math.floor(this.active_shape.length / 2)]; //[8,0]
    if (this.active_shape_name === "rectangle") {
      newShape = this.rectangle_rotation(newShape, mid);
    } else if (this.active_shape_name === "l_shape") {
      newShape = this.l_shape_rotation(newShape, mid);
    }
    newShape = this.correction(newShape);
    this.clear_shape(this.active_shape);
    this.create_shape(newShape, "green");
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
      e.key === " " && this.rotation(); //space
      e.key === "Scape" && (this.stop = true); //stop game
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
  movment(dir, shape) {
    shape === undefined && (shape = this.active_shape);
    let newShape;
    if (dir === "down") {
      newShape = shape.map((i) => {
        return [i[0], i[1] + 1];
      });
    } else if (dir === "up") {
      newShape = shape.map((i) => {
        return [i[0], i[1] - 1];
      });
    } else if (dir === "left") {
      newShape = shape.map((i) => {
        return [i[0] - 1, i[1]];
      });
    } else if ((dir = "right")) {
      newShape = shape.map((i) => {
        return [i[0] + 1, i[1]];
      });
    }
    return newShape;
  }
  move(dir) {
    // it has return value so pay attention
    let newShape = this.movment(dir);
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
  game_logic() {
    let num = 1;
    this.set_active_shape(1);
    let interval = setInterval(() => {
      this.move("down");
    }, 1000/this._game_speed);
    setInterval(() => {
      for (let i = 0; i < this.encoder.length; i++) {
        if (this.encoder[i][this.encoder[0].length - 1] === 5) {
          this.set_active_shape(2);
        }
      }
    }, 200);
  }

}

const map = new Map();
