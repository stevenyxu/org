import { useState } from "react";
import Client from "./client/Client.js";
import Repos from "./repos/Repos.js";

function App() {
  const [org, setOrg] = useState("netflix");
  const client = new Client();

  return (
    <>
      <header className="bg-gray-800 flex items-center justify-between px-2 py-1">
        <h1 className="text-white">Org viewer</h1>
        <select value={org} onChange={(e) => setOrg(e.target.value)}>
          <option value="netflix">netflix</option>
          <option value="facebook">facebook</option>
          <option value="github">github</option>
        </select>
        <a
          className="text-gray-300"
          href="https://github.com/stevenyxu/org-viewer"
        >
          code
        </a>
      </header>
      <main className="p-2">
        <Repos client={client} org={org}></Repos>
      </main>
    </>
  );
}

export default App;
