function lowercase(key) {
  if (key.length === 1) {
    return key.toLowerCase();
  } else {
    return key;
  }
}

export class InputManager {
  constructor() {
    this.keyStates = new Map();
    this.buttonStates = new Map();
    this.trackedKeys = new Set([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Shift',
      'Meta',
    ]);

    for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
      this.trackedKeys.add(String.fromCharCode(i));
    }
  }

  listen() {
    window.addEventListener('keydown', (event) => {
      const key = lowercase(event.key);
      if (this.trackedKeys.has(key) && !this.keyStates.get('Meta')) {
        event.preventDefault();
        this.keyStates.set(key, true);
      }
    });

    window.addEventListener('keyup', (event) => {
      const key = lowercase(event.key);
      if (this.trackedKeys.has(key)) {
        event.preventDefault();
        this.keyStates.set(key, false);
      }
    });

    window.addEventListener('mousedown', (event) => {
      this.buttonStates.set(event.button, true);
    });

    window.addEventListener('mouseup', (event) => {
      this.buttonStates.set(event.button, false);
    });

    window.addEventListener('mouseleave', (event) => {
      console.log('mouseleave');
      for (let i = 0; i < 5; i++) {
        this.buttonStates.set(1 << i, false);
      }
    });

    const clear = () => {
      this.keyStates.clear();
      this.buttonStates.clear();
    };

    window.addEventListener('focus', clear);
    window.addEventListener('blur', clear);
  }
}
