import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, StyledBody } from "baseui/card";
import { styled } from "baseui";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      room {
        phase
      }
      votes {
        userId
        score
      }
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

const ROOM_UPDATED_SUBSCRIPTION = gql`
  subscription RoomUpdated {
    roomUpdated {
      phase
    }
  }
`;

const Vote = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const Votes = () => {
  const { roomId } = useParams();
  // TODO: handle error state
  const { data: roomData, loading } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const { data: voteUpsertedData } = useSubscription(
    VOTE_UPSERTED_SUBSCRIPTION
  );
  const { data: roomUpdatedData } = useSubscription(ROOM_UPDATED_SUBSCRIPTION);
  const [votes, setVotes] = useState([]);
  const [phase, setPhase] = useState();

  useEffect(() => {
    if (roomData) {
      const {
        room: { phase, votes },
      } = roomData;
      setVotes(votes);
      setPhase(phase);
    }
  }, [roomData]);

  useEffect(() => {
    if (voteUpsertedData) {
      const { voteUpserted } = voteUpsertedData;
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
  }, [voteUpsertedData]);

  useEffect(() => {
    if (roomUpdatedData) {
      const {
        roomUpdated: { phase },
      } = roomUpdatedData;
      setPhase(phase);
    }
  }, [roomUpdatedData]);

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <div>
      {votes.map((vote) => (
        <Vote>
          <Card>
            <StyledBody>{phase === "DISCUSSION" && vote.score}</StyledBody>
          </Card>
          <span>{vote.userId}</span>
        </Vote>
      ))}
    </div>
  );
};
