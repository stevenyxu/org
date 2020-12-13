import { useEffect, useState } from "react";
import RepoHeader from "./RepoHeader";

export default function Repos(props) {
  const [repos, setRepos] = useState([]);
  const [sortKey, setSortKey] = useState("forks");
  const [sortDesc, setSortDesc] = useState(true);
  const [maxForks, setMaxForks] = useState(Number.MAX_VALUE);
  const [maxStargazersCount, setMaxStargazersCount] = useState(
    Number.MAX_VALUE
  );

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(key !== "name");
    }
  }

  useEffect(() => {
    setRepos([]);
    const promise = props.client.getRepos(props.org, sortKey, sortDesc);
    // TODO: Guard against race condition.
    promise.then((repos) => {
      setRepos(repos);
      let newMaxForks = 1;
      let newMaxStargazersCount = 1;
      repos.forEach((repo) => {
        if (repo["forks"] > newMaxForks) {
          newMaxForks = repo["forks"];
        }
        if (repo["stargazers_count"] > newMaxStargazersCount) {
          newMaxStargazersCount = repo["stargazers_count"];
        }
      });
      setMaxForks(newMaxForks);
      setMaxStargazersCount(newMaxStargazersCount);
    });
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
                <td className="py-1 px-4 relative z-0">
                  <span
                    className="absolute bg-blue-100 top-0 left-0 h-full"
                    style={{
                      width:
                        (100 * Math.sqrt(repo["forks"])) / Math.sqrt(maxForks) +
                        "%",
                    }}
                  ></span>
                  <span className="relative z-10">{repo["forks"]}</span>
                </td>
                <td className="py-1 px-4 relative z-0">
                  <span
                    className="absolute bg-yellow-100 top-0 left-0 h-full"
                    style={{
                      width:
                        (100 * Math.sqrt(repo["stargazers_count"])) /
                          Math.sqrt(maxStargazersCount) +
                        "%",
                    }}
                  ></span>
                  <span className="relative z-10">
                    {repo["stargazers_count"]}
                  </span>
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
