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

    this.operate = function(f, u, v, w, x, y, z) {
      f(this, u, v, w, x, y, z);
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

    this.operate = function(f, u, v, w, x, y, z) {
      f(this, u, v, w, x, y, z);
      return this;
    }

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
    this.impulses = [];
    this.integrator = options.integrator || new EulerIntegrator();

    this.step = function(dt) {
      if (dt > MAX_TIME_STEP) dt = MAX_TIME_STEP;
      this.integrator.update(this.pos, this.vel, this.rot, this.rotvel,
          this.forces, this.impulses, this.invmass, this.invmoi, dt);
      this.impulses = [];
    }

    this.applyImpulse = function(impulse) {
      this.impulses.push(impulse);
    };

    this.applyForce = function(force) {
      if (!~this.forces.indexOf(force))
        this.forces.push(force);
    }

    this.removeForce = function(force) {
      if (~this.forces.indexOf(force))
        this.forces.splice(this.forces.indexOf(force), 1);
    }

    this.corners = function() {
      return [
        new Physics.Vector2(this.pos.x, this.pos.y).add(new Physics.Vector2(this.width / 2, this.height / 2)).rotate(this.rot)
      ];
    }

    this.collides = function(p) {
      var collides = true;
      var corners = this.corners();
      corners.push(corners[0]);
      for (var i=0;i<corners.length - 2; i++) {
        var m = (corners[i + 1].y - corners[i].y) / (corners[i+1].x - corners[i].x);
        var c = ;
        var line = {
          m: m,
          c: c
        };
        collides &= side(line, p) === side(line, corners[(i+2)%corners.length);
      }
      return true;
    }
  }
})();

function EulerIntegrator() {
  this.update = function(pos, vel, rot, rotvel, forces, impulses, invmass, invmoi, dt) {
      var acc = resolve(forces, invmass, rot);
      var imp = resolveImpulses(impulses, invmass, rot);
      var rotacc = resolveAngles(forces, invmoi, rot);
      var rotimp = resolveImpulseAngles(impulses, invmoi, rot);
      pos.operate(function(self, u, v, w) {
        self.x += (u.x + (u.x + v.x * dt + w.x)) * (dt / 2);
        self.y += (u.y + (u.y + v.y * dt + w.x)) * (dt / 2);
      }, vel, acc, imp);
      vel.operate(function(self, u, v) {
        self.x += u.x * dt + v.x;
        self.y += u.y * dt + v.y;
      }, acc, imp);
      rot.operate(function(self, u, v, w) {
        self.x += (u.x + (u.x + v.x * dt + w.x)) * (dt / 2);
      }, rotvel, rotacc, rotimp);
      rotvel.operate(function(self, u, v) {
        self.x += dt * u.x + v.x;
       }, rotacc, rotimp);
  }
}

var a2 = new Physics.Vector2(0, 0);
function resolve(fs, invmass, rot) {
  a2.zero();
  for (var i=0;i<fs.length;i++)
    if (fs[i].relative)
      a2.operate(function(self, u) {
        self.x += -rotateX(u, rot) * invmass;
        self.y += rotateY(u, rot) * invmass;
      }, fs[i].force);
    else
      a2.operate(function(u, v) {
        u.x += v.x * invmass;
        u.y += v.y * invmass;
      }, fs[i].force);
  return a2;
}

var b2 = new Physics.Vector2();
function resolveImpulses(is, invmass, rot) {
  b2.zero();
  for (var i=0;i<is.length;i++)
    if (is[i].relative)
      b2.operate(function(self, u) {
        self.x += -rotateX(u, rot) * invmass;
        self.y += rotateY(u, rot) * invmass;
      }, is[i].impulse);
    else
      b2.operate(function(u, v) {
        u.x += v.x * invmass;
        u.y += v.y * invmass;
      }, is[i].impulse);
  return b2;
}

function rotateX(v, r) {
  return Math.cos(r.x) * v.x + Math.sin(r.x) * v.y;
}

function rotateY(v, r) {
  return Math.cos(r.x) * v.y - Math.sin(r.x) * v.x;
}

function arotateX(v, r) {
  return Math.cos(r.x) * v.x - Math.sin(r.x) * v.y;
}

function arotateY(v, r) {
  return Math.cos(r.x) * v.y + Math.sin(r.x) * v.x;
}

var a1 = new Physics.Vector1(0);
function resolveAngles(fs, invmoi, rot) {
  a1.zero();
  for (var i=0;i<fs.length;i++) {
    if (fs[i].relative)
      a1.operate(function(self, u, v) {
        self.x += invmoi * (rotateX(u, rot) * rotateY(v, rot)
                       - rotateY(u, rot) * rotateX(v, rot));
      }, fs[i].force ? fs[i].force : fs[i].impulse, fs[i].pos);
    else
      a1.operate(function(self, u, v) {
        self.x += invmoi * (u.x * v.y - u.y * v.x);
      }, fs[i].force ? fs[i].force : fs[i].impulse, fs[i].pos);
  }
  return a1;
}

var b1 = new Physics.Vector1(0);
function resolveImpulseAngles(is, invmoi, rot) {
  b1.zero();
  for (var i=0;i<is.length;i++) {
    if (is[i].relative)
      b1.operate(function(self, u, v) {
        self.x += invmoi * (rotateX(u, rot) * rotateY(v, rot)
                       - rotateY(u, rot) * rotateX(v, rot));
      }, is[i].impulse, is[i].pos);
    else
      b1.operate(function(self, u, v) {
        self.x += invmoi * (u.x * v.y - u.y * v.x);
      }, is[i].impulse, is[i].pos);
  }
  return b1;
}
