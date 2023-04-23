async function writein(element, value) {
    var origin_text = value;
    element.innerHTML = "";
    return await new Promise(resolve => {
        const interval = setInterval(() => {
        element.innerHTML += origin_text[element.innerHTML.length]; 
          if (element.innerHTML.length == origin_text.length) {
            resolve('foo');
            clearInterval(interval);
          };
        }, 100);
    });
}