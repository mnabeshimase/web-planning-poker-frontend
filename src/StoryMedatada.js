import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";

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

export const StoryMetadata = () => {
  const { roomId } = useParams();
  const { data: roomData, loading: roomLoading } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });

  if (roomLoading) {
    return <div>loading</div>;
  }

  const currentStory = roomData.room.stories.find(
    (story) => story.id === roomData.room.currentStoryId
  );

  return <div>{JSON.stringify(currentStory && currentStory.description)}</div>;
};
