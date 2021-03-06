import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";

import { Room } from "./components/Room/Room";
import { Home } from "./components/Home/Home";
import { Header } from "./components/Layout/Header";
import { NotFound } from "./components/Layout/NotFound";
import reportWebVitals from "./reportWebVitals";
// eslint-disable-next-line no-unused-vars
import NormalizeCSS from "./assets/normalize.css";

const httpLink = new HttpLink({
  uri: "http://localhost:3001/graphql",
});
const wsLink = new WebSocketLink({
  uri: "ws://localhost:3001/graphql",
  options: { reconnect: true },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

const engine = new Styletron();

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <Router>
            <Header />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/room/:roomId">
                <Room />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </Router>
        </BaseProvider>
      </StyletronProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
