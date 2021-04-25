import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AppSetup from './pages/AppSetup';
import Settings from './pages/Settings';
import useStore from './hooks/useStore';

const App = () => {
  const [store] = useStore();
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/settings">
          <Settings initialStore={store} />
        </Route>
        <Route path="/">
          <AppSetup store={store} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
