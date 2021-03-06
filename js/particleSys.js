/***
 * Particle System Study 1
 * Perlin Noise Experiment
 *
 * @author: BassemDy
 * @website: http://bassemdy.com
 * @version: 0.0.15
 **/

/**
 * Particle class
 * encapsulates the particle 
 * object
 */
class Particle
{
  PVector Position;                           			// Position vector
	PVector Velocity 		  = new PVector(0,0);					// Velocity vector
	PVector Acceleration 	= new PVector(0,0);					// Acceleration vector
	int ParticleLife;															    // in Frames
  boolean Decay;                                    // Choose if particles die or not

	boolean jitteryParticle;													// Specifies if the particle jitters or not

	// Public Constructor
	Particle(int splice, int life, boolean jitter, boolean decay)
	{
		ParticleLife 		  = life;
		jitteryParticle 	= jitter;
		Position 			    = new PVector(random(width), random(height), splice);
    Decay             = decay;
	}

	// Rendering method
	void render(float speed, int colr, boolean bGlow)
	{
    // Get the new positions
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
  	if (bGlow) 
  	{
    		noStroke();
    		fill(colr, 255, 255, 15);
    		ellipse(Position.x, Position.y, 14, 14);
    }

    // Draw the particle
    stroke(colr, 255, 255);   
  	ellipse(Position.x, Position.y, 1, 1);

		// Diminish the particle's life
    // if the system can decay
    if (Decay)
      ParticleLife--;
	}

  // Rendering method overloaded to allow directional movement
  void render(PVector fDirection, float speed, int colr, boolean bGlow)
  {
    // Get the new positions
    float x = noise(Position.x, Position.y, Position.z) * fDirection.x * 2;           // To have an accurate position we multiply by 2
    float y = noise(Position.x, Position.y, 1000 - Position.z) * fDirection.y * 2;    // To have an accurate position we multiply by 2

    PVector tmp = new PVector(x, y);
    PVector Acceleration = PVector.sub(tmp, Position);

    Acceleration.normalize();
    Velocity.add(Acceleration);
    Velocity.limit(speed);
    Position.add(Velocity);

    // If glowing is true, draw the glowing ellipse
    if (bGlow) 
    {
        noStroke();
        fill(colr, 255, 255, 15);
        ellipse(Position.x, Position.y, 14, 14);
    }

    // Draw the particle
    stroke(colr, 255, 255);   
    ellipse(Position.x, Position.y, 1, 1);

    // Diminish the particle's life
    // if the system can decay
    if (Decay)
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
class ParticleSystem
{
  int ParticleCount;
  int LifeMax;
  int ColorRatio;
  int Speed;
  int Splice;
  ArrayList Particles;

  // Public constructor
  ParticleSystem(int pCount, int lifeMax, int splice, int speed, int colr)
  {
    ParticleCount = pCount;
    LifeMax = lifeMax;
    Splice = splice;
    Speed = speed;
    ColorRatio = colr;

    Particles = new ArrayList(ParticleCount);
  }


  // Generate the system
  void GenerateSystem()
  {
    // Remove all elements
    if (Particles != null)
      Particles.clear();

    // Add the particles again
    for (int i = 0; i < ParticleCount; i++)
    {
        Particles.add(new Particle(Splice, int(random(10, LifeMax)), true, false));
    }
  }


  // Render the system
  void RenderSystem()
  {
    // Add the particles again
    for (int i = 0; i < Particles.size(); i++)
    {
      Particle cP = (Particle)Particles.get(i);

      if (cP.isDead())
        Particles.remove(i);

      // Render the particles
      cP.render(Speed, ColorRatio, true);
    }
  }

  // Render the system
  void RenderSystem(PVector fDirection)
  {
    // Add the particles again
    for (int i = 0; i < Particles.size(); i++)
    {
      Particle cP = (Particle)Particles.get(i);

      if (cP.isDead())
        Particles.remove(i);

      // Render the particles
      cP.render(fDirection, Speed, ColorRatio, true);
    }
  }

  // Force the addition a particle to the system
  void AddParticle()
  {
    Particles.add(new Particle(Splice, int(random(10, LifeMax)), true, false));
  }

  // Force the removal of a particle
  void RemoveParticle()
  {
    // Check if empty
    if (!Particles.isEmpty())
    {
      // Always remove the last one
      Particles.remove(Particles.size() - 1);
    }
  }

  // Returns the number of particles in the
  // system
  int GetCount()
  {
     return Particles.size();
  }

  // Increase speed by 1
  void IncreaseSpeed()
  {
     Speed++;
  }

  // Decrease speed by 1
  void DecreaseSpeed()
  {
    if (Speed > 0)
      Speed--;
  }

  // New color set
  void NewColorRatio(int colr)
  {
      ColorRatio = colr;
  }
}


/**
 * Public Declarations
 */
ParticleSystem pSys;
PVector fDirection;
boolean ConsoleDisplay = true;

/**
 * Core
 */
void setup() 
{
  size($(document).width() - 5, $(document).height() - 5);

  background(0);
  smooth();
  colorMode(HSB);

  // Init particle system
  pSys = new ParticleSystem(1000, 1000, 400, 15, int(0.68 * 255));
  pSys.GenerateSystem();
}
 
void draw() 
{
  background(0);
  
  if (fDirection != null)
  {
    // println("Rendering with Direction: " + fDirection);
    pSys.RenderSystem(fDirection);
  }
  else
  {
    pSys.RenderSystem();
  }

  // Debugging console
  if (ConsoleDisplay)
  { 
      // Regular jquery nothing fancy
      $("#frameRate").html("FrameRate: " + frameRate);
      $("#pCount").html("Particles Count: " + pSys.GetCount());
      $("#speedVal").html("Particles Speed: " + pSys.Speed);
  }
}

// Mouse press event handling
void mousePressed()
{
  fDirection = new PVector(mouseX, mouseY);
}

// Keyboard control
void keyPressed()
{
  // When pressing up, add particles
  if (keyCode == UP)
  {
      pSys.AddParticle();

      // Debugging
      console.log("New Count: " + pSys.GetCount());
  }
  if (keyCode == DOWN)
  {
      pSys.RemoveParticle();

      // Debugging
      console.log("New Count: " + pSys.GetCount());
  }
  if (key == 's')
  {
      pSys.IncreaseSpeed();
  }
  if (key == 'd')
  {
      pSys.DecreaseSpeed();
  }
  if (key == 'c')
  {
      pSys.NewColorRatio(int(random() * 255));
  }
  if (key == '`')
  {
      if (ConsoleDisplay)
          $("#console").hide(100);
      else
          $("#console").show(100);

      // Toggle the boolean
      ConsoleDisplay = !ConsoleDisplay;
  }
}