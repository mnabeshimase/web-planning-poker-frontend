import { useParams } from "react-router";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Button } from "baseui/button";
import { ButtonGroup } from "baseui/button-group";
import { styled } from "baseui";

const DISCUSSION = "DISCUSSION";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
      phase
    }
  }
`;

const UPDATE_ROOM_MUTATION = gql`
  mutation UpdateRoom($updateRoomInput: UpdateRoomInput!) {
    updateRoom(updateRoomInput: $updateRoomInput) {
      phase
    }
  }
`;

const ROOM_UPDATED_SUBSCRIPTION = gql`
  subscription RoomUpdated {
    roomUpdated {
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
  const { data: roomData, loading: roomLoading } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const [updateRoom] = useMutation(UPDATE_ROOM_MUTATION);
  const { data: roomUpdatedData } = useSubscription(ROOM_UPDATED_SUBSCRIPTION);

  if (roomLoading) {
    return <div>loading</div>;
  }

  const { room } = roomData;
  const phase = roomUpdatedData?.roomUpdated.phase || room.phase;
  return (
    <Outline>
      {phase === "INIT" && (
        <Button
          {...ButtonOverride}
          onClick={() => {
            updateRoom({
              variables: {
                updateRoomInput: { id: roomId, phase: "VOTE" },
              },
            });
          }}
        >
          Start
        </Button>
      )}
      {(phase === "VOTE" || phase === "DISCUSSION") && (
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
      )}
    </Outline>
  );
};
