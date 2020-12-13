import { useEffect, useState } from "react";

export default function Repos(props) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    setRepos([]);
    const promise = props.client?.getRepos(props.org);
    // TODO: Guard against race condition.
    promise.then(setRepos);
  }, [props.client, props.org]);

  return (
    <div className="shadow">
      <table className="bg-white relative">
        <thead>
          <tr className="text-left uppercase text-gray-500 text-xs">
            <th className="bg-gray-200 font-medium py-1 px-4 sticky top-0">Name</th>
            <th className="bg-gray-200 font-medium py-1 px-4 sticky top-0">Forks</th>
            <th className="bg-gray-200 font-medium py-1 px-4 sticky top-0">Stars</th>
            <th className="bg-gray-200 w-full sticky top-0" aria-hidden="true"></th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo) => {
            return (
              <tr key={repo["id"]} className="hover:bg-gray-100">
                <td className="py-1 px-4 w-1/2">
                  <a href={repo["html_url"]} className="hover:underline">
                    <span className="text-gray-400">{props.org}/</span>
                    {repo["name"]}
                  </a>
                </td>
                <td className="py-1 px-4">
                  <a href={repo["forks_url"]} className="hover:underline">{repo["forks"]}</a>
                </td>
                <td className="py-1 px-4">
                  <a href={repo["stargazers_url"]} className="hover:underline">
                    {repo["stargazers_count"]}
                  </a>
                </td>
                <td aria-hidden="true" className="w-full"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
