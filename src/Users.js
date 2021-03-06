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
const USER_DELETED_SUBSCRIPTION = gql`
  subscription UserDeleted {
    userDeleted {
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
  const { data: userDeletedData } = useSubscription(USER_DELETED_SUBSCRIPTION);
  const { data: usersData, loading } = useQuery(USERS_QUERY, {
    variables: { id: roomId },
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData.room.users);
    }
  }, [usersData]);

  useEffect(() => {
    if (userCreatedData) {
      const { userCreated } = userCreatedData;
      setUsers([...users, userCreated]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCreatedData]);

  useEffect(() => {
    if (userDeletedData) {
      const {
        userDeleted: { name },
      } = userDeletedData;

      setUsers(users.filter((user) => user.name !== name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDeletedData]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <p>createdUser:{JSON.stringify(users)}</p>
    </div>
  );
};
