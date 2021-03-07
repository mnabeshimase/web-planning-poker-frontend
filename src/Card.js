import { gql, useMutation } from "@apollo/client";
import { Button } from "baseui/button";
import { useParams } from "react-router";

const UPSERT_VOTE_MUTATION = gql`
  mutation UpsertVote($upsertVoteInput: UpsertVoteInput!) {
    upsertVote(upsertVoteInput: $upsertVoteInput) {
      roomId
      userId
      score
    }
  }
`;

export const Card = (props) => {
  const { value, userId, isSelected, setSelectedCard } = props;
  const { roomId } = useParams();
  const [upsertVote] = useMutation(UPSERT_VOTE_MUTATION);

  return (
    <Button
      isSelected={isSelected}
      onClick={() => {
        setSelectedCard(value);
        upsertVote({
          variables: { upsertVoteInput: { userId, roomId, score: value } },
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
