import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";

const LIST_STORIES_BY_ROOM_ID_QUERY = gql`
  query ListStoriesByRoomId($id: ID!) {
    listStoriesByRoomId(id: $id) {
      description
    }
  }
`;

export const Stories = () => {
  const { roomId } = useParams();
  // TODO: handle error state
  const { data, loading } = useQuery(LIST_STORIES_BY_ROOM_ID_QUERY, {
    variables: { id: roomId },
  });

  if (loading) {
    return <div>Loading</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};
