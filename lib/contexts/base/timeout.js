

module.exports = () => {
  const
    timeoutIdSymbol = Symbol();

  function cancel() {
    const timeoutId = this[timeoutIdSymbol];
    if (timeoutId) {
      clearTimeout(timeoutId);
      this[timeoutIdSymbol] = null;
    }
  }

  function cancelDecorator(fn) {
    if (fn instanceof Array) {
      return fn.map(cancelDecorator, this);
    }

    const timeoutHandler = this;
    return function(...values) {
      cancel.call(timeoutHandler);
      return fn.apply(this, values);
    }
  }

  function timeout(delay, fn) {

    if (typeof delay == 'function') {
      [ fn, delay ] = [ delay, fn ];
    }

    let timeoutId;
    let handler = new Promise((resolve) => {
      timeoutId = setTimeout(
        () => {
          handler[timeoutIdSymbol] = null;
          resolve();
        },
        delay
      );
    });
    handler[timeoutIdSymbol] = timeoutId;

    if (fn) {
      handler.then(fn);
    }

    handler.cancel = cancel;
    handler.cancelDecorator = cancelDecorator;

    return handler;

  }

  return timeout;

};
