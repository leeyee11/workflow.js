export const createObserver = function () {
  const observeMap: Map<string, Function> = new Map();

  function fire(transition: Transition, data: BaseData) {
    const transitionKey = `${transition.name}:${transition.stage}`;
    [transition.name, transition.stage, transitionKey]
      .forEach((key) => {
        if (observeMap.get(key)) {
          observeMap.get(key).call(data.pointer, data.content);
        }
      });
  }

  function observe(transition: Transition, fn: Function) {
    const key = transition.name && transition.stage
      ? `${transition.name}:${transition.stage}`
      : !!transition.name
        ? transition.name
        : !!transition.stage
          ? transition.stage
          : null;
    if(key) {
      observeMap.set(key, fn);
    } else {
      throw new Error(`Transition name or stage can\'t be both null ,\n transition: ${JSON.stringify(transition)}`)
    }
  }

  function remove(transition: Transition) {
    const transitionKey = `${transition.name}:${transition.stage}`;
    observeMap.delete(transitionKey);
  }

  return {
    fire,
    observe,
    remove
  }
}
