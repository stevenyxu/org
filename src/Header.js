import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Client from "./client/Client";

export default function Header(props) {
  const [rateLimit, setRateLimit] = useState(Client.DEFAULT_RATE_LIMIT);
  useEffect(() => {
    const sub = props.client.rateLimitSubscribe(setRateLimit);
    return () => {
      sub.unsubscribe();
    };
  }, [props.client]);
  const { org } = useParams();
  const history = useHistory();

  function handleSelect(value) {
    if (org === value) return;
    history.push(`/${value}`);
  }

  return (
    <header className="bg-gray-800 flex items-center px-2 py-1">
      <h1 className="text-white mr-2">Org viewer</h1>
      <select value={org} onChange={(e) => handleSelect(e.target.value)}>
        <option value="Netflix">Netflix</option>
        <option value="facebook">facebook</option>
        <option value="github">github</option>
        <option value="Microsoft">microsoft</option>
        <option value="apache">apache</option>
      </select>
      <span className="flex-grow"></span>
      <abbr
        class="text-gray-300 no-underline mr-2"
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
