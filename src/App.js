import Repos from './Repos.js';

function App() {
  return (
    <>
      <header className="bg-gray-800 flex items-center justify-between px-2 py-1">
        <h1 className="text-white">Org viewer</h1>
        <a className="text-gray-300" href="https://github.com/stevenyxu/org-viewer">code</a>
      </header>
      <main className="p-2">
        <Repos></Repos>
      </main>
    </>
  );
}

export default App;
