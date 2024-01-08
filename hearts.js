let inkLine;
let colors = [];
let lines = [];
let totalLines = 16;
let lineInterval = 0;
let layers = 0;
let offset = [];

let palette = [
  "#7b4800",
  "#002185",
  "#003c32",
  "#fcd300",
  "#ff2702",
  "#6b9404",
];

let palettes = [
  [
    [47, 72, 88],
    [214, 40, 57],
  ],
  [
    [55, 63, 81],
    [0, 141, 213],
  ],
  [
    [229, 99, 153],
    [50, 14, 59],
  ],
  [
    [252, 186, 4],
    [165, 1, 4],
  ],
  [
    [165, 1, 4],
    [100, 141, 229],
  ],
  [
    [80, 114, 85],
    [72, 139, 73],
  ],
];

let startDate = 1664494200; // September 29th, 2022
let paperTexture;
let daysBetween;

var numDaysBetween = function (d1) {
  var d2 = new Date();
  var diff = Math.abs(d1 - d2.getTime() / 1000);
  return diff / (60 * 60 * 24);
};

function customShuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

let sourceSerif = null;

let lineFunction = {
  title: "line",
  formula: (x1, y1, x2, y2, points) => {
    let returnArray = [];
    for (let n = 0; n < points; n++) {
      let plotX = (x2 * n) / points + (x1 * (points - n)) / points;
      let plotY =
        (y2 * n) / points + (y1 * (points - n)) / points + noise(plotX);
      returnArray.push({ x: plotX, y: plotY });
    }
    return returnArray;
  },
};

let circleFunction = {
  title: "circle",
  formula: (x1, y1, x2, y2, points) => {
    let returnArray = [];
    let offset = random(100);
    for (let n = 0; n < points; n++) {
      angleMode(DEGREES);
      let centerX = x1;
      let centerY = y1;
      let radius = dist(x1, y1, x2, y2) / 2;
      let angle = cos((n / points) * 360 * 0.5 + 90);
      let plotX = centerX + radius * cos((n / points) * 360 - offset);
      let plotY = centerY + radius * sin((n / points) * 360 - offset);
      returnArray.push({ x: plotX, y: plotY, shade: angle });
    }
    return returnArray;
  },
};

let spiralFunction = {
  title: "spiral",
  formula: (x1, y1, x2, y2, points) => {
    let returnArray = [];
    let offset = random(100);
    for (let n = 0; n < points; n++) {
      angleMode(DEGREES);
      let centerX = x1;
      let centerY = y1;
      let radius = ((dist(x1, y1, x2, y2) / 3) * n) / points;
      let plotX = centerX + radius * cos((n / 1 + offset) % 360);
      let plotY = centerY + radius * sin((n / 1 + offset) % 360);
      returnArray.push({ x: plotX, y: plotY });
    }
    return returnArray;
  },
};

let waveFunction = {
  title: "wave",
  formula: (x1, y1, x2, y2, points) => {
    angleMode(DEGREES);
    let returnArray = [];
    let offset = random(360);
    for (let n = 0; n < points; n++) {
      let centerX = (x1 + x2) / 2;
      let centerY = (y1 + y2) / 2;
      let radius = ((dist(x1, y1, x2, y2) / 4) * n) / points;
      let plotX,
        plotY = null;
      if (x1 == x2) {
        plotY = (y2 * n) / points + (y1 * (points - n)) / points;
        plotX = centerX + radius * sin(((n / points) * offset) % 360);
      } else {
        plotX = (x2 * n) / points + (x1 * (points - n)) / points;
        plotY = centerY + radius * sin(((n / points) * 360) % offset);
      }
      returnArray.push({ x: plotX, y: plotY });
    }
    return returnArray;
  },
};

let heartFunction = {
  title: "heart",
  formula: (x1, y1, x2, y2, points) => {
    angleMode(DEGREES);
    let returnArray = [];
    let offset = (x1 + y1) & 360;
    for (let n = 0; n < points; n++) {
      let centerX = x1;
      let centerY = y1;
      let radius = dist(x1, y1, x2, y2) / 2;
      // let angle = cos((n/points * 360 * 0.5 + 90));
      let plotX = centerX + radius * pow(sin((n / points) * 360 - offset), 3);
      let plotY =
        centerY -
        (0.8 * radius * cos((n / points) * 360 - offset) -
          0.35 * radius * cos(2 * ((n / points) * 360 - offset)) -
          0.2 * radius * cos(3 * ((n / points) * 360 - offset)) -
          0.05 * radius * cos(4 * ((n / points) * 360 - offset)));
      returnArray.push({ x: plotX, y: plotY });
    }
    return returnArray;
  },
};

let shapeFunctions = [
  lineFunction,
  circleFunction,
  spiralFunction,
  waveFunction,
  heartFunction,
];
function preload() {
  sourceSerif = loadFont("./SourceSerif4-BoldItalic.ttf");
}

function setup() {
  pixelDensity(2);
  textFont(sourceSerif);
  if (windowHeight > 1800) {
    createCanvas(windowWidth, windowHeight);
  } else {
    createCanvas(windowWidth, 3400);
  }

  pixelDensity(2);
  palette = palettes[Math.floor(random(0, palettes.length))];

  daysBetween = Math.floor(numDaysBetween(startDate));
  console.log(daysBetween);
  rows = Math.round(random(5, 20));

  numHearts = daysBetween;
  columns = Math.ceil(width / 200);
  rows = Math.ceil(numHearts / columns);

  customShuffle(palettes);
  // customShuffle(shapeFunctions)
  // shuffle(shape)
  for (let i = 0; i < numHearts; i++) {
    let ink = new InkLine(palettes[i % palettes.length], null);
    // let ink = new InkLine([[0,0,0], [0,0,0]], null);

    ink.setSplatter(0.98 - i / 100, 0.4 + i / 100, i);
    ink.setEndBubble(0.0);
    ink.setAnalogueness(0.2, (i % 10) + 2);
    ink.setStops(0);
    ink.setDrawFunction(shapeFunctions[4]);
    lines.push(ink);
  }
  background(246, 244, 243);
}

let padding;

function draw() {
  // stroke(0);
  padding = height / 20;
  messageForK();
  let fMulti = 500;
  let weight = 1000;

  let i = 0;

  // Order
  let poly = null;
  for (let k = 0; k <= rows; k++) {
    for (let h = 0; h <= columns; h++) {
      if (((k*columns) + h) < numHearts) {
        let currentInkLine = lines[lineInterval % totalLines];
        if (offset[i] == undefined) {
          offset.push(map((k*columns) + h, 0, rows * columns, 10, 100));
        }
        currentInkLine.setWeight(weight);
        let x = ((width - 2 * padding) * (h + 1)) / (columns + 1) + padding/2;
        let y = ((height - 2 * padding) * (k + 1)) / (rows + 1) + padding;

        currentInkLine.setPointsFunction(x, y, x + offset[i], y, weight);
        lineInterval++;
        if (frameCount * fMulti > weight) {
          let v = [];
          let step = Math.round(currentInkLine.points.length / 20);
          for (let l = 0; l < currentInkLine.points.length; l += step) {
            angleMode(RADIANS);
            v.push(
              createVector(
                currentInkLine.points[l].x,
                currentInkLine.points[l].y
              )
            );
          }
          poly = new Poly(v);
          waterColour(
            poly,
            currentInkLine.colors[1],
            currentInkLine.colors[0],
            layers
          );
        }

        angleMode(DEGREES);
        currentInkLine.animateLine(
          x,
          y,
          x + offset[i],
          y,
          (frameCount - 1) * fMulti,
          frameCount * fMulti
        );
        i++;
      }
    }
  }

  lineInterval = 0;
  if (frameCount * fMulti > weight) {
    layers += 5;
    if (layers > 15) {
      noLoop();
    }
  }
}

function messageForK() {
  textFont(sourceSerif);
  textSize(20);
  noStroke();
  fill(palette[1]);
  let daysText = `${daysBetween} days of love and counting`;
  textAlign(CENTER, CENTER);
  text(daysText, width / 2, padding / 2);
  text("Happy everyday, k :D", width / 2, height - padding / 2);
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("lines.png");
  }
}

class Poly {
  constructor(vertices, modifiers) {
    this.vertices = vertices;
    if (!modifiers) {
      modifiers = [];
      for (let i = 0; i < vertices.length; i++) {
        modifiers.push(random(0.8, 2.2));
      }
    }
    this.modifiers = modifiers;
  }

  grow() {
    angleMode(RADIANS);
    const grownVerts = [];
    const grownMods = [];
    for (let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length;
      const v1 = this.vertices[i];
      const v2 = this.vertices[j];
      const mod = this.modifiers[i];

      const chmod = (m) => {
        return m + (rand() - 0.5) * 0.1;
      };

      grownVerts.push(v1);
      grownMods.push(chmod(mod));

      const segment = p5.Vector.sub(v2, v1);
      const len = segment.mag();
      segment.mult(rand());

      const v = p5.Vector.add(segment, v1);

      segment.rotate(-PI / 2 + ((rand() - 0.5) * PI) / 4);
      segment.setMag(((rand() * len) / 2) * mod);
      v.add(segment);
      grownVerts.push(v);
      grownMods.push(chmod(mod));
    }
    // console.log(grownVerts)
    return new Poly(grownVerts, grownMods);
  }

  dup() {
    return new Poly(Array.from(this.vertices), Array.from(this.modifiers));
  }

  draw(c1, c2) {
    // console.log(this.vertices.length)
    // stroke(0)
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}

function waterColour(poly, c1, c2, layer) {
  // need to think through how to animate this in piece parts
  const numLayers = 5;

  noStroke();
  fill(c2[0], c2[1], c2[2], 100 / (2 * (layer + numLayers)));
  // }
  poly = poly.grow().grow();

  for (let i = 0; i < numLayers; i++) {
    if (
      i == int((layer + numLayers) / 3) ||
      i == int((2 * (layer + numLayers)) / 3)
    ) {
      poly = poly.grow().grow();
    }
    poly.grow().draw(c1, c2);
    // console.log(poly)
  }
}

function rand() {
  return distribute(random(1));
}

function distribute(x) {
  return pow((x - 0.5) * 1.58740105, 3) + 0.5;
}
