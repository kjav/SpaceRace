var Keyboard = new (function() {
  var keymap = {
    'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71, 'h': 72,
    'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79, 'p': 80,
    'q': 81, 'r': 82, 's': 83, 't': 84, 'u': 85, 'v': 86, 'w': 87, 'x': 88,
    'y': 89, 'z': 90,  0 : 48,  1 : 49,  2 : 50,  3 : 51,  4 : 52,  5 : 53,
     6 : 54,  7 : 55,  8 : 56,  9 : 57
  };
  this.keydown_actions = [];
  this.keyup_actions = [];
  this.onkeydown = function(keys, action) {
    if (Array.isArray(keys)) {
      keys.forEach(function(key) {
        if (!Keyboard.keydown_actions[keymap[key]])
          Keyboard.keydown_actions[keymap[key]] = [];
        Keyboard.keydown_actions[keymap[key]].push(action);
      });
    } else {
        if (!Keyboard.keydown_actions[keys])
          Keyboard.keydown_actions[keymap[keys]] = [];
        Keyboard.keydown_actions[keymap[keys]].push(action);      
    }
  }
  this.onkeyup = function(keys, action) {
    if (Array.isArray(keys)) {
      keys.forEach(function(key) {
        if (!Keyboard.keyup_actions[keymap[key]])
          Keyboard.keyup_actions[keymap[key]] = [];
        Keyboard.keyup_actions[keymap[key]].push(action);
      });
    } else {
        if (!Keyboard.keyup_actions[keymap[keys]])
          Keyboard.keyup_actions[keymap[keys]] = [];
        Keyboard.keyup_actions[keymap[keys]].push(action);
    }
  }

  window.onkeydown = function(e) {
    if (Keyboard.keydown_actions[e.keyCode])
      Keyboard.keydown_actions[e.keyCode].forEach(function(action) {
        action(e);
      });
  }
  window.onkeyup = function(e) {
    if (Keyboard.keyup_actions[e.keyCode])
      Keyboard.keyup_actions[e.keyCode].forEach(function(action) {
        action(e);
      });
  }
})();
