import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { styled } from "baseui";

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($roomId: ID, $name: String!) {
    createUser(roomId: $roomId, name: $name) {
      name
      id
      roomId
    }
  }
`;

const Outline = styled("div", ({ $theme }) => ({
  ...$theme.borders.border600,
  borderRadius: $theme.borders.radius200,
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
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (data) {
      const {
        createUser: { id, roomId },
      } = data;
      const roomRoute = ["room", roomId].join("/");
      return history.push(roomRoute, { isHostUser: true, hostUserId: id }); // TODO: replace location state with auth
    }
  }, [data, history]);

  return (
    <Outline>
      <form
        data-testid="form"
        onSubmit={(e) => {
          e.preventDefault();
          createUser({ variables: { name: userName } });
        }}
      >
        <FormControl label="Username">
          <Input
            $data-testid="input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        <ActionsPanel>
          <Button disabled={!userName}>Create Room</Button>
        </ActionsPanel>
      </form>
    </Outline>
  );
};
