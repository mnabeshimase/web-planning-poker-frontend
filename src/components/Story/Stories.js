import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { ListItem, ListItemLabel } from "baseui/list";
import { styled } from "baseui";
import { Display4 } from "baseui/typography";

export const LIST_STORIES_BY_ROOM_ID_QUERY = gql`
  query ListStoriesByRoomId($id: ID!) {
    listStoriesByRoomId(id: $id) {
      id
      description
    }
  }
`;

export const STORY_CREATED_SUBSCRIPTION = gql`
  subscription StoryCreated($roomId: ID!) {
    storyCreated(roomId: $roomId) {
      id
      description
    }
  }
`;

const OutLine = styled("div", ({ $theme }) => ({
  ...$theme.borders.border600,
  padding: $theme.sizing.scale800,
}));

const List = styled("div", {
  height: "42em",
  overflow: "scroll",
});

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
    STORY_CREATED_SUBSCRIPTION,
    {
      variables: { roomId },
    }
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

  return (
    <OutLine>
      <Display4 margin="scale800">Stories</Display4>
      <hr />
      <List>
        {stories.map((story) => (
          <ListItem key={story.id}>
            <ListItemLabel>{story.description}</ListItemLabel>
          </ListItem>
        ))}
      </List>
    </OutLine>
  );
};
