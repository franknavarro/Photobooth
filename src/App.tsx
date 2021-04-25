import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AppSetup from './pages/AppSetup';
import Settings from './pages/Settings/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/">
          <AppSetup />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
