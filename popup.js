window.addEventListener("DOMContentLoaded", event => {
  let speed, color, size, clearBool;

  const stop = async () => {
    await chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, {
        code:
        "b =document.getElementsByTagName(sessionStorage.getItem('og'));for(let i in b){if (Number(i) == i){if(b[i].innerText.startsWith(sessionStorage.getItem('starts')))b[i].innerHTML=sessionStorage.getItem('text');}}"
      });
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, {
        code:
          "var id = window.setTimeout(function() {}, 0);while (id--) {window.clearTimeout(id);}"
      });
    });
  };

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
  const chromeEye = (speed, size, color, bool) => {
    const readEye = text => {
      // fixing color persistance bug
      chrome.storage.local.set({ ["color"]: color }, function() {
        console.log("Value is set to " + value);
      });
      // user inputs  and (very sophisticated algo for speed and size)
      const actualSpeed = (100 - Number(speed)) * 5;
      const actualSize = Number(size) * 2;
      const og = text.innerHTML.slice();
      
      let textArray = text.innerText.split(" ");
      console.log(textArray);
      let offset = 0;
      let red;
      let temp = textArray[0];
      // iterate through array of words and increasing timeout for each word (taming async)
      for (let i = 0; i < textArray.length; i++) {
        timeout = setTimeout(() => {
          text.innerHTML = textArray.join(" ");
          // save unmodified word
          temp = textArray[i];
          // change the css of each word
          red = textArray[i].split("");
          red[Math.floor((red.length - 1) / 2)] = `<span style="color: red">${
            red[Math.floor((red.length - 1) / 2)]
          }</span>`;
          textArray[i] = red.join("");
          textArray[
            i
          ] = `<center><mark style="background-color: ${color}; font-size: ${actualSize}px;"><strong>${textArray[i]}</strong></mark></center>`;
          // inject in html
          if (!bool) text.innerHTML = textArray.join(" ");
          else text.innerHTML = textArray[i];
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

        // reset dom after stop (save info needed to reset dom)
        sessionStorage.setItem('og', event.toElement.tagName);
        sessionStorage.setItem('text', event.toElement.innerHTML.slice())
        sessionStorage.setItem('starts', event.toElement.innerText.slice(0,10))

        readEye(event.toElement);
      })
    );
  };

  // hold all components that hold important data values from user inputs
  let activate = document.getElementById("activate");
  let stopButton = document.getElementById("stop");
  let clear = document.getElementById("clear");
  let speedStep = document.getElementById("speed");
  let sizeStep = document.getElementById("size");
  let colorStep = document.getElementById("color");

  // update values if in locals (this is persistence)
  updateLocals("size", sizeStep);
  updateLocals("speed", speedStep);
  updateLocals("color", colorStep);

    chrome.storage.local.get(["clear"], function(result) {
      let res = result.clear;
      if (res) clear.checked = res;
      else clear.checked = false
    });

  console.log("DOM fully loaded and parsed");

  clear.addEventListener("click", function(eventIn){
    clearBool = clear.checked;
    setToLocals("clear", clearBool);

  })

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

  stopButton.addEventListener("click", function(eventIn) {
    stop();
  });

  activate.addEventListener("click", function(eventIn) {
    disableEye();

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
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
          "'," +
          clear.checked +
          ")"
      });
    });
  });
});
