Bulb = new (function() {
  var spare = new Physics.Vector2();

  this.Quad = function(options) {
    this.body = new Physics.Body('quad', options);
    this.colour = options.colour || 0x0066ff;
    this.debug = options.debug;
    this.fuel = options.fuel;

    this.render = function(ctx) {
      ctx.fillStyle = this.colour;
      ctx.translate(this.body.pos.x, this.body.pos.y);
      ctx.rotate(this.body.rot.x);
      ctx.fillRect(-this.body.width / 2, -this.body.height / 2,
                   this.body.width, this.body.height);
      ctx.rotate(-this.body.rot.x);
      ctx.translate(-this.body.pos.x, -this.body.pos.y);

      if (this.debug) {
        var force = resolve(this.body.forces, this.body.invmass,
                                  this.body.rot).operate(function(self, u) {
          self.x = arotateX(self, u) * 0.1;
          self.y = arotateX(self, u) * 0.1;
        }, this.body.rot);
        if (force.x != 0 || force.y != 0) {
          ctx.beginPath();
          ctx.strokeStyle = '#00ffff';
          spare.operate(function(self, u, v) {
            self.x = rotateX(u, v);
            self.y = rotateY(u, v);
          }, this.body.forces[Object.keys(this.body.forces)[0]].pos, this.body.rot);
          //var pos = this.body.forces[Object.keys(this.body.forces)[0]].pos.copy().rotate(this.body.rot.copy());
          ctx.moveTo(this.body.pos.x - spare.x, this.body.pos.y + spare.y);
          ctx.lineTo(this.body.pos.x - spare.x - force.x, this.body.pos.y + spare.y + force.y);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();

      // Top right corner
      ctx.moveTo(window.innerWidth - 10.5, window.innerHeight - 30.5);
      ctx.lineTo(window.innerWidth - 10.5, window.innerHeight - 25.5);
      ctx.moveTo(window.innerWidth - 10.5, window.innerHeight - 30.5);
      ctx.lineTo(window.innerWidth - 15.5, window.innerHeight - 30.5);
      // Bottom right corner
      ctx.moveTo(window.innerWidth - 10.5, window.innerHeight - 10.5);
      ctx.lineTo(window.innerWidth - 10.5, window.innerHeight - 15.5);
      ctx.moveTo(window.innerWidth - 10.5, window.innerHeight - 10.5);
      ctx.lineTo(window.innerWidth - 15.5, window.innerHeight - 10.5);
      // Top left corner
      ctx.moveTo(window.innerWidth - 74.5, window.innerHeight - 30.5);
      ctx.lineTo(window.innerWidth - 74.5, window.innerHeight - 25.5);
      ctx.moveTo(window.innerWidth - 74.5, window.innerHeight - 30.5);
      ctx.lineTo(window.innerWidth - 69.5, window.innerHeight - 30.5);
      // Bottom left corner
      ctx.moveTo(window.innerWidth - 74.5, window.innerHeight - 10.5);
      ctx.lineTo(window.innerWidth - 74.5, window.innerHeight - 15.5);
      ctx.moveTo(window.innerWidth - 74.5, window.innerHeight - 10.5);
      ctx.lineTo(window.innerWidth - 69.5, window.innerHeight - 10.5);

      // Digits
      var vel = Math.round(Math.sqrt(
                    this.body.vel.x * this.body.vel.x +
                    this.body.vel.y * this.body.vel.y) * 100) / 1000;

      drawDigit(68.5, 25.5, ((0 | vel / 100) % 10).toString(), ctx);

      drawDigit(58.5, 25.5, ((0 | vel / 10) % 10).toString(), ctx);

      drawDigit(48.5, 25.5, ((0 | vel) % 10).toString(), ctx);

      drawDigit(38.5, 17.5, '.', ctx);

      drawDigit(34.5, 25.5, ((0 | vel * 10) % 10).toString(), ctx);

      drawDigit(24.5, 25.5, ((0 | vel * 100) % 10).toString(), ctx);

      ctx.stroke();
    };

    this.step = function(dt) {
      this.body.mass += this.fuel;
      this.body.step(dt);
      this.body.mass -= this.fuel;
      if (this.update)
        this.update(dt);
    }
  }

  this.World = function(ctx) {
    this.children = [];

    this.add = function(child) {
      this.children.push(child);
    };

    this.render = function() {
      this.children.forEach(function(child) {
        child.render(ctx);
      });
    };

    this.step = function(dt) {
      this.children.forEach(function(child) {
        child.step(dt);
      });
    };
  }
})();

function drawDigit(x, y, digit, ctx) {
  switch (digit) {
    case '1':
      ctx.moveTo(window.innerWidth - x + 5, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      break;
    case '2':
      ctx.moveTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 10);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      break;
    case '3':
      ctx.moveTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 2, window.innerHeight - y + 5);
      ctx.moveTo(window.innerWidth - x + 7, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 10);
      break;
    case '4':
      ctx.moveTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 6);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 6);
      ctx.moveTo(window.innerWidth - x + 4, window.innerHeight - y + 3);
      ctx.lineTo(window.innerWidth - x + 4, window.innerHeight - y + 10);
      break;
    case '5':
      ctx.moveTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 10);
      break;
    case '6':
      ctx.moveTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 10);
      ctx.moveTo(window.innerWidth - x, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 10);
      break;
    case '7':
      ctx.moveTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      break;
    case '8':
      ctx.moveTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 10);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.moveTo(window.innerWidth - x, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 5);
      break;
    case '9':
      ctx.moveTo(window.innerWidth - x + 7, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 1, window.innerHeight - y + 5);
      ctx.lineTo(window.innerWidth - x + 1, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      break;
    case '.':
      ctx.moveTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 1);
      ctx.lineTo(window.innerWidth - x + 1, window.innerHeight - y + 1);
      ctx.lineTo(window.innerWidth - x + 1, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y);      
      break;
    default: // Draw 0
      ctx.moveTo(window.innerWidth - x, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y);
      ctx.lineTo(window.innerWidth - x + 7, window.innerHeight - y + 10);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y + 10);
      ctx.lineTo(window.innerWidth - x, window.innerHeight - y);
      break;
  }
}
