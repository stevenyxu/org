import { Octokit } from '@octokit/rest';

export default class Client {
    constructor() {
        this.octokit = new Octokit({
            auth: 'c686a9edeb05528cae1bf4adf12be8513b85395e',
        });
    }

    async getRepos(org) {
        const response = await this.octokit.paginate('GET /orgs/{org}/repos', {
            org,
        });
        return response;
    }
}