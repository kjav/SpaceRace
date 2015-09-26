MAX_TIME_STEP = 0.05;

Physics = new (function() {
  this.Vector2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;

    this.scale = function(s) {
      this.x *= s;
      this.y *= s;
      return this;
    }

    this.fliph = function() {
      this.x = -this.x;
      return this;
    }

    this.add = function(b) {
      this.x += b.x;
      this.y += b.y;
      return this;
    }

    this.sub = function(b) {
      this.x -= b.x;
      this.y -= b.y;
      return this;
    }

    this.zero = function() {
      this.x = 0;
      this.y = 0;
      return this;
    }

    this.cross = function(b) {
      return new Physics.Vector1(this.x * b.y - this.y * b.x);
    }

    this.dot = function(b) {
      return this.x * b.x + this.y * b.y;
    }

    this.copy = function() {
      return new Physics.Vector2(this.x, this.y);
    }

    this.translate = function(b) {
      this.x += b.x;
      this.y += b.y;
      return this;
    }

    this.rotate = function(r) {
      r = r.x;
      var original = this.copy();
      var rot = new Physics.Vector2(Math.cos(r), Math.sin(r));
      this.x = original.dot(rot);
      rot = new Physics.Vector2(-rot.y, rot.x);
      this.y = original.dot(rot);
      return this;
    }
  }

  this.Vector1 = function(x) {
    this.x = x || 0;

    this.add = function(b) {
      this.x += b.x;
      return this;
    }

    this.copy = function() {
      return new Physics.Vector1(this.x);
    }

    this.scale = function(s) {
      this.x *= s;
      return this;
    }

    this.zero = function() {
      this.x = 0;
      return this;
    }
  }

  this.Body = function(type, options) {
    if (!options) { options = {}; }
    this.vel = options.vel || new Physics.Vector2(0, 0);
    this.pos = options.pos || new Physics.Vector2(0, 0);
    this.rot = options.rot || new Physics.Vector1(0);
    this.rotvel = options.rotvel || new Physics.Vector1(0);
    this.mass = options.mass || 1;
    this.invmass = 1 / options.mass || 1;
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.moi = this.mass * (this.width * this.width +
                            this.height * this.height) / 12;
    this.invmoi = 1 / this.moi;
    this.forces = [];
    this.integrator = options.integrator || new EulerIntegrator();

    this.step = function(dt) {
      if (dt > MAX_TIME_STEP) dt = MAX_TIME_STEP;
      this.integrator.update(this.pos, this.vel, this.rot, this.rotvel,
                             this.forces, this.invmass, this.invmoi, dt);
    }

    this.applyForce = function(force) {
      if (!~this.forces.indexOf(force))
        this.forces.push(force);
    }
    this.removeForce = function(force) {
      if (~this.forces.indexOf(force))
        this.forces.splice(this.forces.indexOf(force), 1);
    }
  }
})();

function EulerIntegrator() {
  this.update = function(pos, vel, rot, rotvel, forces, invmass, invmoi, dt) {
      var acc = resolve(forces, invmass, rot);
      var rotacc = resolveAngles(forces, invmoi, rot);
      pos.add(vel.copy().add(vel.copy().add(acc.copy().scale(dt))).scale(dt*0.5));
      vel.add(acc.copy().scale(dt));
      rot.add(rotvel.copy().add(rotvel.copy().add(rotacc.copy().scale(dt))).scale(dt*0.5));
      rotvel.add(rotacc.copy().scale(dt));
  }
}

var a2 = new Physics.Vector2(0, 0);
function resolve(fs, invmass, rot) {
  a2.zero();
  for (var i=0;i<fs.length;i++) {
    if (fs[i].relative)
      a2.add(fs[i].force.copy().rotate(rot).scale(invmass).fliph());
    else
      a2.add(fs[i].force.copy().scale(invmass));
  }
  return a2;
}

var a1 = new Physics.Vector1(0);
function resolveAngles(fs, invmoi, rot) {
  a1.zero();
  for (var i=0;i<fs.length;i++) {
    if (fs[i].relative)
      a1.add(fs[i].force.copy().rotate(rot).cross(fs[i].pos.copy().rotate(rot)).scale(invmoi));
    else
      a1.add(fs[i].force.cross(fs[i].pos).scale(invmoi));
  }
  return a1;
}
