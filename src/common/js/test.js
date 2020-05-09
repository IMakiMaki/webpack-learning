(function () {
  let arr = [];
  let a = '12';
  Object.keys((windows) => (key) => {
    if (a !== key) {
      arr.push(key);
    }
  });
  console.log('this is a message coming from the test.js' + JSON.stringify(arr));
})();
