import { Oval } from "svg-loaders-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RepoColorBarCell from "./RepoColorBarCell";
import RepoHeader from "./RepoHeader";

export default function Org(props) {
  const { org } = useParams();
  const [repos, setRepos] = useState([]);
  const [sortKey, setSortKey] = useState("forks");
  const [sortDesc, setSortDesc] = useState(true);
  const [maxForks, setMaxForks] = useState(Number.MAX_VALUE);
  const [maxStargazersCount, setMaxStargazersCount] = useState(
    Number.MAX_VALUE
  );
  const [maxOpenIssuesCount, setMaxOpenIssuesCount] = useState(
    Number.MAX_VALUE
  );
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [prefetchRepo, setPrefetchRepo] = useState(null);
  const [isPrefetching, setIsPrefetching] = useState(false);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(key !== "name");
    }
  }

  useEffect(() => {
    document.title = `${org} - Org viewer`;
  });

  useEffect(() => {
    setShowAll(false);
    setSortKey("forks");
    setSortDesc(true);
  }, [org]);

  useEffect(() => {
    async function prefetch() {
      if (isPrefetching || !prefetchRepo) return;
      const repo = prefetchRepo;
      setIsPrefetching(true);
      props.client.listBranches(repo["owner"]["login"], repo["name"]);
      await props.client.listCommits(
        repo["owner"]["login"],
        repo["name"],
        repo["default_branch"]
      );
      setIsPrefetching(false);
      if (prefetchRepo === repo) {
        setPrefetchRepo(null);
      }
    }

    if (!isPrefetching) {
      prefetch();
    }
  }, [props.client, prefetchRepo, isPrefetching]);

  useEffect(() => {
    setRepos([]);
    const promise = props.client.listRepos(org, sortKey, sortDesc);
    setIsPending(true);
    let cancelled = false;
    promise
      .then((repos) => {
        if (cancelled) return;
        setIsPending(false);
        let newMaxForks = 1;
        let newMaxStargazersCount = 1;
        let newMaxOpenIssuesCount = 1;
        repos.forEach((repo) => {
          if (repo["forks"] > newMaxForks) {
            newMaxForks = repo["forks"];
          }
          if (repo["stargazers_count"] > newMaxStargazersCount) {
            newMaxStargazersCount = repo["stargazers_count"];
          }
          if (repo["open_issues_count"] > newMaxOpenIssuesCount) {
            newMaxOpenIssuesCount = repo["open_issues_count"];
          }
        });
        setMaxForks(newMaxForks);
        setMaxStargazersCount(newMaxStargazersCount);
        setMaxOpenIssuesCount(newMaxOpenIssuesCount);
        setError(null);
        setRepos(repos.slice(0, showAll ? Number.MAX_VALUE : 100));
      })
      .catch((reason) => {
        if (cancelled) return;
        setIsPending(false);
        setError(reason);
      });

    return () => {
      cancelled = true;
    };
  }, [props.client, org, sortKey, sortDesc, showAll]);

  return (
    <>
      {isPending && (
        <div className="p-2 delay-fade">
          <Oval className="inline-block mr-2" stroke="#aaa"></Oval>
          loading... and caching results
        </div>
      )}
      <table className={`shadow bg-white relative ${isPending && "hidden"}`}>
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
            <RepoHeader
              displayName="Issues"
              sortKey="open_issues_count"
              toggleSort={toggleSort}
              sortAsc={sortKey === "open_issues_count" && !sortDesc}
              sortDesc={sortKey === "open_issues_count" && sortDesc}
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
                <td
                  aria-label={repo["name"]}
                  role="rowheader"
                  className="py-1 px-2 sm:px-4 w-40 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-140px sm:max-w-sm"
                  onMouseEnter={() => setPrefetchRepo(repo)}
                  onFocus={() => setPrefetchRepo(repo)}
                >
                  <Link
                    to={`/${repo["full_name"]}`}
                    className="hover:underline"
                  >
                    <span className="text-gray-400 hidden sm:inline">
                      {repo["full_name"].match(/[^/]*/)}/
                    </span>
                    {repo["name"]}
                  </Link>
                  &nbsp;
                  <a
                    href={repo["html_url"]}
                    className="inline-block hover:bg-gray-300 align-middle -mt-3 -mb-2 w-6 p-1 hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      viewBox="0 0 24 24"
                      className="block w-full"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                </td>
                <RepoColorBarCell
                  value={repo["forks"]}
                  max={maxForks}
                  barClass="bg-blue-100"
                ></RepoColorBarCell>
                <RepoColorBarCell
                  value={repo["stargazers_count"]}
                  max={maxStargazersCount}
                  barClass="bg-yellow-100"
                ></RepoColorBarCell>
                <RepoColorBarCell
                  link={`${repo["html_url"]}/issues`}
                  value={repo["open_issues_count"]}
                  max={maxOpenIssuesCount}
                  barClass="bg-red-100"
                ></RepoColorBarCell>
                <td aria-hidden="true" className="w-full"></td>
              </tr>
            );
          })}
          {error && (
            <tr className="bg-red-100">
              <td colSpan="100" className="py-1 px-2 sm:px-4">
                <span className="font-medium text-red-600">ERROR: </span>
                {error["status"] === 404
                  ? `${org} not found`
                  : JSON.stringify(error)}
              </td>
            </tr>
          )}
          {repos.length === 0 && (
            <tr className="bg-red-100">
              <td colSpan="100" className="py-1 px-2 sm:px-4">
                no repos found in {org}
              </td>
            </tr>
          )}
          {!error && !showAll && repos.length > 100 && (
            <tr>
              <td colSpan="100">
                <button
                  className="py-1 px-2 sm:px-4 hover:underline"
                  onClick={() => setShowAll(true)}
                >
                  show all (slow)
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
