import { Provider } from "react-redux";

import { LandingPage } from "./LandingPage/LandingPage";
import FileExplorer from "./components/FileExplorer";

import store from "./redux/store";

import "./App.css";

console.log(import.meta.env.VITE_DUMMY_ENV_VAR, "env var");

const SHOW_FILE_EXPLORER = false;

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <div>
        {SHOW_FILE_EXPLORER ? <FileExplorer /> : <LandingPage />}        
      </div>
    </Provider>
  );
}

export default App;
