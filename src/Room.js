import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
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
const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($name: String!, $roomId: ID!) {
    deleteUser(name: $name, roomId: $roomId) {
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
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const userName = useRef("user" + Date.now().toString());

  // TODO: add a form for user creation
  useEffect(() => {
    createUser({
      variables: { name: userName.current, roomId },
    });
  }, [createUser, roomId]);

  // Remove user from the room on unmount
  useEffect(() => {
    function onUnmount() {
      return deleteUser({ variables: { name: userName.current, roomId } });
    }
    window.addEventListener("beforeunload", onUnmount);
    return () => window.removeEventListener("beforeunload", onUnmount);
  }, [deleteUser, roomId]);

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
