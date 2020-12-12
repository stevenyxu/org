import Client from './client/Client.js';
import {useEffect, useState} from 'react';

export default function Repos(props) {
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        const promise = Client.getRepos(props.orgId)
        // TODO: Guard against race condition.
        promise.then(setRepos);
    }, [props.orgId]);

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {repos.map((repo) => {
                    return (
                        <tr key={repo['id']}>
                            <td>{repo['id']}</td>
                            <td>{repo['name']}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}