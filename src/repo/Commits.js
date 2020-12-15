import { format } from "timeago.js";

const CELL_CLASS = "py-1 sm:px-2";

export default function Commits(props) {
  return (
    <table className={`shadow bg-white relative w-full`}>
      <thead>
        <tr>
          <th
            className={`text-left bg-gray-200 ${CELL_CLASS} sticky top-0 z-10`}
          >
            SHA
          </th>
          <th
            className={`text-left bg-gray-200 ${CELL_CLASS} sticky top-0 z-10`}
          >
            Message
          </th>
          <th
            className={`text-left bg-gray-200 ${CELL_CLASS} sticky top-0 z-10`}
          >
            Author
          </th>
          <th
            className={`text-left bg-gray-200 ${CELL_CLASS} sticky top-0 z-10`}
          >
            Time
          </th>
        </tr>
      </thead>
      <tbody>
        {props.commits.map((commit) => (
          <tr key={commit["sha"]}>
            <td className={CELL_CLASS}>
              <a
                className="font-mono hover:underline"
                href={commit["html_url"]}
              >
                {commit["sha"].substr(0, 6)}
              </a>
            </td>
            <td className={`${CELL_CLASS} break-words text-sm sm:text-base`}>
              {commit["commit"]["message"].match(/[^\n]{0,100}/)}
            </td>
            <td className={`${CELL_CLASS} truncate`}>
              {commit["author"] ? (
                <>
                  <img
                    alt=""
                    className="w-6 inline"
                    src={commit["author"]["avatar_url"]}
                  ></img>
                  &nbsp;
                  {commit["author"]["login"]}
                </>
              ) : (
                commit["commit"]["author"]["name"]
              )}
            </td>
            <td className={`${CELL_CLASS} whitespace-nowrap`}>
              {format(new Date(commit["commit"]["committer"]["date"]))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
