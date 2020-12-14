import { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import Client from "./client/Client";

const ORGS_SET = new Set([
  "kubernetes",
  "freeCodeCamp",
  "square",
  "google",
  "facebook",
  "apache",
  "alibaba",
  "vuejs",
  "Tencent",
  "github",
  "airbnb",
  "fossasia",
  "symfony",
  "angular",
  "facebookresearch",
  "facebookarchive",
  "dotnet",
  "mozilla",
  "shadowsocks",
  "zeit",
  "twbs",
  "hashicorp",
  "shadowsocks",
  "Netflix",
  "microsoft",
  "tensorflow",
]);

export default function Header(props) {
  const history = useHistory();
  const { org } = useParams();
  const [rateLimit, setRateLimit] = useState(Client.DEFAULT_RATE_LIMIT);

  useEffect(() => {
    const sub = props.client.rateLimitSubscribe(setRateLimit);
    return () => {
      sub.unsubscribe();
    };
  }, [props.client]);

  let matchedOrg = null;
  ORGS_SET.forEach((setOrg) => {
    if (setOrg.toLowerCase() === org.toLowerCase()) {
      matchedOrg = setOrg;
    }
  });
  if (matchedOrg && matchedOrg !== org) {
    return <Redirect to={`/${matchedOrg}`}></Redirect>;
  } else {
    ORGS_SET.add(org);
  }

  async function handleAdd() {
    const org = prompt('Organization id (e.g. "kubernetes")');
    history.push(`/${org}`);
  }

  function handleSelect(value) {
    if (org === value) return;
    history.push(`/${value}`);
  }

  return (
    <header className="bg-gray-800 flex items-center px-2 py-1">
      <h1 className="text-white mr-2">Org viewer</h1>
      <select
        value={org}
        onChange={(e) => handleSelect(e.target.value)}
        className="mr-2"
      >
        {Array.from(ORGS_SET).map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>
      <button
        onClick={() => handleAdd()}
        className="text-white hover:underline"
      >
        add
      </button>
      <span className="flex-grow"></span>
      <abbr
        className="text-gray-300 no-underline mr-2"
        title="Rate limit remaining"
      >
        {rateLimit.remaining}/{rateLimit.limit}
      </abbr>
      <a
        className="text-gray-300 hover:underline"
        href="https://github.com/stevenyxu/org-viewer"
      >
        source code
      </a>
    </header>
  );
}
