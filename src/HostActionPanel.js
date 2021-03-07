import { Button } from "baseui/button";
import { gql, useMutation } from "@apollo/client";
import { useParams } from "react-router";

const DISCUSSION = "DISCUSSION";

const UPDATE_ROOM_MUTATION = gql`
  mutation UpdateRoom($updateRoomInput: UpdateRoomInput!) {
    updateRoom(updateRoomInput: $updateRoomInput) {
      phase
    }
  }
`;

export const HostActionPanes = () => {
  const { roomId } = useParams();
  const [updateRoom] = useMutation(UPDATE_ROOM_MUTATION);
  return (
    <div>
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
      >
        Flip Cards
      </Button>
    </div>
  );
};
