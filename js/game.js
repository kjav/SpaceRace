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

  scene = new Bulb.World(c);

  var pe = new ParticleEmitter(100, 50, new Physics.Vector2(20, 20), new Physics.Vector2(0, 100), new Physics.Vector2(25, 25), '#000000', false);
  scene.add(pe);

  var b = new Bulb.Quad({
    pos: new Physics.Vector2(window.innerWidth / 2, window.innerHeight / 2),
    width: 20,
    height: 60,
    debug: true
  });

  var dist = new Physics.Vector2(0, 28);
  var dir  = new Physics.Vector2(0, 100);
  b.update = function() {
    pe.pos = b.body.pos.copy().translate(dist.copy().rotate(b.body.rot.copy().scale(-1)));
    pe.vel = dir.copy().rotate(b.body.rot.copy().scale(-1));
  }

  var upforce = {
    force: new Physics.Vector2(0, -50),
    pos: new Physics.Vector2(0, 30),
    relative: true
  };
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
    force: new Physics.Vector2(0, -20),
    pos: new Physics.Vector2(10, 0),
    relative: true
  };
  var clockforce2 = {
    force: new Physics.Vector2(0, 20),
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
    force: new Physics.Vector2(0, 20),
    pos: new Physics.Vector2(10, 0),
    relative: true
  };
  var aclockforce2 = {
    force: new Physics.Vector2(0, -20),
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

// Create planet

// Create spaceship

