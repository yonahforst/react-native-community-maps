export default url => new Promise((resolve, reject) => {
  var xhr = new XMLHttpRequest();
  xhr.onerror = reject;
  xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
          resolve(xhr.response);
      }
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob'; // convert type
  xhr.send();
})