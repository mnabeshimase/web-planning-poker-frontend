import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom {
    createRoom {
      id
    }
  }
`;

export const Home = () => {
  const history = useHistory();
  // TODO: Handle loading and error state
  const [createRoom, { data }] = useMutation(CREATE_ROOM_MUTATION);

  useEffect(() => {
    if (data) {
      const {
        createRoom: { id },
      } = data;
      const roomRoute = ["room", id].join("/");
      return history.push(roomRoute);
    }
  }, [data, history]);

  return <button onClick={() => createRoom()}>Create Room</button>;
};
