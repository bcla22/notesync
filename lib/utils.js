/**
 * Check whether a function is async
 * @param {function} funcToTest 
 * @returns {boolean}
 */
export function isAsyncFunction(funcToTest) {
  if (typeof funcToTest !== 'function') return false;
  return funcToTest.constructor.name === 'AsyncFunction';
}
