import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
    }
  }
`;

export function Room() {
  const { id } = useParams();
  // TODO: Handle error state
  const { loading, data } = useQuery(ROOM_QUERY, {
    variables: { id },
  });

  if (loading) {
    return <div className="App">Loading</div>;
  }

  return <div className="App">{JSON.stringify(data)}</div>;
}
