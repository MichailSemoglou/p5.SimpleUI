# p5.SimpleUI

p5.SimpleUI is a lightweight UI library for p5.js that provides easy-to-use UI elements for your p5.js sketches.

## Features

- Simple and intuitive API
- Customizable UI elements
- Easy integration with existing p5.js projects
- Includes various UI elements:
  - Button
  - Slider
  - Radio Button
  - Checkbox
  - Text Area
  - Input Box
  - File Picker
  - Color Picker

## Installation

1. Download the `p5.SimpleUI.js` file from this repository.
2. Include it in your HTML file after the p5.js script:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
<script src="path/to/p5.SimpleUI.js"></script>
```

## Usage

Here's a basic example of how to use p5.SimpleUI in your p5.js sketch:

```javascript
let ui;
let button;
let slider;

function setup() {
  createCanvas(400, 400);
  ui = createSimpleUI();
  
  button = ui.Button(10, 10, 100, 30, "Click me");
  button.setOnClick(() => console.log("Button clicked"));
  
  slider = ui.Slider(10, 50, 200, 0, 100, 50);
  slider.setOnChange(value => console.log("Slider value:", value));
}

function draw() {
  background(220);
  button.display();
  slider.display();
}

function mousePressed() {
  button.handleClick();
  slider.handleMousePressed();
}

function mouseDragged() {
  slider.handleDrag();
}

function mouseReleased() {
  slider.handleMouseReleased();
}
```

## API Reference

### Button

```javascript
let button = ui.Button(x, y, width, height, label);
button.setOnClick(callback);
```

### Slider

```javascript
let slider = ui.Slider(x, y, length, min, max, defaultValue, isInteger, step, label, isVertical);
slider.setOnChange(callback);
```

### RadioButton

```javascript
let radio = ui.RadioButton(x, y, ["Option 1", "Option 2", "Option 3"]);
radio.setOnChange(callback);
```

### Checkbox

```javascript
let checkbox = ui.Checkbox(x, y, "Label");
checkbox.setOnChange(callback);
```

### TextArea

```javascript
let textarea = ui.TextArea(x, y, width, height, defaultText);
textarea.setOnInput(callback);
```

### InputBox

```javascript
let inputbox = ui.InputBox(x, y, width, height, defaultText);
inputbox.setOnInput(callback);
```

### FilePicker

```javascript
let filepicker = ui.FilePicker(x, y, width, height, "Choose File");
filepicker.setOnSelect(callback);
```

### ColorPicker

```javascript
let colorpicker = ui.ColorPicker(x, y, width, height, defaultColor);
colorpicker.setOnColorChange(callback);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
