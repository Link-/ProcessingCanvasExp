int maxCnt;
int halfH, halfW;
float slice;
particle p[];
 
class particle {
  PVector pos = new PVector(random(width), random(height));
  PVector vel = new PVector(0,0);
   
  void check(float clump, float spd, int clr, boolean bGlow) 
  {
    float x = noise(pos.x/clump, pos.y/clump, slice)*width;
    float y = noise(pos.x/clump, pos.y/clump, 100-slice)*height;
    PVector tmp = new PVector(x, y);
    PVector acc = PVector.sub(tmp, pos);
    acc.normalize();
    acc.mult(.2);
    vel.add(acc); vel.limit(spd);
    pos.add(vel);
    int offset = 100;

    if(bGlow) {
      noStroke();
      fill(clr,255,255,5);
      ellipse(pos.x+offset, pos.y, 10,10);
    }

    stroke(clr,255,255);   
    point(pos.x+offset, pos.y);
    slice+=5.5;
  }
}

void setup() {
    size(800, 800);

    background(0);
    smooth();
    colorMode(HSB);

    //setup particles
    maxCnt = 1000;
    slice = random(1000);
    p = new particle[maxCnt];

    for (int i=0; i<maxCnt; i++)
        p[i] = new particle();
}
 
void draw() {
    background(0);
   
    //check particles
    for (int i=0; i<maxCnt; i++)
    {
        p[i].check(pow(800,7.69), 0.9*10.0, int(1.25*255), true);
    }
}