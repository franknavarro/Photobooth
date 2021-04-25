import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AppSetup from './pages/AppSetup';
import Settings from './pages/Settings/Settings';
import useStore from './hooks/useStore';

const App = () => {
  const [store] = useStore();
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/settings">
          <Settings store={store} />
        </Route>
        <Route path="/">
          <AppSetup store={store} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
