import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Button } from "baseui/button";
import { useParams } from "react-router";

const UPSERT_VOTE_MUTATION = gql`
  mutation UpsertVote($upsertVoteInput: UpsertVoteInput!) {
    upsertVote(upsertVoteInput: $upsertVoteInput) {
      storyId
      userId
      score
    }
  }
`;

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      currentStoryId
    }
  }
`;

const ROOM_UPDATED_SUBSCRIPTION = gql`
  subscription RoomUpdated {
    roomUpdated {
      currentStoryId
    }
  }
`;

export const Card = (props) => {
  const { roomId } = useParams();
  const { value, userId, isSelected, setSelectedCard } = props;
  const { data: roomData } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const [upsertVote] = useMutation(UPSERT_VOTE_MUTATION);
  const { data: roomUpdatedData } = useSubscription(ROOM_UPDATED_SUBSCRIPTION);

  const storyId =
    roomUpdatedData?.roomUpdated.currentStoryId ||
    roomData?.room.currentStoryId;

  return (
    <Button
      isSelected={isSelected}
      onClick={() => {
        setSelectedCard(value);
        upsertVote({
          variables: { upsertVoteInput: { userId, storyId, score: value } },
        });
      }}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => ({
            fontSize: "4em",
            height: "4em",
            width: "100%",
            borderRadius: $theme.borders.radius400,
          }),
        },
      }}
    >
      {value}
    </Button>
  );
};
