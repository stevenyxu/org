export default class Client {
    static async getRepos(orgId) {
        return [
            {
                'id': 12345,
                'name': 'My-first-repo',
            },
            {
                'id': 23456,
                'name': 'My-second-repo',
            }
        ];
    }
}