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
        <div className="rounded-lg overflow-hidden shadow">
            <table className="bg-white">
                <thead>
                    <tr className="text-left bg-gray-200 uppercase text-gray-500 text-xs">
                        <th className="font-medium py-1 px-4">ID</th>
                        <th className="font-medium py-1 px-4">Name</th>
                        <th aria-hidden="true" className="w-full"></th>
                    </tr>
                </thead>
                <tbody>
                    {repos.map((repo) => {
                        return (
                            <tr key={repo['id']}>
                                <td className="py-1 px-4">{repo['id']}</td>
                                <td className="py-1 px-4 w-1/2">{repo['name']}</td>
                                <td aria-hidden="true" className="w-full"></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}