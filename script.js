class RainChar {
  constructor(font, charSize, chars, fg, bgImageSrc) {
    this.font = font;
    this.charSize = charSize; 
    this.chars = chars;
    this.fg = fg;
    this.bgImage = new Image();
    this.interval = 50; // 50 ms for frame rate

    const canvas = document.getElementById("rain-effect");
    this.context = canvas.getContext("2d");
    this.size = [canvas.offsetWidth, canvas.offsetHeight];
    canvas.width = this.size[0];
    canvas.height = this.size[1];

    this.bgImage.src = bgImageSrc;
    this.bgImage.onload = () => {
      this.drawBackground();
      this.setupParticles();
      this.play();
    };

    this.occupiedPositions = [];
  }

  drawBackground() {
    this.context.drawImage(this.bgImage, 0, 0, this.size[0], this.size[1]);
  }

  setupParticles() {
    this.particles = [];
    const particleCount = Math.floor((this.size[0] * this.size[1]) / (this.charSize ** 2 * 10));

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.newParticle());
    }
  }

  newParticle() {
    return {
      x: Math.floor(Math.random() * this.size[0]),
      y: -Math.random() * this.size[1],
      size: this.charSize,
    };
  }

  drawParticles() {
    this.context.fillStyle = this.fg;
    this.occupiedPositions = [];

    this.particles.forEach((particle) => {
      if (particle.y < this.size[1]) {
        this.context.font = `${particle.size}px ${this.font}`;
        const randomChar = this.chars[Math.floor(Math.random() * this.chars.length)];

        const xPosition = Math.floor(particle.x);
        while (this.occupiedPositions.includes(xPosition)) {
          particle.x = Math.floor(Math.random() * this.size[0]);
        }

        this.context.fillText(randomChar, particle.x, particle.y);
        this.occupiedPositions.push(xPosition);
      } else {
        particle.y = -Math.random() * this.size[1] * 2;
        particle.x = Math.floor(Math.random() * (this.size[0] - particle.size));
      }
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.y += particle.size * 0.5; // Falling speed
    });
  }

  play() {
    this.drawBackground();
    this.updateParticles();
    this.drawParticles();
    setTimeout(() => this.play(), this.interval); 
  }
}

// Usage Example
const chars = "0123456789"; // Characters to be used
const rain = new RainChar(
  "monospace",
  3, // Character size set to 3 pixels
  chars,
  "white", // Foreground color
  "https://i.ibb.co/2kZ5hXx/Bot-Labs.png" // Background image URL
);
