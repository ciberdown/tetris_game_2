//when first time last col fulled its ok and works but next treats it works wrong
class Map {
  // 1 is red point,  2 is green points reach to buttom,  5 is shape still moving
  constructor() {
    this.size = 21;
    this.canvas = document.getElementById("canvas").getContext("2d");
    this.margin_left = 50;
    this.margin_top = 20;
    this.padding = 1;
    this.my_interval;
    this.col_fulled = false;
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
    this.set_active_shape();
    this.create_map(true);
  }
  set_active_shape(num) {
    num === undefined && (num = Math.floor(Math.random() * this.shapes.length));
    this.active_shape = this.shapes[num][0];
    this.active_shape_name = this.shapes[num][1];
    this.create_shape(this.shapes[num][0]);
  }
  set_all_red() {
    for (let i = 0; i < this.encoder.length; i++) {
      for (let j = 0; j < this.encoder[0].length; j++) {
        this.encoder[i][j] = 1;
        this.create_canvas(i, j, "red");
      }
    }
  }
  get_pos(x, y) {
    if (x >= this.encoder.length || y >= this.encoder[0].length) {
      console.log("length is :" + this.encoder.length, this.encoder[0].length);
      return 0;
    }
    return this.encoder[x][y];
  }
  get_row(y) {
    if (y >= this.encoder.length) {
      console.log("out of order");
      return 0;
    }
    return this.encoder[y];
  }
  get_column(x) {
    if (x >= this.encoder[0].length) {
      console.log("out of order");
      return 0;
    }
    let arr = [];
    for (let i = 0, len = this.encoder.length; i < len; i++) {
      arr.push(this.encoder[i][x]);
    }
    return arr;
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
      mid[1] = mid[1] - 2;
      newShape = this.active_shape.map((i, index) => {
        return [mid[0], mid[1] + index];
      });
    } else if (this.active_shape[1][0] === this.active_shape[0][0]) {
      //vertical rect
      mid[0] = mid[0] - 2;
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
      if (pos[1] < 0 || pos[1] >= this.encoder[0].length) {
        per = false;
      } else if (pos[0] < 0 || pos[0] >= this.encoder.length) {
        per = false;
      } else if (this.encoder[pos[0]][pos[1]] === 2) {
        per = false;
        for (let i = 0; i < this.encoder.length; i++) {
          for (let j = 0; j < this.encoder[0].length; j++) {
            this.encoder[i][j] === 5 && (this.encoder[i][j] = 2);
          }
        }
        this.set_active_shape(3);
      }
    });
    return per;
  }
  create_map(add_key_logics, n) {
    n === undefined && (n = 0);
    for (let i = 0; i < this.encoder.length; i++) {
      for (let j = 0; j < this.encoder[0].length - n; j++) {
        this.encoder[i][j] === 1 && this.create_canvas(i, j + n, "red");
        this.encoder[i][j] === 2 && this.create_canvas(i, j + n, "green");
      }
    }
    add_key_logics &&
      document.getElementById("game").addEventListener("keydown", (e) => {
        e.preventDefault();
        e.key === "d" && this.move("right");
        e.key === "a" && this.move("left");
        e.key === "w" && this.move("up");
        e.key === "s" && this.move("down");
        e.key === " " && this.rotation(); //space
        e.key === "Scape" && location.reload(); //stop game
      });
  }
  create_shape(shape, color) {
    color === undefined && (color = "green");
    shape.forEach((pos) => {
      this.create_canvas(pos[0], pos[1], color);
      color !== "red" && (this.encoder[pos[0]][pos[1]] = 5);
    });
    if (color !== "red") {
      this.active_shape = shape;
    }
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
  check_end_col() {
    return this.get_column(this.encoder[0].length - 1);
  }
  move(dir) {
    // it has return value so pay attention
    let newShape = this.movment(dir);
    if (this.permission(newShape)) {
      this.clear_shape(this.active_shape);
      this.create_shape(newShape, "green");
      this.active_shape = newShape;
      if (this.check_end_col().includes(5)) {
        //reach down
        for (let i = 0; i < this.encoder.length; i++) {
          for (let j = 0; j < this.encoder[0].length; j++) {
            this.encoder[i][j] === 5 && (this.encoder[i][j] = 2);
          }
        }
        console.log("reach down");
        this.set_active_shape(); //new random shape
      }
      if (this.check_end_col().every((val) => val === 2)) {
        this.col_fulled_func();
      }
      return newShape;
    } else {
      return this.active_shape;
    }
  }
  col_fulled_func() {
    let newArr = [];
    for (let n = 0, n_len = this.encoder.length; n < n_len; n++) {
      this.encoder[n][19] = 1;
    }
    for (let i = 0, i_len = this.encoder.length; i < i_len; i++) {
      for (let j = 0, j_len = this.encoder[0].length - 1; j < j_len; j++) {
        if (this.encoder[i][j] === 2) {
          newArr.push([i, j]);
        }
      }
    }
    this.create_map(false, 1);
  }
  create_canvas(x, y, color) {
    let a = false;
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
