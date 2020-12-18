import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Commits from "./Commits";

export default function Repo(props) {
  const { org, repo } = useParams();
  const [repoInfo, setRepoInfo] = useState({});
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState("");
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    document.title = `${org}/${repo} - Org viewer`;
  });

  useEffect(() => {
    props.client.getRepo(org, repo).then(setRepoInfo);
  }, [org, repo, props.client]);

  useEffect(() => {
    props.client.listBranches(org, repo).then((branches) => {
      branches.forEach((branch) => {
        if (branch["default"]) {
          setActiveBranch(branch["name"]);
        }
      });
      setBranches(branches);
    });
  }, [org, repo, props.client]);

  useEffect(() => {
    if (!activeBranch) return;
    setCommits([]);
    props.client.listCommits(org, repo, activeBranch).then((commits) => {
      setCommits(commits);
    });
  }, [org, repo, props.client, activeBranch]);

  return (
    <>
      <Link
        to={`/${org}`}
        className="hover:underline text-sm bg-gray-200 px-3 rounded-md"
      >
        ← back to {org}
      </Link>
      <div className="mt-2 mb-2">
        <h1 className="text-2xl font-medium inline">
          <span className="text-gray-400">{org}/</span>
          {repo}
        </h1>{" "}
        <a
          href={repoInfo["html_url"]}
          className="inline-block hover:bg-gray-300 align-middle -mt-2 w-7 p-1 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            viewBox="0 0 24 24"
            className="block w-full"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>{" "}
        <select
          onChange={(e) => setActiveBranch(e.target.value)}
          value={activeBranch}
        >
          {branches.map((branch) => (
            <option key={branch["name"]} value={branch["name"]}>
              {branch["name"]}
            </option>
          ))}
        </select>
      </div>
      <Commits commits={commits}></Commits>
    </>
  );
}
