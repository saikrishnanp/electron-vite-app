import { Provider } from "react-redux";

import { LandingPage } from "./LandingPage/LandingPage";

import store from "./redux/store";

import "./App.css";

console.log(import.meta.env.VITE_DUMMY_ENV_VAR, "env var");

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <LandingPage />
    </Provider>
  );
}

export default App;
