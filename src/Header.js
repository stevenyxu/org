import { useHistory, useParams } from "react-router-dom";

export default function Header(props) {
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
        <option value="netflix">netflix</option>
        <option value="facebook">facebook</option>
        <option value="github">github</option>
      </select>
      <span className="flex-grow"></span>
      <a
        className="text-gray-300"
        href="https://github.com/stevenyxu/org-viewer"
      >
        code
      </a>
    </header>
  );
}
