<template>
  <div class="home-page">
    <h1>Hello!</h1>
    <canvas id="canvas"></canvas>
  </div>
</template>
<script>
export default {
  name: "Home",
  mounted() {
    let canvas = document.querySelector("#canvas"),
      ctx = canvas.getContext("2d");
    window.onresize=()=>{
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    let config = {
      particleNumber: 800,
      maxParticleSize: 10,
      maxSpeed: 40,
      colorVariation: 50,
    };

    // Colors
    let colorPalette = {
      bg: { r: 12, g: 9, b: 29 },
      matter: [
        { r: 36, g: 18, b: 42 }, // darkPRPL
        { r: 78, g: 36, b: 42 }, // rockDust
        { r: 252, g: 178, b: 96 }, // solorFlare
        { r: 253, g: 238, b: 152 }, // totesASun
      ],
    };

    // Some Variables hanging out
    let particles = [],
      // Draws the background for the canvas, because space
      drawBg = function (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };

    // Particle Constructor
    let Particle = function (x, y) {
      // X Coordinate
      this.x = x || Math.round(Math.random() * canvas.width);
      // Y Coordinate
      this.y = y || Math.round(Math.random() * canvas.height);
      // Radius of the space dust
      this.r = Math.ceil(Math.random() * config.maxParticleSize);
      // Color of the rock, given some randomness
      this.c = colorVariation(
        colorPalette.matter[
          Math.floor(Math.random() * colorPalette.matter.length)
        ],
        true
      );
      // Speed of which the rock travels
      this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), 0.7);
      // Direction the Rock flies
      this.d = Math.round(Math.random() * 360);
    };

    // Provides some nice color variation
    // Accepts an rgba object
    // returns a modified rgba object or a rgba string if true is passed in for argument 2
    let colorVariation = function (color, returnString) {
      let r, g, b, a, variation;
      r = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.r
      );
      g = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.g
      );
      b = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.b
      );
      a = Math.random() + 0.5;
      if (returnString) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      } else {
        return { r, g, b, a };
      }
    };

    // Used to find the rocks next point in space, accounting for speed and direction
    let updateParticleModel = function (p) {
      let a = 180 - (p.d + 90); // find the 3rd angle
      p.d > 0 && p.d < 180
        ? (p.x += (p.s * Math.sin(p.d)) / Math.sin(p.s))
        : (p.x -= (p.s * Math.sin(p.d)) / Math.sin(p.s));
      p.d > 90 && p.d < 270
        ? (p.y += (p.s * Math.sin(a)) / Math.sin(p.s))
        : (p.y -= (p.s * Math.sin(a)) / Math.sin(p.s));
      return p;
    };

    // Just the function that physically draws the particles
    // Physically? sure why not, physically.
    let drawParticle = function (x, y, r, c) {
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();
    };

    // Remove particles that aren't on the canvas
    let cleanUpArray = function () {
      particles = particles.filter((p) => {
        return p.x > -100 && p.y > -100;
      });
    };

    let initParticles = function (numParticles, x, y) {
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(x, y));
      }
      particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
      });
    };

    // That thing
    window.requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    // Our Frame function
    let frame = function () {
      // Draw background first
      drawBg(ctx, colorPalette.bg);
      // Update Particle models to new position
      particles.map((p) => {
        return updateParticleModel(p);
      });
      // Draw em'
      particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
      });
      // Play the same song? Ok!
      window.requestAnimFrame(frame);
    };

    // Click listener
    document.body.addEventListener("click", function (event) {
      let x = event.clientX,
        y = event.clientY;
      cleanUpArray();
      initParticles(config.particleNumber, x, y);
    });

    // First Frame
    frame();

    // First particle explosion
    initParticles(config.particleNumber);
  },
};
</script>
<style lang="scss" scoped>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  cursor: pointer;
}
.home-page{
  position: relative;
  h1{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
</style>