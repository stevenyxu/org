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

  getRepo(org, repo) {
    return cache(`getRepo(${org},${repo})`, async () => {
      const res = await this.octokit.repos.get({ owner: org, repo });
      return res.data;
    });
  }

  async listBranches(org, repo) {
    const repoInfo = await this.getRepo(org, repo);
    const defaultBranch = repoInfo["default_branch"];
    const branches = await cache(`listBranches(${org},${repo})`, async () => {
      const res = await this.octokit.paginate(
        "GET /repos/{owner}/{repo}/branches",
        {
          owner: org,
          repo,
        }
      );
      this.updateRateLimit();
      return res;
    });
    branches.forEach((branch) => {
      if (branch["name"] === defaultBranch) {
        branch["default"] = true;
      }
    });
    return branches;
  }

  async listCommits(org, repo, branch) {
    return cache(`listCommits(${org},${repo},${branch})`, async () => {
      const res = await this.octokit.repos.listCommits({
        owner: org,
        repo,
        sha: branch,
      });
      this.updateRateLimit();
      return res.data;
    });
  }

  async listRepos(org, sortKey, sortDesc) {
    const repos = await cache(`listRepos(${org})`, async () => {
      const res = await this.octokit.paginate("GET /orgs/{org}/repos", {
        org,
        per_page: 100,
      });
      this.updateRateLimit();
      return res;
    });
    if (!sortKey) return repos;
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
