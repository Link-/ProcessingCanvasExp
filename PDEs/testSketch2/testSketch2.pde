/**
 * Particle class
 * encapsulates the particle 
 * object
 */
class Particle
{
	PVector Position;															// Position vector
  	PVector Velocity 		  = new PVector(0,0);									// Velocity vector
  	PVector Acceleration 	= new PVector(0,0);									// Acceleration vector
  	int ParticleLife;															// in Frames

  	boolean jitteryParticle;													// Specifies if the particle jitters or not

  	// Public Constructor
  	Particle(int splice, int life, boolean jitter)
  	{
  		ParticleLife 		  = life;
  		jitteryParticle 	= jitter;
  		Position 			    = new PVector(random(width), random(height), splice);
  	}


  	// Rendering method
  	void render(float speed, int colr, boolean bGlow)
  	{
  		if (isDead())
  			return;

  		float x = noise(Position.x, Position.y, Position.z) * width;
    	float y = noise(Position.x, Position.y, 1000 - Position.z) * height;

    	PVector tmp = new PVector(x, y);
    	PVector Acceleration = PVector.sub(tmp, Position);

    	Acceleration.normalize();
    	// Acceleration.mult(.2);
    	Velocity.add(Acceleration); 
    	Velocity.limit(speed);
    	Position.add(Velocity);

    	// If glowing is true, draw the glowing ellipse
    	if(bGlow) 
    	{
      		noStroke();
      		fill(colr, 255, 255, 5);
      		ellipse(Position.x + 100, Position.y, 10, 10);
	    }

	    stroke(colr, 255, 255);   
    	point(Position.x + 100, Position.y);

  		// Diminish the particle's life
		ParticleLife--;
  	}

  	// Dead checker
  	boolean isDead()
  	{
		if (ParticleLife < 0)
			return true;

		return false;
  	}
}

/**
 * Particles System Class
 * This object is responsible for all
 * it's particles, motion, and life
 */
int maxCnt;
int halfH, halfW;
float slice;
Particle p[];

void setup() 
{
    size(800, 800);

    background(0);
    smooth();
    colorMode(HSB);

    //setup particles
    maxCnt = 1000;
    slice = random(1000);
    p = new Particle[maxCnt];

    for (int i=0; i<maxCnt; i++)
        p[i] = new Particle(int(slice), int(random(0, 1000)), false);
}
 
void draw() 
{
    background(0);
   
    //check particles
    for (int i=0; i<maxCnt; i++)
    {
        p[i].render(20, int(1.25*255), true);
    }
}