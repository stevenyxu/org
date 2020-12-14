import { Octokit } from "@octokit/rest";
import cache from "./cache";

class Client {
  constructor() {
    this.octokit = new Octokit({
      auth: "c686a9edeb05528cae1bf4adf12be8513b85395e",
    });
    this.lastRateLimit = Client.DEFAULT_RATE_LIMIT;
    this.updateRateLimit();
    this.rateLimitSubscriptions = new Set();
  }

  /**
   * Subscribes to future rate limit updates. The callback function is
   * immediately called with the most recent known rate limit remaining.
   *
   * @param {*} fn Callback function called with updates to the rate limit.
   * @returns {unsubscribe: Function<void>}
   */
  rateLimitSubscribe(fn) {
    this.rateLimitSubscriptions.add(fn);
    fn(this.lastRateLimit);
    return {
      unsubscribe: () => {
        this.rateLimitSubscriptions.delete(fn);
      },
    };
  }

  /**
   * Calls the contained function and calls updateRateLimit.
   *
   * @param {*} fn
   */
  async rateLimitWrap(fn) {
    const res = await fn();
    this.updateRateLimit();
    return res;
  }

  /**
   * Gets the latest rate limit and if changed emits to the subscribers.
   */
  async updateRateLimit() {
    const res = await this.octokit.rateLimit.get();
    if (res.status !== 200) {
      console.error("Failed to get rate limit", res);
      return;
    }
    const limit = res.data.rate;
    if (limit !== this.lastRateLimit) {
      this.lastRateLimit = limit;
      this.rateLimitSubscriptions.forEach((fn) => {
        fn(this.lastRateLimit);
      });
    }
  }

  async getRepos(org, sortKey, sortDesc) {
    const repos = await cache(`getRepos(${org.toLowerCase()})`, () =>
      this.rateLimitWrap(() =>
        this.octokit.paginate("GET /orgs/{org}/repos", { org, per_page: 100 })
      )
    );
    return repos.sort((a, b) => {
      let res;
      if (a[sortKey] < b[sortKey]) {
        res = -1;
      } else if (a[sortKey] > b[sortKey]) {
        res = 1;
      } else {
        res = 0;
      }
      return sortDesc ? -res : res;
    });
  }
}

Client.DEFAULT_RATE_LIMIT = { remaining: 5000, limit: 5000 };

export default Client;
