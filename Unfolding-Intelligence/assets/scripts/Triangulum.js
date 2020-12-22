class Triangulum {
  constructor(xp, yp, s, mode) {
    this.xp = xp;
    this.yp = yp;
    this.s = s;
    this.mode = mode;
    
    this.p1 = createVector(-this.s/2 + this.xp, this.s/3 + this.yp);
    this.p2 = createVector(0 + this.xp, -this.s/2 + this.yp);
    this.p3 = createVector(this.s/2 + this.xp, this.s/3 + this.yp);
    
    this.res = 0;
    this.canMove = false;
    
    this.c1 = new Control(this.p1, this.s, 0);
    this.c2 = new Control(this.p2, this.s, PI/2);
    this.c3 = new Control(this.p3, this.s, PI);
  }
  
  draw() { 
    noStroke();
    this.c1.draw();
    this.c2.draw();
    this.c3.draw();
    
    stroke(255,100);
    fill(colors.bg);
    triangle(this.p1.x,this.p1.y,this.p2.x,this.p2.y,this.p3.x,this.p3.y);
    
    // scores
    noStroke();
    fill(255);
    text(`reward: ${w.agents[this.mode].apples} / ${maxScore}`, this.xp, this.yp + this.s);

    if(this.mode == 0) {
      if(dist(mouseX,mouseY,this.xp,this.yp) < this.s) {
        fill(218, 90, 51, 255);
        noStroke();
      } else {
        fill(218, 90, 51, 100);
        noStroke();
      }
    } else {
      if(dist(mouseX,mouseY,this.xp,this.yp) < this.s) {
        noFill();
        stroke(218, 90, 51, 255);
      } else {
        noFill();
        stroke(218, 90, 51, 100);
      }
    }
    
    push();
    translate(this.xp,this.yp+this.s/48);
    scale(0.5);
    translate(-this.xp,-this.yp);
    triangle(this.p1.x,this.p1.y,this.p2.x,this.p2.y,this.p3.x,this.p3.y);
    pop();
    
    noStroke();
    fill(255,50);
    
    textAlign(CENTER);
    textFont(font);
    textSize(this.s/6);
    text("experience", this.p1.x,this.p1.y + this.s/3); // pre-trained agent states
    text("reflex", this.p3.x,this.p3.y + this.s/3); // speed & exploration value
    text("perception", this.p2.x,this.p2.y - this.s/3); // area of sensing
  }
  
  press() {
    if(dist(mouseX,mouseY,this.p1.x,this.p1.y) < this.s/3) { this.c1.canMove = true; }
    if(dist(mouseX,mouseY,this.p2.x,this.p2.y) < this.s/3) { this.c2.canMove = true; }
    if(dist(mouseX,mouseY,this.p3.x,this.p3.y) < this.s/3) { this.c3.canMove = true; }
  }
  
  release() {
    this.c1.canMove = false;
    this.c2.canMove = false;
    this.c3.canMove = false;
  }
}

class Control {
  constructor(p,s,rot) {
    this.x = p.x;
    this.y = p.y;
    this.s = s;
    this.rot = rot;
    
    this.amount = 0;
    this.val = 0;
    this.res = 0;
    this.canMove = false;
  }
  draw() {
    if(down && this.canMove) {
      this.amount = dist(pmouseX,pmouseY,mouseX,mouseY);
      if(pmouseX<mouseX) { if(this.val<100) this.val += this.amount; }
      if(pmouseX>mouseX) { if(this.val>0) this.val -= this.amount; }
      if(pmouseY<mouseY) { if(this.val>0) this.val -= this.amount; }
      if(pmouseY>mouseY) { if(this.val<100) this.val += this.amount; }
      this.res = constrain(this.val,0,100);
    }
    
    if(dist(mouseX,mouseY,this.x,this.y) < this.s/3/2) {
      stroke(255,100);
      fill(255,50);
    } else {
      noFill();
      stroke(255,100);
    }
    
    ellipse(this.x,this.y,this.s/3, this.s/3);
    
    noStroke();
    if(dist(mouseX,mouseY,this.x,this.y) < this.s/3/2) {
      fill(218, 90, 51);  
    } else {
      fill(255,150);
    }
    
    push();
    translate(this.x,this.y);
    rotate(this.rot)
    translate(-this.x,-this.y)
    arc(this.x, this.y, this.s/4,this.s/4, 0, map(this.res,0,100,0,TWO_PI), PIE);
    pop();
  }
  
  getValue() {
    return this.res;
  }

  setControls() {
    // update control UI based on agent props here
  }

  getControls() {
    // update & map agent properties here
  }
}