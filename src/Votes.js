import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const LIST_VOTES_BY_ROOM_ID_QUERY = gql`
  query ListVotesByRoomId($id: ID!) {
    listVotesByRoomId(id: $id) {
      userId
      score
    }
  }
`;

const VOTE_UPSERTED_SUBSCRIPTION = gql`
  subscription VoteUpserted {
    voteUpserted {
      userId
      roomId
      score
    }
  }
`;

export const Votes = () => {
  const { roomId } = useParams();
  // TODO: handle error state
  const { data: listVotesByRoomIdData, loading } = useQuery(
    LIST_VOTES_BY_ROOM_ID_QUERY,
    {
      variables: { id: roomId },
    }
  );
  const { data: voteUpsertedDate } = useSubscription(
    VOTE_UPSERTED_SUBSCRIPTION
  );
  const [votes, setVotes] = useState();

  useEffect(() => {
    if (listVotesByRoomIdData) {
      const { listVotesByRoomId } = listVotesByRoomIdData;
      setVotes(listVotesByRoomId);
    }
  }, [listVotesByRoomIdData]);

  useEffect(() => {
    if (voteUpsertedDate) {
      const { voteUpserted } = voteUpsertedDate;
      const oldVoteIdx = votes.findIndex(
        (vote) =>
          vote.userId === voteUpserted.userId &&
          vote.roomId === voteUpserted.roomId
      );
      if (oldVoteIdx >= 0) {
        return setVotes([
          ...votes.slice(0, oldVoteIdx),
          { ...votes[oldVoteIdx], score: voteUpserted.score },
          ...votes.slice(oldVoteIdx + 1),
        ]);
      }
      setVotes([...votes, voteUpserted]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteUpsertedDate]);

  if (loading) {
    return <div>loading</div>;
  }

  return <div>{JSON.stringify(votes)}</div>;
};
