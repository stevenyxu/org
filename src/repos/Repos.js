import { useEffect, useState } from "react";
import RepoHeader from "./RepoHeader";

export default function Repos(props) {
  const [repos, setRepos] = useState([]);
  const [sortKey, setSortKey] = useState("forks");
  const [sortDesc, setSortDesc] = useState(true);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  useEffect(() => {
    setRepos([]);
    const promise = props.client.getRepos(props.org, sortKey, sortDesc);
    // TODO: Guard against race condition.
    promise.then(setRepos);
  }, [props.client, props.org, sortKey, sortDesc]);

  return (
    <div className="shadow">
      <table className="bg-white relative">
        <thead>
          <tr>
            <RepoHeader
              displayName="Name"
              sortKey="name"
              toggleSort={toggleSort}
              sortAsc={sortKey === "name" && !sortDesc}
              sortDesc={sortKey === "name" && sortDesc}
            ></RepoHeader>
            <RepoHeader
              displayName="Forks"
              sortKey="forks"
              toggleSort={toggleSort}
              sortAsc={sortKey === "forks" && !sortDesc}
              sortDesc={sortKey === "forks" && sortDesc}
            ></RepoHeader>
            <RepoHeader
              displayName="Stars"
              sortKey="stargazers_count"
              toggleSort={toggleSort}
              sortAsc={sortKey === "stargazers_count" && !sortDesc}
              sortDesc={sortKey === "stargazers_count" && sortDesc}
            ></RepoHeader>
            <th
              className="bg-gray-200 w-full sticky top-0"
              aria-hidden="true"
            ></th>
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
                <td className="py-1 px-4">{repo["forks"]}</td>
                <td className="py-1 px-4">{repo["stargazers_count"]}</td>
                <td aria-hidden="true" className="w-full"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
