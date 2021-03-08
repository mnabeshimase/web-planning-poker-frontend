import { useParams } from "react-router";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Button } from "baseui/button";
import { ButtonGroup } from "baseui/button-group";
import { styled } from "baseui";
import { useEffect, useState } from "react";

const DISCUSSION = "DISCUSSION";
const VOTE = "VOTE";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
      phase
      currentStoryId
    }
    listStoriesByRoomId(id: $id) {
      id
      description
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
  subscription RoomUpdated($roomId: ID!) {
    roomUpdated(roomId: $roomId) {
      phase
      currentStoryId
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
  const { data: roomUpdatedData } = useSubscription(ROOM_UPDATED_SUBSCRIPTION, {
    variables: { roomId },
  });
  const { data: StoryCreatedData } = useSubscription(
    STORY_CREATED_SUBSCRIPTION,
    {
      variables: { roomId },
    }
  );
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (roomData) {
      const { listStoriesByRoomId } = roomData;
      setStories(listStoriesByRoomId);
    }
  }, [roomData]);

  useEffect(() => {
    if (StoryCreatedData) {
      const { storyCreated } = StoryCreatedData;
      setStories([...stories, storyCreated]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StoryCreatedData]);

  if (roomLoading) {
    return <div>loading</div>;
  }

  const { room } = roomData;
  const { phase, currentStoryId } = roomUpdatedData?.roomUpdated || room;
  const nextStoryId =
    stories[stories.findIndex((story) => story.id === currentStoryId) + 1]?.id;

  return (
    <Outline>
      {phase === "INIT" && (
        <Button
          {...ButtonOverride}
          disabled={!stories.length}
          onClick={() => {
            updateRoom({
              variables: {
                updateRoomInput: {
                  id: roomId,
                  phase: VOTE,
                  currentStoryId: stories[0].id,
                },
              },
            });
          }}
        >
          Start
        </Button>
      )}
      {(phase === VOTE || phase === DISCUSSION) && (
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
          <Button
            {...ButtonOverride}
            disabled={!nextStoryId}
            onClick={() => {
              updateRoom({
                variables: {
                  updateRoomInput: {
                    id: roomId,
                    currentStoryId: nextStoryId,
                    phase: VOTE,
                  },
                },
              });
            }}
          >
            Next Story
          </Button>
        </ButtonGroup>
      )}
    </Outline>
  );
};
