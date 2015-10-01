ParticleEmitter = function(rate, max, pos, vel, dvel, colour, emitting) {
  this.pool = [];
  this.emitting = emitting;
  this.rate = rate;
  this.invrate = 1 / this.rate;
  this.max = max;
  this.pos = pos;
  this.vel = vel;
  this.dvel = dvel;
  this.colour = colour;

  this.currentTime = 0;
  this.currentParticle = 0;

  this.step = function(dt) {
    if (this.emitting) {
      this.currentTime += dt;
      while (this.currentTime >= this.invrate) {
        this.emit();
        this.currentTime -= this.invrate;
      }
    } else {
      this.currentTime = 0;
    }
    this.pool.forEach(function(p) { p.step(dt); });
  }

  this.emit = function() {
    var vel = this.vel.copy();
    vel.x += this.dvel.x * (Math.random() * 2 - 1)
    vel.y += this.dvel.y * (Math.random() * 2 - 1)
    if (this.pool.length === this.max) {
      this.pool[this.currentParticle++].set(this.pos, vel, this.colour);
      this.currentParticle %= this.max;
    } else {
      this.pool.push(new Particle(this.pos.copy(), vel, this.colour));
    }
  }

  this.render = function(ctx) {
    this.pool.forEach(function(p) { p.render(ctx); });
  }
}

var particle_integrator = new (function() {
  this.update = function(pos, vel, acc, dt) {
      pos.operate(function(self, u, v) { self.x += (u.x + (u.x + (v.x * dt))) * (dt / 2);
                                         self.y += (u.y + (u.y + (v.y * dt))) * (dt / 2); }, vel, acc);
      vel.operate(function(self, u) { self.x += u.x * dt; self.y += u.y * dt; }, acc);
  }
})();


Particle = function(pos, vel, colour) {
  this.set = function(pos, vel, colour) {
    this.pos.operate(function(self, u) {
      self.x = u.x;
      self.y = u.y;
    }, pos);
    this.vel.operate(function(self, u) {
      self.x = u.x;
      self.y = u.y;
    }, vel);
    this.acc = new Physics.Vector2(0, 0);
    this.colour = colour;
  }

  this.pos = pos || new Physics.Vector2(0, 0);
  this.vel = vel || new Physics.Vector2(0, 0);
  this.set(pos, vel, colour);

  this.step = function(dt) {
    particle_integrator.update(this.pos, this.vel, this.acc, dt);
  };

  this.render = function(ctx) {
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.pos.x, this.pos.y, 1, 1);
  };
}
