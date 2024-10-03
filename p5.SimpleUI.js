// p5.SimpleUI.js

/**
 * p5.SimpleUI - A library for creating simple UI elements in p5.js
 * @module SimpleUI
 */

(function (global) {
  /**
   * Represents a clickable button.
   * @class
   */
  class Button {
    /**
     * Create a button.
     * @param {Object} p - The p5 instance.
     * @param {number} x - The x-coordinate of the button.
     * @param {number} y - The y-coordinate of the button.
     * @param {number} w - The width of the button.
     * @param {number} h - The height of the button.
     * @param {string} label - The text label of the button.
     */
    constructor(p, x, y, w, h, label) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.label = label;
      this.onClick = null;
      this.isHovered = false;
    }

    /**
     * Display the button on the canvas.
     */
    display() {
      this.p.push();
      this.p.stroke(0);
      this.p.strokeWeight(0);
      this.p.fill(this.isHovered ? 50 : 0);
      this.p.cursor(this.isHovered ? this.p.HAND : this.p.ARROW);
      this.p.rect(this.x, this.y, this.w, this.h, 5);
      this.p.fill(255);
      this.p.noStroke();
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.text(this.label, this.x + this.w / 2, this.y + this.h / 2);
      this.p.pop();
    }

    /**
     * Check if the mouse is over the button.
     * @returns {boolean} True if the mouse is over the button, false otherwise.
     */
    isMouseOver() {
      return (
        this.p.mouseX > this.x &&
        this.p.mouseX < this.x + this.w &&
        this.p.mouseY > this.y &&
        this.p.mouseY < this.y + this.h
      );
    }

    /**
     * Handle click events on the button.
     */
    handleClick() {
      if (this.isMouseOver() && this.onClick) {
        this.onClick();
      }
    }

    /**
     * Handle mouse movement events for hover effects.
     */
    handleMouseMove() {
      this.isHovered = this.isMouseOver();
    }

    /**
     * Set the click event handler for the button.
     * @param {Function} callback - The function to call when the button is clicked.
     */
    setOnClick(callback) {
      this.onClick = callback;
    }
  }

  /**
   * Represents a file picker button.
   * @class
   */
  class FilePicker {
    /**
     * Create a file picker.
     * @param {Object} p - The p5 instance.
     * @param {number} x - The x-coordinate of the file picker.
     * @param {number} y - The y-coordinate of the file picker.
     * @param {number} w - The width of the file picker.
     * @param {number} h - The height of the file picker.
     * @param {string} label - The text label of the file picker.
     */
    constructor(p, x, y, w, h, label) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.label = label;
      this.onSelect = null;
      this.multiple = false;

      this.fileInput = this.p.createFileInput(this.handleFile.bind(this), this.multiple);
      this.fileInput.attribute('accept', 'image/*');
      this.fileInput.hide();
      
      this.button = this.p.createButton(this.label);
      this.button.position(this.x, this.y);
      this.button.size(this.w, this.h);
      this.button.mousePressed(() => this.fileInput.elt.click());
      
      this.button.style('background-color', '#000000');
      this.button.style('color', '#FFFFFF');
      this.button.style('border', 'none');
      this.button.style('border-radius', '5px');
      this.button.style('font-size', '14px');
      this.button.style('cursor', 'pointer');
    }

    /**
     * Handle file selection.
     * @param {File|File[]} file - The selected file(s).
     */
    handleFile(file) {
      if (this.onSelect) {
        if (Array.isArray(file)) {
          Promise.all(file.map(f => this.loadImage(f))).then(loadedFiles => {
            this.onSelect(loadedFiles);
          });
        } else {
          this.loadImage(file).then(loadedFile => {
            this.onSelect([loadedFile]);
          });
        }
      }
    }

    /**
     * Load an image file.
     * @param {File} file - The file to load.
     * @returns {Promise} A promise that resolves with the loaded image data.
     */
    loadImage(file) {
      return new Promise((resolve) => {
        this.p.loadImage(file.data, img => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: img
          });
        });
      });
    }

    /**
     * Set the file selection event handler.
     * @param {Function} callback - The function to call when files are selected.
     */
    setOnSelect(callback) {
      this.onSelect = callback;
    }

    /**
     * Set whether multiple file selection is allowed.
     * @param {boolean} enable - True to allow multiple file selection, false otherwise.
     */
    setMultiple(enable) {
      this.multiple = enable;
      this.fileInput.attribute('multiple', enable);
    }

    /**
     * Display the file picker. (Not needed as the button is already displayed by p5.js)
     */
    display() {
      // The button is already displayed by p5.js
    }
  }

  /**
   * Represents a slider input.
   * @class
   */
  class Slider {
    /**
     * Create a slider.
     * @param {Object} p - The p5 instance.
     * @param {number} x - The x-coordinate of the slider.
     * @param {number} y - The y-coordinate of the slider.
     * @param {number} length - The length of the slider.
     * @param {number} min - The minimum value of the slider.
     * @param {number} max - The maximum value of the slider.
     * @param {number} defaultValue - The initial value of the slider.
     * @param {boolean} [isInteger=false] - Whether the slider should only use integer values.
     * @param {number} [step=null] - The step size for the slider values.
     * @param {string} [label=""] - The label for the slider.
     * @param {boolean} [isVertical=false] - Whether the slider should be vertical.
     */
    constructor(p, x, y, length, min, max, defaultValue, isInteger = false, step = null, label = "", isVertical = false) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.length = length;
      this.isVertical = isVertical;
      this.width = isVertical ? 20 : length;
      this.height = isVertical ? length : 20;
      this.min = min;
      this.max = max;
      this.isInteger = isInteger;
      this.step = step || (isInteger ? 1 : (max - min) / 100);
      this.value = this.isInteger ? Math.round(defaultValue) : defaultValue;
      this.isDragging = false;
      this.isHovering = false;
      this.onChange = null;
      this.handleSize = 20;
      this.label = label;
      this.labelWidth = 100;
    }

    /**
     * Display the slider on the canvas.
     */
    display() {
      this.p.push();
      
      // Display label
      this.p.fill(0);
      this.p.noStroke();
      this.p.textAlign(this.isVertical ? this.p.CENTER : this.p.RIGHT, this.p.CENTER);
      this.p.textSize(12);
      if (this.isVertical) {
        this.p.text(this.label, this.x + this.width / 2, this.y + this.height + 15);
      } else {
        this.p.text(this.label, this.x - 10, this.y + this.height / 2);
      }

      // Draw track
      this.p.stroke(0);
      this.p.strokeWeight(0);
      this.p.fill(255);
      this.p.rect(this.x, this.y, this.width, this.height);

      // Draw active part of track
      let handlePos = this.p.map(this.value, this.min, this.max, 0, this.length - this.handleSize);
      this.p.noStroke();
      this.p.fill(0);
      if (this.isVertical) {
        this.p.rect(this.x, this.y + this.height - handlePos - this.handleSize, this.width, handlePos + this.handleSize);
      } else {
        this.p.rect(this.x, this.y, handlePos + this.handleSize, this.height);
      }

      // Draw handle
      this.p.stroke(0);
      this.p.strokeWeight(0);
      this.p.fill(this.isDragging ? 50 : (this.isHovering ? 50 : 0));
      if (this.isVertical) {
        this.p.rect(this.x, this.y + this.height - handlePos - this.handleSize, this.width, this.handleSize, 3);
      } else {
        this.p.rect(this.x + handlePos, this.y, this.handleSize, this.height, 3);
      }

      // Display value
      this.p.noStroke();
      this.p.fill(0);
      this.p.textAlign(this.p.CENTER, this.p.BOTTOM);
      this.p.textSize(12);
      let displayValue = this.isInteger ? Math.round(this.value).toString() : this.value.toFixed(2);
      if (this.isVertical) {
        this.p.text(displayValue, this.x + this.width / 2, this.y + this.height - handlePos - this.handleSize - 5);
      } else {
        this.p.text(displayValue, this.x + handlePos + this.handleSize / 2, this.y - 5);
      }

      this.p.pop();
    }

    /**
     * Handle dragging of the slider.
     */
    handleDrag() {
      if (this.isDragging) {
        let mousePos = this.isVertical ? this.p.mouseY : this.p.mouseX;
        let sliderStart = this.isVertical ? this.y : this.x;
        let newValue = this.p.map(mousePos, sliderStart, sliderStart + this.length, this.isVertical ? this.max : this.min, this.isVertical ? this.min : this.max);
        
        if (this.step) {
          newValue = Math.round(newValue / this.step) * this.step;
        }
        
        this.value = this.isInteger ? Math.round(newValue) : newValue;
        this.value = this.p.constrain(this.value, this.min, this.max);
        
        if (this.onChange) {
          this.onChange(this.value);
        }
      }
    }

    /**
     * Handle mouse press on the slider.
     */
    handleMousePressed() {
      if (
        this.p.mouseX > this.x &&
        this.p.mouseX < this.x + this.width &&
        this.p.mouseY > this.y &&
        this.p.mouseY < this.y + this.height
      ) {
        this.isDragging = true;
        this.handleDrag();
      }
    }

    /**
     * Handle mouse release.
     */
    handleMouseReleased() {
      this.isDragging = false;
    }

    /**
     * Handle mouse movement for hover effects.
     */
    handleMouseMoved() {
      this.isHovering = (
        this.p.mouseX > this.x &&
        this.p.mouseX < this.x + this.width &&
        this.p.mouseY > this.y &&
        this.p.mouseY < this.y + this.height
      );
    }

    /**
     * Get the current value of the slider.
     * @returns {number} The current value of the slider.
     */
    getValue() {
      return this.value;
    }

    /**
     * Set the value of the slider.
     * @param {number} value - The new value for the slider.
     */
    setValue(value) {
      if (this.isInteger) {
        value = Math.round(value);
      } else if (this.step) {
        value = Math.round(value / this.step) * this.step;
      }
      this.value = this.p.constrain(value, this.min, this.max);
      if (this.onChange) {
        this.onChange(this.value);
      }
    }

    /**
     * Set the change event handler for the slider.
     * @param {Function} callback - The function to call when the slider value changes.
     */
    setOnChange(callback) {
      this.onChange = callback;
    }
  }

  /**
   * Represents a text area input.
   * @class
   */
  class TextArea {
    /**
     * Create a text area.
     * @param {Object} p - The p5 instance.
     * @param {number} x - The x-coordinate of the text area.
     * @param {number} y - The y-coordinate of the text area.
     * @param {number} w - The width of the text area.
     * @param {number} h - The height of the text area.
     * @param {string} [defaultText=''] - The initial text in the text area.
     */
    constructor(p, x, y, w, h, defaultText = '') {
      this.p = p;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.text = defaultText;
      this.lines = [defaultText];
      this.isFocused = false;
      this.onInput = null;
      this.cursorX = 0;
      this.cursorY = 0;
      this.scrollY = 0;
      this.lineHeight = 20;
    }

    /**
     * Display the text area on the canvas.
     */
    display() {
      this.p.push();
      
      // Background
      this.p.fill(this.isFocused ? 240 : 255);
      
      // Border
      this.p.stroke(this.isFocused ? this.p.color(0, 120, 255) : 0);
      this.p.strokeWeight(this.isFocused ? 2 : 0);
      
      this.p.rect(this.x, this.y, this.w, this.h);
      
      // Create a graphics buffer for the text
      let buffer = this.p.createGraphics(this.w, this.h);
      buffer.background(255, 0);
      buffer.fill(0);
      buffer.textAlign(this.p.LEFT, this.p.TOP);
      buffer.textSize(14);
      
      for (let i = 0; i < this.lines.length; i++) {
        buffer.text(this.lines[i], 5, 5 + i * this.lineHeight - this.scrollY);
      }
      
      // Display the buffer content within the text area
      this.p.image(buffer, this.x, this.y, this.w, this.h);
      
      // Cursor
      if (this.isFocused && this.p.frameCount % 60 < 30) {
        let cursorX = this.x + 5 + buffer.textWidth(this.lines[this.cursorY].substring(0, this.cursorX));
        let cursorY = this.y + 5 + this.cursorY * this.lineHeight - this.scrollY;
        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.p.line(cursorX, cursorY, cursorX, cursorY + this.lineHeight);
      }
      
      this.p.pop();
    }

    /**
     * Handle click events on the text area.
     */
    handleClick() {
      this.isFocused = 
      this.p.mouseX > this.x &&
      this.p.mouseX < this.x + this.w &&
      this.p.mouseY > this.y &&
      this.p.mouseY < this.y + this.h;
      
      if (this.isFocused) {
        let y = Math.floor((this.p.mouseY - this.y + this.scrollY) / this.lineHeight);
        this.cursorY = this.p.constrain(y, 0, this.lines.length - 1);
        let x = this.p.mouseX - this.x - 5;
        this.cursorX = 0;
        let lineWidth = 0;
        while (this.cursorX < this.lines[this.cursorY].length && lineWidth < x) {
          lineWidth += this.p.textWidth(this.lines[this.cursorY][this.cursorX]);
          this.cursorX++;
        }
      }
    }

    /**
     * Handle key press events for the text area.
     */
    handleKeyPress() {
      if (!this.isFocused) return;

      if (this.p.keyCode === this.p.ENTER) {
        let rightPart = this.lines[this.cursorY].substring(this.cursorX);
        this.lines[this.cursorY] = this.lines[this.cursorY].substring(0, this.cursorX);
        this.lines.splice(this.cursorY + 1, 0, rightPart);
        this.cursorY++;
        this.cursorX = 0;
      } else if (this.p.keyCode === this.p.BACKSPACE) {
        if (this.cursorX > 0) {
          this.lines[this.cursorY] = this.lines[this.cursorY].substring(0, this.cursorX - 1) + this.lines[this.cursorY].substring(this.cursorX);
          this.cursorX--;
        } else if (this.cursorY > 0) {
          this.cursorX = this.lines[this.cursorY - 1].length;
          this.lines[this.cursorY - 1] += this.lines[this.cursorY];
          this.lines.splice(this.cursorY, 1);
          this.cursorY--;
        }
      } else if (this.p.keyCode === this.p.LEFT_ARROW) {
        if (this.cursorX > 0) {
          this.cursorX--;
        } else if (this.cursorY > 0) {
          this.cursorY--;
          this.cursorX = this.lines[this.cursorY].length;
        }
      } else if (this.p.keyCode === this.p.RIGHT_ARROW) {
        if (this.cursorX < this.lines[this.cursorY].length) {
          this.cursorX++;
        } else if (this.cursorY < this.lines.length - 1) {
          this.cursorY++;
          this.cursorX = 0;
        }
      } else if (this.p.keyCode === this.p.UP_ARROW) {
        if (this.cursorY > 0) {
          this.cursorY--;
          this.cursorX = Math.min(this.cursorX, this.lines[this.cursorY].length);
        }
      } else if (this.p.keyCode === this.p.DOWN_ARROW) {
        if (this.cursorY < this.lines.length - 1) {
          this.cursorY++;
          this.cursorX = Math.min(this.cursorX, this.lines[this.cursorY].length);
        }
      } else if (this.p.key.length === 1) {
        this.lines[this.cursorY] = this.lines[this.cursorY].substring(0, this.cursorX) + this.p.key + this.lines[this.cursorY].substring(this.cursorX);
        this.cursorX++;
      }

      // Update scroll position
      if (this.cursorY * this.lineHeight < this.scrollY) {
        this.scrollY = this.cursorY * this.lineHeight;
      } else if ((this.cursorY + 1) * this.lineHeight > this.scrollY + this.h) {
        this.scrollY = (this.cursorY + 1) * this.lineHeight - this.h;
      }

      this.text = this.lines.join('\n');
      if (this.onInput) {
        this.onInput(this.text);
      }
    }

    /**
     * Get the current text in the text area.
     * @returns {string} The current text in the text area.
     */
    getText() {
      return this.text;
    }

    /**
     * Set the text in the text area.
     * @param {string} text - The new text for the text area.
     */
    setText(text) {
      this.text = text;
      this.lines = text.split('\n');
      this.cursorX = this.lines[this.lines.length - 1].length;
      this.cursorY = this.lines.length - 1;
    }

    /**
     * Set the input event handler for the text area.
     * @param {Function} callback - The function to call when the text area content changes.
     */
    setOnInput(callback) {
      this.onInput = callback;
    }
  }

  /**
   * Represents a radio button group.
   * @class
   */
  class RadioButton {
    /**
     * Create a radio button group.
     * @param {Object} p - The p5 instance.
     * @param {number} x - The x-coordinate of the radio button group.
     * @param {number} y - The y-coordinate of the radio button group.
     * @param {string[]} options - An array of options for the radio buttons.
     */
    constructor(p, x, y, options) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.options = options;
      this.selected = 0;
      this.onChange = null;
    }

    /**
     * Display the radio button group on the canvas.
     */
    display() {
      this.p.push();
      for (let i = 0; i < this.options.length; i++) {
        this.p.stroke(0);
        this.p.strokeWeight(0);
        this.p.fill(255);
        this.p.ellipse(this.x, this.y + i * 25, 20, 20);
        if (i === this.selected) {
          this.p.fill(0);
          this.p.ellipse(this.x, this.y + i * 25, 10, 10);
        }
        this.p.fill(0);
        this.p.noStroke();
        this.p.textAlign(this.p.LEFT, this.p.CENTER);
        this.p.text(this.options[i], this.x + 15, this.y + i * 25);
      }
      this.p.pop();
    }

    /**
     * Handle click events on the radio button group.
     */
    handleClick() {
      for (let i = 0; i < this.options.length; i++) {
        if (this.p.dist(this.p.mouseX, this.p.mouseY, this.x, this.y + i * 25) < 10) {
          this.selected = i;
          if (this.onChange) {
            this.onChange(this.options[i]);
          }
          break;
        }
      }
    }

    /**
     * Get the currently selected option.
     * @returns {string} The currently selected option.
     */
    getSelected() {
      return this.options[this.selected];
    }

    /**
     * Set the change event handler for the radio button group.
     * @param {Function} callback - The function to call when the selection changes.
     */
    setOnChange(callback) {
      this.onChange = callback;
    }
  }

  /**
   * Represents a checkbox.
   * @class
   */
  class Checkbox {
    /**
     * Create a checkbox.
     * @param {Object} p - The p5 instance.
     * @param {number} x - The x-coordinate of the checkbox.
     * @param {number} y - The y-coordinate of the checkbox.
     * @param {string} label - The label for the checkbox.
     */
    constructor(p, x, y, label) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.label = label;
      this.checked = false;
      this.onChange = null;
    }

    /**
     * Display the checkbox on the canvas.
     */
    display() {
      this.p.push();
      this.p.stroke(0);
      this.p.strokeWeight(0);
      this.p.fill(255);
      this.p.rect(this.x, this.y, 20, 20);
      if (this.checked) {
        this.p.fill(0);
        this.p.rect(this.x + 4, this.y + 4, 12, 12);
      }
      this.p.fill(0);
      this.p.noStroke();
      this.p.textAlign(this.p.LEFT, this.p.CENTER);
      this.p.text(this.label, this.x + 25, this.y + 10);
      this.p.pop();
    }

    /**
     * Handle click events on the checkbox.
     */
    handleClick() {
      if (
        this.p.mouseX > this.x &&
        this.p.mouseX < this.x + 20 &&
        this.p.mouseY > this.y &&
        this.p.mouseY < this.y + 20
      ) {
        this.checked = !this.checked;
        if (this.onChange) {
          this.onChange(this.checked);
        }
      }
    }

    /**
     * Get the current state of the checkbox.
     * @returns {boolean} True if the checkbox is checked, false otherwise.
     */
    isChecked() {
      return this.checked;
    }

    /**
     * Set the change event handler for the checkbox.
     * @param {Function} callback - The function to call when the checkbox state changes.
     */
    setOnChange(callback) {
      this.onChange = callback;
    }
  }

  /**
   * Represents a color picker.
   * @class
   */
  class ColorPicker {
    /**
     * Create a color picker.
     * @param {Object} p - The p5 instance.
     * @param {number} x - The x-coordinate of the color picker.
     * @param {number} y - The y-coordinate of the color picker.
     * @param {number} w - The width of the color picker.
     * @param {number} h - The height of the color picker.
     * @param {string} [defaultColor='#000000'] - The initial color of the color picker.
     */
    constructor(p, x, y, w, h, defaultColor = '#000000') {
      this.p = p;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.color = defaultColor;
      this.onColorChange = null;

      this.colorInput = this.p.createInput(defaultColor, 'color');
      this.colorInput.position(this.x, this.y);
      this.colorInput.size(0, 0);
      this.colorInput.style('visibility', 'hidden');
      
      this.button = this.p.createButton(this.color);
      this.button.position(this.x, this.y);
      this.button.size(this.w, this.h);
      this.button.mousePressed(() => this.colorInput.elt.click());
      
      this.updateButtonStyle();

      this.colorInput.input(() => {
        this.color = this.colorInput.value();
        this.updateButtonStyle();
        if (this.onColorChange) {
          this.onColorChange(this.color);
        }
      });
    }

    /**
     * Update the style of the color picker button.
     */
    updateButtonStyle() {
      this.button.style('background-color', this.color);
      this.button.html(this.color.toUpperCase());
      let r = parseInt(this.color.slice(1, 3), 16);
      let g = parseInt(this.color.slice(3, 5), 16);
      let b = parseInt(this.color.slice(5, 7), 16);
      let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      this.button.style('color', (yiq >= 128) ? '#000000' : '#FFFFFF');
      this.button.style('border', 'none');
      this.button.style('border-radius', '5px');
      this.button.style('font-size', '14px');
      this.button.style('cursor', 'pointer');
    }

    /**
     * Set the color change event handler for the color picker.
     * @param {Function} callback - The function to call when the color changes.
     */
    setOnColorChange(callback) {
      this.onColorChange = callback;
    }

    /**
     * Get the current color of the color picker.
     * @returns {string} The current color in hexadecimal format.
     */
    getColor() {
      return this.color;
    }

    /**
     * Display the color picker. (Not needed as the button is already displayed by p5.js)
     */
    display() {
      // The button is already displayed by p5.js
    }

    /**
     * Handle click events on the color picker.
     */
    handleClick() {
      if (
        this.p.mouseX > this.x &&
        this.p.mouseX < this.x + this.w &&
        this.p.mouseY > this.y &&
        this.p.mouseY < this.y + this.h
      ) {
        this.colorInput.elt.click();
      }
    }
  }

  /**
   * Represents an input box for single-line text input.
   * @class
   */
  class InputBox {
    /**
     * Create an input box.
     * @param {Object} p - The p5 instance.
     * @param {number} x - The x-coordinate of the input box.
     * @param {number} y - The y-coordinate of the input box.
     * @param {number} w - The width of the input box.
     * @param {number} h - The height of the input box.
     * @param {string} [defaultText=''] - The initial text in the input box.
     */
    constructor(p, x, y, w, h, defaultText = '') {
      this.p = p;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.text = defaultText;
      this.isFocused = false;
      this.onInput = null;
      this.cursorVisible = true;
      this.lastBlink = 0;
      this.blinkInterval = 500;
    }

    /**
     * Display the input box on the canvas.
     */
    display() {
      this.p.push();
      
      this.p.fill(this.isFocused ? 240 : 255);
      this.p.stroke(this.isFocused ? this.p.color(0, 120, 255) : 0);
      this.p.strokeWeight(this.isFocused ? 2 : 0);
      
      this.p.rect(this.x, this.y, this.w, this.h);
      
      this.p.fill(0);
      this.p.noStroke();
      this.p.textAlign(this.p.LEFT, this.p.CENTER);
      this.p.text(this.text, this.x + 5, this.y + this.h / 2);
      
      if (this.isFocused) {
        if (this.p.millis() - this.lastBlink > this.blinkInterval) {
          this.cursorVisible = !this.cursorVisible;
          this.lastBlink = this.p.millis();
        }
        if (this.cursorVisible) {
          let textWidth = this.p.textWidth(this.text);
          this.p.stroke(0);
          this.p.line(this.x + textWidth + 5, this.y + 2, this.x + textWidth + 5, this.y + this.h - 2);
        }
      }
      
      this.p.pop();
    }

    /**
     * Handle click events on the input box.
     */
    handleClick() {
      this.isFocused =
        this.p.mouseX > this.x &&
        this.p.mouseX < this.x + this.w &&
        this.p.mouseY > this.y &&
        this.p.mouseY < this.y + this.h;
    }

    /**
     * Handle key press events for the input box.
     */
    handleKeyPress() {
      if (!this.isFocused) return;

      if (this.p.keyCode === this.p.BACKSPACE) {
        if (this.text.length > 0) {
          this.text = this.text.slice(0, -1);
        }
      } else if (this.p.keyCode === this.p.ENTER) {
        this.isFocused = false;
      } else if (this.p.key.length === 1) {
        this.text += this.p.key;
      }

      if (this.onInput) {
        this.onInput(this.text);
      }
    }

    /**
     * Get the current text in the input box.
     * @returns {string} The current text in the input box.
     */
    getText() {
      return this.text;
    }

    /**
     * Set the input event handler for the input box.
     * @param {Function} callback - The function to call when the input box content changes.
     */
    setOnInput(callback) {
      this.onInput = callback;
    }
  }

  /**
   * The main SimpleUI object containing all UI element classes.
   * @namespace
   */
  const SimpleUI = {
    Button,
    Slider,
    RadioButton,
    Checkbox,
    TextArea,
    InputBox,
    FilePicker,
    ColorPicker,
    /**
     * Create a new SimpleUI instance.
     * @param {Object} p - The p5 instance.
     * @returns {Object} An object with methods to create UI elements.
     */
    create: function(p) {
      return {
        Button: (x, y, w, h, label) => new Button(p, x, y, w, h, label),
        Slider: (x, y, length, min, max, defaultValue, isInteger = false, step = null, label = "", isVertical = false) => {
          return new Slider(p, x, y, length, min, max, defaultValue, isInteger, step, label, isVertical);
        },
        RadioButton: (x, y, options) => new RadioButton(p, x, y, options),
        Checkbox: (x, y, label) => new Checkbox(p, x, y, label),
        TextArea: (x, y, w, h, defaultText) => new TextArea(p, x, y, w, h, defaultText),
        InputBox: (x, y, w, h, defaultText) => new InputBox(p, x, y, w, h, defaultText),
        FilePicker: (x, y, w, h, label) => new FilePicker(p, x, y, w, h, label),
        ColorPicker: (x, y, w, h, defaultColor) => new ColorPicker(p, x, y, w, h, defaultColor)
      };
    }
  };

  if (typeof p5 !== 'undefined') {
    p5.prototype.createSimpleUI = function() {
      return SimpleUI.create(this);
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleUI;
  } else {
    global.SimpleUI = SimpleUI;
  }
})(this);