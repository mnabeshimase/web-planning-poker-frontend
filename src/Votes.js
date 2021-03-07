import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";

const LIST_VOTES_BY_ROOM_ID_QUERY = gql`
  query ListVotesByRoomId($id: ID!) {
    listVotesByRoomId(id: $id) {
      userId
      score
    }
  }
`;

export const Votes = () => {
  const { roomId } = useParams();
  // TODO: handle error state
  const { data, loading } = useQuery(LIST_VOTES_BY_ROOM_ID_QUERY, {
    variables: { id: roomId },
  });

  if (loading) {
    return <div>loading</div>;
  }

  return <div>{JSON.stringify(data.listVotesByRoomId)}</div>;
};
