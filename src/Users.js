import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const USER_CREATED_SUBSCRIPTION = gql`
  subscription UserCreated {
    userCreated {
      name
    }
  }
`;
const USERS_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
      users {
        name
      }
    }
  }
`;

export const Users = () => {
  const { roomId } = useParams();
  // TODO: Handle error and loading state
  const { data: userCreatedData } = useSubscription(USER_CREATED_SUBSCRIPTION);
  const { data: usersData, loading } = useQuery(USERS_QUERY, {
    variables: { id: roomId },
  });
  const [createdUsers, setCreatedUsers] = useState([]);

  useEffect(() => {
    if (userCreatedData) {
      setCreatedUsers((createdUsers) => [...createdUsers, userCreatedData]);
    }
  }, [userCreatedData]);

  if (loading) {
    return <div>Loading</div>;
  }

  const usersInRoom = [...usersData.room.users, ...createdUsers];
  return (
    <div>
      <p>createdUser:{JSON.stringify(usersInRoom)}</p>
    </div>
  );
};
