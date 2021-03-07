import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { styled } from "baseui";
import { Display4 } from "baseui/typography";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
      currentStoryId
      stories {
        id
        description
      }
    }
  }
`;

const STORY_CREATED_SUBSCRIPTION = gql`
  subscription StoryCreated {
    storyCreated {
      id
      description
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

const Outline = styled("div", {
  height: "4em",
  display: "flex",
  alignItems: "center",
});

export const StoryMetadata = () => {
  const { roomId } = useParams();
  const { data: roomData, loading: roomLoading } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const { data: roomUpdatedData } = useSubscription(ROOM_UPDATED_SUBSCRIPTION);
  const { data: storyCreatedData } = useSubscription(
    STORY_CREATED_SUBSCRIPTION
  );
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (roomData) {
      const {
        room: { stories },
      } = roomData;
      setStories(stories);
    }
  }, [roomData]);

  useEffect(() => {
    if (storyCreatedData) {
      const { storyCreated } = storyCreatedData;
      setStories([...stories, storyCreated]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyCreatedData]);

  if (roomLoading) {
    return <div>loading</div>;
  }

  const currentStoryId =
    roomData?.room.currentStoryId ||
    roomUpdatedData?.roomUpdated.currentStoryId;
  const currentStory = stories.find((story) => story.id === currentStoryId);

  return (
    <Outline>
      <Display4 margin="scale800">{currentStory?.description}</Display4>
    </Outline>
  );
};
