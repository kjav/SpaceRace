var time = (function() {
  if (window.performance && window.performance.now)
    return function() { return window.performance.now() };
  else
    return function() { return +new Date(); }
})();

var scene;
function setup() {
  var canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;    
  }
  var c = canvas.getContext('2d');
  window.ctx = c;

  scene = new Bulb.World(c);

  var pe = new ParticleEmitter(50, 200, new Physics.Vector2(20, 20), new Physics.Vector2(0, 300), new Physics.Vector2(15, 15), '#ffffff', false);
  scene.add(pe);

  var a = new Bulb.Quad({
    pos: new Physics.Vector2(window.innerWidth / 1.3, window.innerHeight / 2),
    width: 40,
    height: 40,
    debug: true,
    colour: '#00ffff',
    mass: 10,
    fuel: 0
  });

  scene.add(a);

  var b = new Bulb.Quad({
    pos: new Physics.Vector2(window.innerWidth / 2, window.innerHeight / 2),
    width: 20,
    height: 60,
    debug: true,
    colour: '#ffffff',
    mass: 10,
    fuel: 0.9
  });

  var gravity = {
    force: new Physics.Vector2(0, 0),
    pos: new Physics.Vector2(0, 0),
    relative: false
  };
  b.body.applyForce(gravity);

  var dist = new Physics.Vector2(0, 28);
  var dir  = new Physics.Vector2(0, 180);
  b.update = function(dt) {
  gravity.force.operate(function(self) {
      self.y = 0 * (b.fuel + b.body.mass);
    });
    pe.pos.operate(function(self, u, v, w) {
      self.x = u.x + arotateX(v, w);
      self.y = u.y + arotateY(v, w);
    }, b.body.pos, dist, b.body.rot);
    pe.vel.operate(function(self, u, v, w) {
      self.x = arotateX(u, v) + w.x;
      self.y = arotateY(u, v) + w.y;
    }, dir, b.body.rot, b.body.vel);
    if (pe.emitting)
      b.fuel -= 0.1 * dt;
    if (b.fuel < 0)
      b.fuel = 0;

    // Collision test
    var collisions = [];
    b.body.corners().forEach(
        function(p) { if (a.body.collides(p)) { collisions.push(p); } });
    if (collisions) {
      a.colour = '#ffff00';
      var cs = collisions;
      var t = dt;
      while (cs) {
        //binary search
        cs = false;
      }
    }
  }

  var upforce = {
    force: new Physics.Vector2(0, -500),
    pos: new Physics.Vector2(0, 30),
    relative: true
  };
  var rightImpulse = {
    impulse: new Physics.Vector2(400, 0),
    pos: new Physics.Vector2(0, 0),
    relative: true
  };
  Keyboard.onkeydown('i', function() {
    b.body.applyImpulse(rightImpulse);
  });
  Keyboard.onkeydown('w', function() {
    pe.emitting = true;
    b.body.applyForce(upforce);
  });
  Keyboard.onkeyup('w', function() {
    pe.emitting = false;
    b.body.removeForce(upforce);
  });
  var downforce = {
    force: new Physics.Vector2(0, 50),
    pos: new Physics.Vector2(0, -30),
    relative: true
  };
  Keyboard.onkeydown('s', function() {
//    b.body.applyForce(downforce);
  });
  Keyboard.onkeyup('s', function() {
//    b.body.removeForce(downforce);
  });
  var clockforce1 = {
    force: new Physics.Vector2(0, -120),
    pos: new Physics.Vector2(10, 0),
    relative: true
  };
  var clockforce2 = {
    force: new Physics.Vector2(0, 120),
    pos: new Physics.Vector2(-10, 0),
    relative: true
  };
  Keyboard.onkeydown('d', function() {
    b.body.applyForce(clockforce1);
    b.body.applyForce(clockforce2);
  });
  Keyboard.onkeyup('d', function() {
    b.body.removeForce(clockforce1);
    b.body.removeForce(clockforce2);
  });
  var aclockforce1 = {
    force: new Physics.Vector2(0, 120),
    pos: new Physics.Vector2(10, 0),
    relative: true
  };
  var aclockforce2 = {
    force: new Physics.Vector2(0, -120),
    pos: new Physics.Vector2(-10, 0),
    relative: true
  };
  Keyboard.onkeydown('a', function() {
    b.body.applyForce(aclockforce1);
    b.body.applyForce(aclockforce2);
  });
  Keyboard.onkeyup('a', function() {
    b.body.removeForce(aclockforce1);
    b.body.removeForce(aclockforce2);
  });
  scene.add(b);

  var prev = time();
  function update() {
    var p = (time() - prev) / 1000;
    prev = time();
    scene.step(p);
    c.clearRect(0, 0, canvas.width, canvas.height);

    scene.render();

    prev = time();
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function random() {
  return (0 | Math.random() * 16).toString(16);
}

setup();
