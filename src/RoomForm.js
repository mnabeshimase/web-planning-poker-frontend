import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { styled } from "baseui";

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $roomId: ID) {
    createUser(name: $name, roomId: $roomId) {
      name
      roomId
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
  const [createUser, { data }] = useMutation(CREATE_USER_MUTATION);
  const [userName, setUserName] = useState();

  useEffect(() => {
    if (data) {
      const {
        createUser: { roomId },
      } = data;
      const roomRoute = ["room", roomId].join("/");
      return history.push(roomRoute, { isHostUser: true }); // TODO: replace location state with auth
    }
  }, [data, history]);

  return (
    <Outline>
      <FormControl label="Username">
        <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
      </FormControl>
      <ActionsPanel>
        <Button
          disabled={!userName}
          onClick={() => createUser({ variables: { name: userName } })}
        >
          Create Room
        </Button>
      </ActionsPanel>
    </Outline>
  );
};
