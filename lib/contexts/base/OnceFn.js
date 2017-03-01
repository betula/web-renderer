
module.exports = () => {

  return (fn) => {
    let called = false;
    return () => {
      if (!called) {
        called = true;
        fn()
      }
    }
  }

};