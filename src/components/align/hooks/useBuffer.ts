export default (
  callback: (force?: boolean) => boolean,
  buffer: number | undefined
) => {
  let calledRef = false;
  let timeoutRef: any;

  function cancelTrigger() {
    clearTimeout(timeoutRef);
  }

  function trigger(force?: boolean) {
    cancelTrigger();

    if (!calledRef || force === true) {
      if (callback(force) === false) {
        // Not delay since callback cancelled self
        return;
      }

      calledRef = true;
      timeoutRef = setTimeout(() => {
        calledRef = false;
      }, buffer);
    } else {
      timeoutRef = setTimeout(() => {
        calledRef = false;
        trigger();
      }, buffer);
    }
  }

  return [
    trigger,
    () => {
      calledRef = false;
      cancelTrigger();
    },
  ];
};
