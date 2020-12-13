import { Octokit } from "@octokit/rest";
import cache from "./cache";

export default class Client {
  constructor() {
    this.octokit = new Octokit({
      auth: "c686a9edeb05528cae1bf4adf12be8513b85395e",
    });
  }

  async getRepos(org, sortKey, sortDesc) {
    const repos = await cache(`getRepos(${org})`, () =>
      this.octokit.paginate("GET /orgs/{org}/repos", { org })
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
