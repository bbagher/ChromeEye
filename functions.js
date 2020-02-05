  // update values in locals
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


  // this is it
const chromeEye = (speed, size) => {
    // where all magic happens 
    const readEye = text => {
      // user inputs
      let actualSpeed = Number(speed) * 10;
      let actualSize = Number(size) * 2;
      let og = text.innerHTML
        .split(" ")
        .slice()
        .join(" ");
      let textArray = text.innerText.split(" ");
      let offset = 0;
      let temp = textArray[0];
      // iterate through array of words and increasing timeout for each word (taming async)
      for (let i = 0; i < textArray.length; i++) {
        timeout = setTimeout(() => {
          text.innerHTML = textArray.join(" ");
          temp = textArray[i];
          textArray[
            i
          ] = `<center><mark style="background-color: ${color}; font-size: ${actualSize}px;"><strong>${textArray[i]}</strong></mark></center>`;
          text.innerHTML = textArray.join(" ");
          textArray[i] = temp;
        }, 0 + offset);
        offset += actualSpeed;
      }
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

// module.exports = { updateLocals, setToLocals, chromeEye}