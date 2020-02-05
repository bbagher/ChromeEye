window.addEventListener('DOMContentLoaded', (event) => {
  
  let activate = document.getElementById('checkbox');
;
  chrome.storage.local.get(['activate'], function(result) {
    let activateRes = result.activate
    if (activateRes) activate.checked = activateRes 
    else activate.checked = false
       });
  chrome.storage.local.get(['size'], function(result) {
    let sizeRes = result.size
    if (sizeRes) sizeStep.value = sizeRes
    else sizeStep.value = 50
       }); 
  chrome.storage.local.get(['speed'], function(result) {
      let speedRes = result.speed
      if (speedRes) speedStep.value = speedRes 
       });


  const chromeEye = (speed, size) => {
    const readEye = (text) => { 
      let actualSpeed = Number(speed) * 10
      let actualSize = 2 * Number(size)
      console.log('actual size ', actualSize)
      console.log('actual speed ', actualSpeed)
      console.log(actualSpeed)
      let og = text.innerHTML.split(' ').slice().join(' ')
      let textArray = text.innerText.split(' ');
      console.log(textArray);
      let offset = 0;
      let temp = textArray[0];
      
      
      for (let i = 0; i < textArray.length; i++) {
        timeout = setTimeout(() => {
          text.innerHTML = textArray.join(' ');
          temp = textArray[i];
          textArray[i] = `<mark style="background-color: yellow; font-size: ${actualSize}px;"><strong>${textArray[i]}</strong></mark>`;
          text.innerHTML = textArray.join(' ');
          console.log(textArray)
          textArray[i] = temp;
        }, 0 + offset);
        offset += actualSpeed;
        
      }
      setTimeout(() => text.innerHTML = og, offset)
    };
    
    
    
    document.addEventListener("click", read = () => {
      readEye(event.toElement)
    })
    
    
  }
  console.log('DOM fully loaded and parsed');
  
  let speedStep = document.getElementById('speed');
  let sizeStep = document.getElementById('size');
    
  let speed = 50
  let size = 50;
  let count = 0;
    
    speedStep.addEventListener("click", function(eventIn) {
      speed = eventIn.toElement.valueAsNumber
      chrome.storage.local.set({speed: speed}, function() {
        console.log('Value is set to ' + speed);
      });  
    })
    
    
    sizeStep.addEventListener("click", function(eventIn) {
      size = eventIn.toElement.valueAsNumber    
      chrome.storage.local.set({size: size}, function() {
        console.log('Value is set to ' + size);
      });
    })
      
      activate.addEventListener("click", function(eventIn) {
      count += 1;        
      console.log(count)
      if (count % 2 !== 0) {

        chrome.storage.local.set({activate: true}, function() {
          console.log('Value is set to ' + true);
        });
          
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
              tabs[0].id,
              {code : '('+chromeEye+')('+speed+','+size+')'}
              );
            })
            
          }
          else {
            

        chrome.storage.local.set({activate: false}, function() {
          console.log('Value is set to ' + false);
        });
              chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                  chrome.tabs.executeScript(
                tabs[0].id,
                {code : 'if (read) document.removeEventListener("click",read)'}
                );
              })
            }
          
          }    
          )
        });