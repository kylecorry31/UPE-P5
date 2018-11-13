// var backgroundAnimation = new NightSky();
// var backgroundAnimation = new Plot();
// var backgroundAnimation = new Terrain();
var backgroundAnimation = new Ocean();
// var backgroundAnimation = new Fireflies();
// var backgroundAnimation = new Tree();

function setup(){
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-background");
  backgroundAnimation.setup();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw(){
  backgroundAnimation.draw();
}

function mouseClicked(){
  if(backgroundAnimation.mouseClicked){
    backgroundAnimation.mouseClicked();
  }
}

// ================= Terrain =================
function Terrain(){
  var n;
  var timeOfDay = 0;
  var setting = false;

  this.setup = function(){
    n = random(1000);
  };

  this.draw = function(){
    var r = 135;
    var g = 206;
    var b = 250;

    background(r * pow(timeOfDay, 0.5), g * pow(timeOfDay, 0.5), b * pow(timeOfDay, 0.5)); // midday

    noStroke();
    fill('#FDB813');
    var x = setting ? map(timeOfDay, 0, 1, width, width / 2) : map(timeOfDay, 0, 1, 0, width / 2);
    ellipse(x, map(pow(timeOfDay, 0.5), 0, 1, height * 0.75, 0), 100, 100);


    stroke('green');
    strokeWeight(10);
    fill('#8D6645');
    var lastN = n;
    beginShape();
    for (var x = 0; x <= width; x += 10) {
      var y = map(noise(n), 0, 1, height / 3, height / 2);
      vertex(x, y);
      n += 0.05;
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);

    n = lastN + 0.01;
    if (setting){
      timeOfDay -= 0.001;
    } else {
      timeOfDay += 0.001;
    }
    if (timeOfDay > 1){
      setting = true;
    } else if (timeOfDay < 0){
      setting = false;
    }
  };
}

// ================= Tree =================
function Tree(){
  var n, wind;
  var maxLen = 200;
  var minLen = 8;
  var angle;

  function branch(len){
    strokeWeight(len / maxLen * 10);
    line(0, 0, 0, -len);
    translate(0, -len);
    if (len > minLen){
      push();
      rotate(angle);
      branch(len * 0.67);
      pop();
      push();
      rotate(-angle);
      branch(len * 0.67);
      pop();
    }
  }

  this.setup = function(){
    n = random(1000);
    wind = random(1000);
  };

  this.draw = function(){
    background(0);
    stroke(255);
    translate(width / 2, height);
    rotate(map(noise(wind), 0, 1, -PI / 30, PI / 30));
    angle = map(noise(n), 0, 1, PI / 20, PI / 3);
    branch(maxLen);
    n += 0.001;
    wind += 0.0001;
  };
}

// ================= Fireflies =================
function Fireflies(){

  var resolution = 10;
  var cx, cy;
  // var nX, nY;

  var points = [];

  function Point(x, y){
    this.x = x;
    this.y = y;
    this.strength = 0;
    var nX = random(1000);
    var nY = random(1000);
    var nS = random(1000);

    this.update = function(){
      this.x = map(noise(nX), 0, 1, 0, width);
      this.y = map(noise(nY), 0, 1, 0, height);
      this.strength = noise(nS);

      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);

      nS += 0.001;
      nX += 0.01;
      nY += 0.01;
    };

  }

  this.setup = function(){
    cx = width / 2;
    cy = height / 2;
    points = [];
    for (var i = 0; i < 20; i++) {
      points.push(new Point(random(width), random(height)));
    }
  };

  this.draw = function(){
    background(0);
    noStroke();
    // cx = map(noise(nX), 0, 1, 0, width);
    // cy = map(noise(nY), 0, 1, 0, height);

    cx = mouseX;
    cy = mouseY;

    for (var x = 0; x < width; x+=resolution){
      for (var y = 0; y < height; y+=resolution){
        var s = 0;
        points.forEach(function(p){
          s += p.strength * 100 * 10 / dist(x, y, p.x, p.y);
        });
        var c = 0;
        // var c = 1000 * 40 / dist(x, y, cx, cy);
        s += c;
        fill(s, s, c);
        rect(x, y, resolution, resolution);
      }
    }

    points.forEach(function(p){
      p.update();
    });


  };
}



// ================= PLOT =================
function Plot(){
  var dots = [];
  var n = 0;

  function Dot(x){
    this.x = x / width;
    this.y = 0;
    this.radius = 5;
    var stack;

    this.update = function(input){
      this.y = (1 - input) * height;
    };

    this.draw = function(){
      noStroke();
      fill('rgba(255, 255, 255, 0.6)');
      ellipse(this.x * width, this.y, this.radius, this.radius);
    };
  }

  this.setup = function(){
    var totalDots = 100;
    stack = [];
    var spacing = width / totalDots;
    for (var i = 0; i < 200; i++) {
      dots.push(new Dot(width / totalDots * i + width / totalDots / 2));
      stack.push(0);
    }
  };

  this.draw = function(){
    background('black');
    stack.push(noise(n));
    stack.shift();
    for (var i = 0; i < dots.length; i++) {
      dots[i].update(stack[i]);
      dots[i].draw();
    }
    n += 0.01;
  };
}



// ================= NIGHT SKY =================
function NightSky(){
  var stars = [];

  function Star(){
    this.x = random();
    this.y = random();
    var minOpacity = 0.4;
    this.opacity = random(minOpacity, 1);
    this.radius = random(3);
    this.twinkleNoise = random(1000);


    this.update = function(){
      this.opacity += map(noise(this.twinkleNoise), 0, 1, -0.3, 0.3);
      this.opacity = constrain(this.opacity, minOpacity, 1);

      this.twinkleNoise += 0.05;
    };

    this.draw = function(){
      noStroke();
      fill('rgba(255, 255, 255, ' + this.opacity + ')');
      ellipse(this.x * width, this.y * height, this.radius, this.radius);
    };
  }

  this.setup = function(){
    for (var i = 0; i < 1000; i++) {
      stars.push(new Star());
    }
  };

  this.draw = function(){
    background('black');
    stars.forEach(function(s){
      s.update();
      s.draw();
    });

  };
}


// ================= OCEAN =================
function Ocean(){
  var bubbles = [];

  function Bubble(){
    this.x = random();
    this.y = random() * 2;
    this.radius = random(10);
    this.noiseX = random(1000);


    this.update = function(){
      this.x += map(noise(this.noiseX), 0, 1, -0.001, 0.001);
      this.x = constrain(this.x, 0, 1);

      this.y -= 0.005;
      if(this.y < 0){
        this.y = 1 + random();
        this.x = random();
      }

      this.noiseX += 0.001;
    };

    this.draw = function(){
      noStroke();
      fill('rgba(255, 255, 255, 0.3)');
      ellipse(this.x * width, this.y * height, this.radius + 4 * (1 - this.y / height), this.radius + 4 * (1 - this.y / height));
    };
  }

  this.setup = function(){
    for (var i = 0; i < 200; i++) {
      bubbles.push(new Bubble());
    }
  };

  this.draw = function(){
    background('#00a4a9');
    bubbles.forEach(function(b){
      b.update();
      b.draw();
    });

    if (mouseIsPressed){
      var bubble = new Bubble();
      bubble.x = mouseX / width;
      bubble.y = mouseY / height;
      bubbles.push(bubble);
    }

  };
}
