import { useParams } from "react-router";
import { gql, useMutation } from "@apollo/client";
import { Button } from "baseui/button";
import { ButtonGroup } from "baseui/button-group";
import { styled } from "baseui";

const DISCUSSION = "DISCUSSION";

const UPDATE_ROOM_MUTATION = gql`
  mutation UpdateRoom($updateRoomInput: UpdateRoomInput!) {
    updateRoom(updateRoomInput: $updateRoomInput) {
      phase
    }
  }
`;

const Outline = styled("div", ({ $theme }) => ({
  backgroundColor: $theme.colors.backgroundSecondary,
  borderRadius: $theme.borders.radius300,
  padding: $theme.sizing.scale200,
  margin: $theme.sizing.scale600,
}));

const ButtonOverride = {
  overrides: {
    BaseButton: {
      style: ({ $theme }) => ({
        margin: $theme.sizing.scale400,
      }),
    },
  },
};

export const HostActionPanes = () => {
  const { roomId } = useParams();
  const [updateRoom] = useMutation(UPDATE_ROOM_MUTATION);
  return (
    <Outline>
      <ButtonGroup>
        <Button
          onClick={() =>
            updateRoom({
              variables: {
                updateRoomInput: {
                  id: roomId,
                  phase: DISCUSSION,
                },
              },
            })
          }
          {...ButtonOverride}
        >
          Flip Cards
        </Button>
        <Button {...ButtonOverride}>Next Story</Button>
      </ButtonGroup>
    </Outline>
  );
};
