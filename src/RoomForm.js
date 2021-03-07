import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { styled } from "baseui";

const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom {
    createRoom {
      id
    }
  }
`;

const Outline = styled("div", ({ $theme }) => ({
  ...$theme.borders.border600,
  padding: $theme.sizing.scale800,
  width: "28em",
}));

const ActionsPanel = styled("div", {
  display: "flex",
  direction: "column",
  justifyContent: "flex-end",
});

export const RoomForm = () => {
  const history = useHistory();
  // TODO: Handle loading and error state
  const [createRoom, { data }] = useMutation(CREATE_ROOM_MUTATION);
  const [userName, setUserName] = useState();

  useEffect(() => {
    if (data) {
      const {
        createRoom: { id },
      } = data;
      const roomRoute = ["room", id].join("/");
      return history.push(roomRoute);
    }
  }, [data, history]);

  return (
    <Outline>
      <FormControl label="Username">
        <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
      </FormControl>
      <ActionsPanel>
        <Button disabled={!userName} onClick={createRoom}>
          Create Room
        </Button>
      </ActionsPanel>
    </Outline>
  );
};
