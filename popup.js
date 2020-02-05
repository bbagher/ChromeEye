window.addEventListener("DOMContentLoaded", event => {
  let speed, color, size;
  // import heavy duty work
  // const {updateLocals, setToLocals, chromeEye} = require('./functions.js')
  const updateLocals = (key, node) => {
    chrome.storage.local.get([key], function(result) {
      let res = result[key];
      if (res) node.value = res;
    });
  };

  // set values in locals
  const setToLocals = (key, value) => {
    chrome.storage.local.set({ [key]: value }, function() {
      console.log("Value is set to " + value);
    });
  };
  // disable chromeEye
  const disableEye = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, {
        code: 'if (read) document.removeEventListener("click",read)'
      });
    });
    console.log("successfuly disabled eye");
  };

  // this is it
  const chromeEye = (speed, size, color) => {
    // where all magic happens
    const readEye = text => {
      // fixing color persistance bug
      chrome.storage.local.set({ ["color"]: color }, function() {
        console.log("Value is set to " + value);
      });
      // user inputs  and (very sophisticated algo for speed and size)
      let actualSpeed = Number(speed) * 5;
      let actualSize = Number(size) * 2;
      // console.log('inside main', color)
      // console.log('this is color ', color, typeof color, color.constructor)
      let og = text.innerHTML
        .split(" ")
        .slice()
        .join(" ");
      let textArray = text.innerText.split(" ");
      let offset = 0;
      let spritz;
      let temp = textArray[0];
      // iterate through array of words and increasing timeout for each word (taming async)
      for (let i = 0; i < textArray.length; i++) {
        timeout = setTimeout(() => {
          text.innerHTML = textArray.join(" ");
          // save unmodified word
          temp = textArray[i];
          // change the css of each word
          // adding spritz
          spritz = textArray[i].split("");
          spritz[
            Math.floor((spritz.length - 1) / 2)
          ] = `<span style="color: red">${
            spritz[Math.floor((spritz.length - 1) / 2)]
          }</span>`;
          textArray[i] = spritz.join("");
          textArray[
            i
          ] = `<center><mark style="background-color: ${color}; font-size: ${actualSize}px;"><strong>${textArray[i]}</strong></mark></center>`;
          // inject in html
          text.innerHTML = textArray.join(" ");
          // return word to its original form
          textArray[i] = temp;
        }, 0 + offset);

        // add progressively more time to each word
        offset += actualSpeed;
      }
      // reset innerHTML to original form
      timeout2 = setTimeout(() => (text.innerHTML = og), offset);
    };

    // attach magic to dom
    document.addEventListener(
      "click",
      (read = () => {
        readEye(event.toElement);
      })
    );
  };

  // hold all components that hold important data values from user inputs
  let activate = document.getElementById("checkbox");
  let speedStep = document.getElementById("speed");
  let sizeStep = document.getElementById("size");
  let colorStep = document.getElementById("color");

  // update values if in locals (this is persistence)
  updateLocals("size", sizeStep);
  updateLocals("speed", speedStep);
  updateLocals("color", colorStep);

  console.log("DOM fully loaded and parsed");

  // listen for user inputs
  colorStep.addEventListener("click", function(eventIn) {
    color = eventIn.toElement.value;
    console.log("setting this ", color);
    setToLocals("color", color);
  });

  speedStep.addEventListener("click", function(eventIn) {
    speed = eventIn.toElement.valueAsNumber;
    setToLocals("speed", speed);
  });

  // make size persistent by setting it in store after change
  sizeStep.addEventListener("click", function(eventIn) {
    size = eventIn.toElement.valueAsNumber;
    setToLocals("size", size);
  });

  activate.addEventListener("click", function(eventIn) {
    disableEye();

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      console.log(
        "activating script at ",
        speedStep.value,
        "and size ",
        sizeStep.value
      );
      chrome.tabs.executeScript(tabs[0].id, {
        code:
          "(" +
          chromeEye +
          ")(" +
          speedStep.value +
          "," +
          sizeStep.value +
          ",'" +
          colorStep.value +
          "')"
      });
    });
  });
  disableEye();
});
