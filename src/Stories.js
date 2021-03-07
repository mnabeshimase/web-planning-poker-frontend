import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const LIST_STORIES_BY_ROOM_ID_QUERY = gql`
  query ListStoriesByRoomId($id: ID!) {
    listStoriesByRoomId(id: $id) {
      description
    }
  }
`;

const STORY_CREATED_SUBSCRIPTION = gql`
  subscription StoryCreated {
    storyCreated {
      description
    }
  }
`;

export const Stories = () => {
  const { roomId } = useParams();
  // TODO: handle error state
  const { data: listStoriesByRoomIdData, loading } = useQuery(
    LIST_STORIES_BY_ROOM_ID_QUERY,
    {
      variables: { id: roomId },
    }
  );
  const { data: StoryCreatedData } = useSubscription(
    STORY_CREATED_SUBSCRIPTION
  );
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (listStoriesByRoomIdData) {
      const { listStoriesByRoomId } = listStoriesByRoomIdData;
      setStories(listStoriesByRoomId);
    }
  }, [listStoriesByRoomIdData]);

  useEffect(() => {
    if (StoryCreatedData) {
      const { storyCreated } = StoryCreatedData;
      setStories([...stories, storyCreated]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StoryCreatedData]);

  if (loading) {
    return <div>Loading</div>;
  }

  return <div>{JSON.stringify(stories)}</div>;
};
