Bulb = new (function() {
  this.Quad = function(options) {
    this.body = new Physics.Body('quad', options);
    this.colour = options.colour || 0x0066ff;
    this.debug = options.debug;

    this.render = function(ctx) {
      ctx.translate(this.body.pos.x, this.body.pos.y);
      ctx.rotate(this.body.rot.x);
      ctx.fillRect(-this.body.width / 2, -this.body.height / 2,
                   this.body.width, this.body.height);
      ctx.rotate(-this.body.rot.x);
      ctx.translate(-this.body.pos.x, -this.body.pos.y);

      if (this.debug) {
        var force = resolve(this.body.forces, this.body.invmass,
                                  this.body.rot).rotate(-this.body.rot).scale(0.1);
        if (force.x != 0 || force.y != 0) {
          ctx.beginPath();
          ctx.strokeStyle = '#00ffff';
          var pos = this.body.forces[Object.keys(this.body.forces)[0]].pos.copy().rotate(this.body.rot.copy());
          ctx.moveTo(this.body.pos.x - pos.x, this.body.pos.y + pos.y);
          ctx.lineTo(this.body.pos.x - pos.x - force.x, this.body.pos.y + pos.y + force.y);
          ctx.stroke();
        }
      }
    };

    this.step = function(dt) {
      this.body.step(dt);
      if (this.update)
        this.update();
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
