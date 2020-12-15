import Client from "./client/Client.js";
import Header from "./Header.js";
import Org from "./org/Org.js";
import Repo from "./repo/Repo.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const client = new Client();

  return (
    <Router>
      <Route path="/:org">
        <Header client={client}></Header>
      </Route>
      <main className="sm:p-2">
        <Switch>
          <Route exact path="/">
            <Redirect to="/kubernetes"></Redirect>
          </Route>
          <Route exact path="/:org">
            <Org client={client}></Org>
          </Route>
          <Route exact path="/:org/:repo">
            <Repo client={client}></Repo>
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
