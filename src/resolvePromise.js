// js like in dinnerplanner
export function resolvePromise(promise, promiseState) {
  promiseState.promise = promise;
  promiseState.data = null;
  promiseState.error = null;

  function successACB(result) {
    if (promiseState.promise === promise) {
      promiseState.data = result;
    }
  }

  function failureACB(error) {
    promiseState.error = error;
  }

  if (promise) {
    promise.then(successACB).catch(failureACB);
  }
}
