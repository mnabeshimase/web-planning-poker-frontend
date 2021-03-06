import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useParams } from "react-router";

import { Users } from "./Users";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $roomId: ID!) {
    createUser(name: $name, roomId: $roomId) {
      name
    }
  }
`;

export function Room() {
  const { roomId } = useParams();
  // TODO: Handle error state
  const { loading, data } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const [createUser] = useMutation(CREATE_USER_MUTATION);

  // TODO: add a form for user creation
  useEffect(() => {
    createUser({
      variables: { name: "user" + Date.now().toString(), roomId },
    });
  }, [createUser, roomId]);

  if (loading) {
    return <div className="App">Loading</div>;
  }

  return (
    <div className="App">
      <Users />
      {JSON.stringify(data)}
    </div>
  );
}
