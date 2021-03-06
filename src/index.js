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

import "./index.css";
import { Room } from "./Room";
import { Home } from "./Home";
import reportWebVitals from "./reportWebVitals";

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

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/room/:id">
            <Room />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
