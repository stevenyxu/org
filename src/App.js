import './App.css';
import Repos from './Repos.js';

function App() {
  return (
    <>
      <header className="App-header">
        <h1>Org viewer</h1>
        <span className="App-header-links">
          <a href="https://github.com/stevenyxu/org-viewer">code</a>
        </span>
      </header>
      <Repos></Repos>
    </>
  );
}

export default App;
