import * as React from "react";
import { render } from "react-dom";
import { Loading } from "./components/loading";
import { Ioc, I18n } from "./config";

const FormComponent = React.lazy(() => import('./components/form/Form'));

export const App = () => {
  return (
      <div className="App">
        <React.Suspense fallback={<Loading />}>
          <FormComponent />
        </React.Suspense>
      </div>
  );
}

I18n.config()
Ioc.containerBuilder();
const rootElement = document.getElementById("root");
render(<App />, rootElement);
