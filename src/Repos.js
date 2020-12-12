import Client from './client/Client.js';
import {useEffect, useState} from 'react';

export default function Repos(props) {
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        let cancelled = false;
        Client.getRepos(props.orgId).then((repos) => {
            if (cancelled) return;
            setRepos(repos);
        });
        return () => {
            cancelled = true;
        }
    })

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
                        <tr>
                            <td>{repo['id']}</td>
                            <td>{repo['name']}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}