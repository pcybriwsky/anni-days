const hearts = [];
const heartQualities = [];
const palettes = [
  ["#373F51", "#bc4749", "#A2E3C4", "#F0F7F4", "#ff6666"],
  ["#E4DBC9", "#963D5A", "#4C191B", "#c589e8", "#519872"],
  // ["#FEFFEA", "#46acc2", "#498c8a", "#4D5382", "#C97064"],
];
let palette = null;
let a = 0;
let numHearts = 100;
let padding = 50;
let rows = 1;
let columns = 5;
let madeWithLoveHeart;
let logoHeart = [];
let startDate = 1666368000
let paperTexture;
let daysBetween;
let sourceSerif;


var numDaysBetween = function (d1) {
  var d2 = new Date()
  var diff = Math.abs(d1 - (d2.getTime() / 1000));
  return diff / (60 * 60 * 24);
}

function createPaper() {
  paperTexture.clear()
  paperTexture.noFill();
  paperTexture.stroke(palette[2])
  for(let p = 0; p < 70000; p++){
    paperTexture.strokeWeight(random(0.01, 0.015))
    let radius = random(1, 100);
    paperTexture.ellipse(random(width), random(height), radius, radius)
  }
  
  paperTexture.stroke(palette[1])
  for(let p = 0; p < 70000; p++){
    paperTexture.strokeWeight(random(0.01, 0.015))
    let radius = random(1, 100);
    paperTexture.ellipse(random(width), random(height), radius, radius)
  }
}

function setup() {
  sourceSerif = loadFont("./SourceSerif4-BoldItalic.ttf")
  textFont(sourceSerif)
  if(windowHeight > 1800){
    createCanvas(windowWidth, windowHeight);  
  }
  else{
    createCanvas(windowWidth, 1800);
  }
  
  pixelDensity(3);
  palette = palettes[Math.floor(random(0, palettes.length))];

  daysBetween = Math.floor(numDaysBetween(startDate));
  console.log(daysBetween)
  rows = Math.round(random(5, 20));
  
  numHearts = daysBetween;
  columns = Math.ceil(width/200);
  rows = Math.ceil(numHearts/columns);
  shuffle(palette, true);

  for (let x = 0; x < numHearts; x++) {
    hearts.push([]);
    let radiusMulti =
      random((rows - 1) * (columns - 1), rows * columns) + width / 2 + 7*numHearts - 7*x;
    let xMulti = random(10, 12);
    let heartColor = Math.round(random(palette.length - 2) + 1);
    let outlineColor = Math.round(random(palette.length - 2) + 1);
    let showFill = Math.round(random(0, 1));
    let rotation = random(-0.25, 0.25);
    let multi1 = Math.round(random(1, 3));
    let multi2 = Math.round(random(1, 3));
    let multi3 = Math.round(random(3, 5));
    let strokeThickness = random(0.1, 3);
    madeWithLoveHeart = Math.floor(random(numHearts));
    heartQualities.push({
      radiusMulti: radiusMulti,
      xMulti: xMulti,
      heartColor: heartColor,
      outlineColor: outlineColor,
      showFill: showFill,
      rotation: rotation,
      multi1: multi1,
      multi2: multi2,
      multi3: multi3,
      strokeThickness: strokeThickness,
    });
  }
  padding = height / 20;
  radiusMulti = random(1000, 1050);
  
  paperTexture = createGraphics(width, height);
  createPaper();
}

function draw() {
  // createPaper();
  background(palette[0]);

  stroke(255);
  strokeWeight(2);
  noStroke();
  let currentHeart = 0;
  for (let k = 0; k < rows; k++) {
    for (let h = 0; h < columns; h++) {
      if(currentHeart < numHearts){
        let heart = hearts[h + columns * k];
        let qualities = heartQualities[h + columns * k];
        push();
        translate(
          ((width - 2 * padding) * (h + 1)) / (columns + 1) + padding,
          ((height - 2 * padding) * (k + 1)) / (rows + 1) + padding
        );
        rotate(qualities.rotation);

        if (qualities.showFill) {
          noStroke();
          fill(palette[qualities.heartColor]);
          beginShape();
          for (let v of heart) {
            // point(v.x, v.y + 0);
            vertex(v.x, v.y);
          }
          endShape();
        }

        stroke(palette[qualities.outlineColor]);

        strokeWeight(qualities.strokeThickness);
        noFill();
        beginShape();
        for (let v of heart) {
          // point(v.x, v.y + 0);
          point(v.x + 0.5 * noise(v.x, v.y), v.y + 0.5 * noise(v.x, v.y));
        }
        endShape();

        const r = height / qualities.radiusMulti;
        const x = r * 10 * pow(sin(a), 3);
        const y =
          -r *
            (qualities.xMulti * cos(a) -
              qualities.multi1 * cos(2 * a) -
              qualities.multi2 * cos(3 * a) -
              qualities.multi3 * cos(2 * a)) +
          random(0); // first coefficient changes bottom, second changes top
        heart.push(createVector(x, y));
        pop();
        currentHeart++
      }
    }
  }

  let logoQualities = heartQualities[madeWithLoveHeart];
  push();
  translate(width / 2, height - 2*padding);
  rotate(logoQualities.rotation);

  noStroke();
  fill(palette[logoQualities.heartColor]);
  beginShape();
  for (let v of logoHeart) {
    // point(v.x, v.y + 0);
    vertex(v.x, v.y);
  }
  endShape();

  stroke(palette[logoQualities.outlineColor]);

  strokeWeight(logoQualities.strokeThickness);
  noFill();
  beginShape();
  for (let v of logoHeart) {
    // point(v.x, v.y + 0);
    point(v.x + 0.5 * noise(v.x, v.y), v.y + 0.5 * noise(v.x, v.y));
  }
  endShape();

  const r = height / (logoQualities.radiusMulti) / 2;
  const x = r * 10 * pow(sin(a), 3);
  const y =
    -r *
      (logoQualities.xMulti * cos(a) -
        logoQualities.multi1 * cos(2 * a) -
        logoQualities.multi2 * cos(3 * a) -
        logoQualities.multi3 * cos(2 * a)) +
    random(0); // first coefficient changes bottom, second changes top
  logoHeart.push(createVector(x, y));
  pop();

  

  if (a > TWO_PI) {
    
    noLoop();
  }
  
  if(paperTexture != null){
    image(paperTexture, 0, 0)
  }

  a += 0.08;
  messageForK()
}

function messageForK(){
  textFont(sourceSerif);
  textSize(20)
  noStroke();
  fill(palette[1])
  let daysText = `Oh how love grows over ${daysBetween} days`
  textAlign(CENTER, CENTER)
  text(daysText, width/2, padding/2)
  text("Happy everyday, k :D", width/2, height - padding/2)
}



function keyPressed() {
  if (key === "s") {
    saveCanvas("hearts.png");
  }
}
