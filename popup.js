window.addEventListener("DOMContentLoaded", event => {
  let activate = document.getElementById("checkbox");
  let speedStep = document.getElementById("speed");
  let sizeStep = document.getElementById("size");

  const retrieveFromLocals = (key, node) => {
    chrome.storage.local.get([key], function(result) {
      let res = result[key];
      if (res) node.value = res;
    });
  };


  const setToLocals = (key, value) => {
    chrome.storage.local.set({ [key]: value }, function() {
      console.log("Value is set to " + value);
    });
  };

  retrieveFromLocals("size", sizeStep);
  retrieveFromLocals("speed", speedStep);

  const chromeEye = (speed, size) => {
    const readEye = text => {
      let actualSpeed = Number(speed) * 10;
      let actualSize = Number(size) * 2;
      let og = text.innerHTML
        .split(" ")
        .slice()
        .join(" ");
      let textArray = text.innerText.split(" ");
      let offset = 0;
      let temp = textArray[0];

      for (let i = 0; i < textArray.length; i++) {
        timeout = setTimeout(() => {
          text.innerHTML = textArray.join(" ");
          temp = textArray[i];
          textArray[
            i
          ] = `<center><mark style="background-color: pink; font-size: ${actualSize}px;"><strong>${textArray[i]}</strong></mark></center>`;
          text.innerHTML = textArray.join(" ");
          textArray[i] = temp;
        }, 0 + offset);
        offset += actualSpeed;
      }
      timeout2 = setTimeout(() => (text.innerHTML = og), offset);
    };

    document.addEventListener(
      "click",
      (read = () => {
        readEye(event.toElement);
      })
    );
  };
  console.log("DOM fully loaded and parsed");


  speedStep.addEventListener("click", function(eventIn) {
    speed = eventIn.toElement.valueAsNumber;
    setToLocals("speed", speed);
  });

  // make size persistent by setting it in store after change
  sizeStep.addEventListener("click", function(eventIn) {
    size = eventIn.toElement.valueAsNumber;
    setToLocals("size", size);
  });

  activate.addEventListener("click", async function(eventIn) {
 
    await chrome.tabs.query({ active: true, currentWindow: true }, function(
      tabs
    ) {
      chrome.tabs.executeScript(tabs[0].id, {
        code: 'if (read) document.removeEventListener("click",read)'
      });
    });

    await chrome.tabs.query({ active: true, currentWindow: true }, function(
      tabs
    ) {
      console.log(
        "activating script at ",
        speedStep.value,
        "and size ",
        sizeStep.value
      );
      chrome.tabs.executeScript(tabs[0].id, {
        code:
          "(" + chromeEye + ")(" + speedStep.value + "," + sizeStep.value + ")"
      });
    });
  });
  
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: 'if (read) document.removeEventListener("click",read)'
    });
  });
});
