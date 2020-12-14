import { get, set } from "idb-keyval";

const pending = {};
const VERSION = 1;
const TTL = 60 * 60 * 1000; // 1 hour

/**
 * Executes and returns the result from fn. But if a past call has been made
 * with the same key, fn is ignored and this effectively merges paths with the
 * past call.
 *
 * Results are cached in IndexedDB. In-flight requests are stored in memory.
 *
 * @param {string} key Globally unique cache key.
 * @param {Function<Promise<IDBValidKey>>} fn Async function that returns a
 * IDB-storable result.
 */
export default function cache(key, fn) {
  if (pending[key]) {
    return pending[key];
  }
  pending[key] = new Promise(async (resolve, reject) => {
    const cachedRes = await get(key);
    if (
      cachedRes &&
      cachedRes.version === VERSION &&
      new Date() - cachedRes.timestamp < TTL
    ) {
      resolve(cachedRes.value);
      return;
    }
    let value;
    try {
      value = await fn();
    } catch (e) {
      reject(e);
      return;
    }
    const timestamp = new Date();
    await set(key, { value, version: VERSION, timestamp });
    delete pending[key];
    resolve(value);
  });
  return pending[key];
}
