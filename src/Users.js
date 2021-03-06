import { gql, useSubscription } from "@apollo/client";

const USERS_SUBSCRIPTION = gql`
  subscription UserCreated {
    userCreated {
      name
    }
  }
`;

export const Users = () => {
  // TODO: Handle error and loading state
  const { data } = useSubscription(USERS_SUBSCRIPTION);

  return <div>{JSON.stringify(data)}</div>;
};
