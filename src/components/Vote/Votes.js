import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, StyledBody } from "baseui/card";
import { styled } from "baseui";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      phase
      currentStoryId
      stories {
        id
        votes {
          userId
          score
        }
      }
    }
  }
`;

const ROOM_UPDATED_SUBSCRIPTION = gql`
  subscription RoomUpdated($roomId: ID!) {
    roomUpdated(roomId: $roomId) {
      phase
      currentStoryId
    }
  }
`;

const VOTE_UPSERTED_SUBSCRIPTION = gql`
  subscription VoteUpserted($roomId: ID!) {
    voteUpserted(roomId: $roomId) {
      userId
      storyId
      score
    }
  }
`;

const STORY_CREATED_SUBSCRIPTION = gql`
  subscription StoryCreated($roomId: ID!) {
    storyCreated(roomId: $roomId) {
      id
      description
    }
  }
`;

const Outline = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  height: "40em",
  alignContent: "flex-start",
});

const Vote = styled("div", ({ $theme }) => ({
  display: "flex",
  width: "16em",
  margin: $theme.sizing.scale800,
}));

export const Votes = () => {
  const { roomId } = useParams();
  // TODO: handle error state
  const { data: roomData, loading } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const { data: roomUpdatedData } = useSubscription(ROOM_UPDATED_SUBSCRIPTION, {
    variables: { roomId },
  });
  const { data: storyCreatedData } = useSubscription(
    STORY_CREATED_SUBSCRIPTION,
    {
      variables: { roomId },
    }
  );
  const { data: voteUpsertedData } = useSubscription(
    VOTE_UPSERTED_SUBSCRIPTION,
    {
      variables: { roomId },
    }
  );
  // const [stories, setStories] = useState([]);
  const [room, setRoom] = useState();

  useEffect(() => {
    if (roomData) {
      const { room } = roomData;
      setRoom(room);
    }
  }, [roomData]);

  useEffect(() => {
    if (roomUpdatedData) {
      const { roomUpdated } = roomUpdatedData;
      setRoom({ ...room, ...roomUpdated });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomUpdatedData]);

  useEffect(() => {
    if (voteUpsertedData) {
      const { voteUpserted } = voteUpsertedData;
      const storyIdx = room?.stories.findIndex(
        (story) => story.id === voteUpserted.storyId
      );
      const voteIdx = room?.stories[storyIdx]?.votes?.findIndex(
        (vote) => vote.userId === voteUpserted.userId
      );
      const currentVotes = room?.stories[storyIdx].votes || [];
      const newVotes =
        voteIdx < 0
          ? [...currentVotes, voteUpserted]
          : [
              ...currentVotes.slice(0, voteIdx),
              voteUpserted,
              ...currentVotes.slice(voteIdx + 1),
            ];
      const currentStories = room?.stories || [];
      const newStories = [
        ...currentStories.slice(0, storyIdx),
        { ...currentStories[storyIdx], votes: newVotes },
        ...currentStories.slice(storyIdx + 1),
      ];
      return setRoom({ ...room, stories: newStories });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteUpsertedData]);

  useEffect(() => {
    if (storyCreatedData) {
      const { storyCreated } = storyCreatedData;
      setRoom({
        ...room,
        stories: [...room.stories, storyCreated],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyCreatedData]);

  if (loading) {
    return <div>loading</div>;
  }

  const phase = room?.phase;
  const story = room?.stories.find(
    (story) => story.id === room?.currentStoryId
  );
  const votes = story?.votes;
  return (
    <Outline>
      {votes?.map((vote) => (
        <Vote>
          <Card
            overrides={{
              Root: {
                style: ({ $theme }) => ({
                  height: "4em",
                  width: "4em",
                  marginRight: $theme.sizing.scale400,
                }),
              },
            }}
          >
            <StyledBody>{phase === "DISCUSSION" && vote.score}</StyledBody>
          </Card>
          <span>{vote.userId}</span>
        </Vote>
      ))}
    </Outline>
  );
};
