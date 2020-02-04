let speed = 2500;
// speed = prompt("What speed would you like to read?");
console.log("user input speed", speed);
let color = "yellow";
// color = prompt("What is your favorite color?");
let fontsize = "100px";
// fontsize = prompt("How large would you like your text?");
let timeout;

const chromeEye = text => { 
  let og = text.innerHTML.split(' ').slice().join(' ')
  let textArray = text.innerText.split(' ');
  console.log(textArray);
  let offset = 0;
  let temp = textArray[0];
  

  for (let i = 0; i < textArray.length; i++) {
    timeout = setTimeout(() => {
      text.innerHTML = textArray.join(' ');
      temp = textArray[i];
      textArray[i] = `<mark style="background-color: ${color}; font-size: ${fontsize}px;"><strong>${textArray[i]}</strong></mark>`;
      text.innerHTML = textArray.join(' ');
      console.log(textArray)
      textArray[i] = temp;
    }, 0 + offset);
    offset += 500;
  
  }
  setTimeout(() => text.innerHTML = og, offset)
};

document.addEventListener("click", async () => {
  console.log(event.toElement.textContent);

  chromeEye(event.toElement)
});
