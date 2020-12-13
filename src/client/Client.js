import { Octokit } from "@octokit/rest";
import cache from "./cache";

export default class Client {
  constructor() {
    this.octokit = new Octokit({
      auth: "c686a9edeb05528cae1bf4adf12be8513b85395e",
    });
  }

  async getRepos(org) {
    return cache(`getRepos(${org})`, () =>
      this.octokit.paginate("GET /orgs/{org}/repos", { org })
    );
  }
}
