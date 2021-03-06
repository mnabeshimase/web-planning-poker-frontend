import { gql, useQuery } from "@apollo/client";

import "./App.css";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
    }
  }
`;

function App() {
  const { loading, data } = useQuery(ROOM_QUERY, {
    variables: { id: "abc" },
  });

  if (loading) {
    return <div className="App">Loading</div>;
  }

  return <div className="App">{JSON.stringify(data)}</div>;
}

export default App;
