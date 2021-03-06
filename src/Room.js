import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";

import { Users } from "./Users";
import { Hand } from "./Hand";

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
      id
      name
    }
  }
`;
const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export function Room() {
  const { roomId } = useParams();
  // TODO: Handle error state
  const { loading, data } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const [createUser, { data: createUserData }] = useMutation(
    CREATE_USER_MUTATION
  );
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
    if (createUserData) {
      function onUnmount() {
        const {
          createUser: { id },
        } = createUserData;
        return deleteUser({ variables: { id } });
      }
      window.addEventListener("beforeunload", onUnmount);
      return () => window.removeEventListener("beforeunload", onUnmount);
    }
  }, [createUserData, deleteUser]);

  if (loading) {
    return <div className="App">Loading</div>;
  }

  return (
    <div className="App">
      {JSON.stringify(data)}
      <Users />
      <Hand />
    </div>
  );
}
