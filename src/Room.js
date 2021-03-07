import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  ROLE,
} from "baseui/modal";
import { FormControl } from "baseui/form-control";

import { Hand } from "./Hand";
import { Input } from "baseui/input";
import { Votes } from "./Votes";
import { HostActionPanes } from "./HostActionPanel";
import { Stories } from "./Stories";
import { StoryActionsPanel } from "./StoryActionsPanel";
import { StoryMetadata } from "./StoryMedatada";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $roomId: ID) {
    createUser(name: $name, roomId: $roomId) {
      id
      name
    }
  }
`;
const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const narrowItemProps = {
  overrides: {
    Block: {
      style: ({ $theme }) => ({
        width: $theme.sizing.scale1600,
        // flexGrow: 0,
      }),
    },
  },
};

export function Room() {
  const { roomId } = useParams();
  const location = useLocation();

  // TODO: Handle error state
  const { loading } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const [
    createUser,
    { data: createUserData, loading: createUserLoading },
  ] = useMutation(CREATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [userId, setUserId] = useState();
  const [userNameInput, setUserNameInput] = useState();
  const [isModalOpen, setIsModalOpen] = useState(!location.state?.isHostUser); // TODO: replace location state with auth

  useEffect(() => {
    if (createUserData) {
      setIsModalOpen(false);
      setUserId(createUserData.createUser.id); //TODO: replace with auth
    }
  }, [createUserData]);

  // Remove user from the room on unmount
  useEffect(() => {
    if (createUserData) {
      function onUnmount() {
        const {
          createUser: { id },
        } = createUserData;
        return deleteUser({ variables: { id } });
      }
      window.addEventListener("beforeunload", onUnmount);
      return () => window.removeEventListener("beforeunload", onUnmount);
    }
  }, [createUserData, deleteUser]);

  if (loading) {
    return <div className="App">Loading</div>;
  }

  return (
    <>
      <FlexGrid flexGridColumnCount={2}>
        <FlexGridItem>
          <FlexGrid flexGridColumnCount={1}>
            <FlexGridItem>
              <StoryMetadata />
            </FlexGridItem>
            <FlexGridItem>
              <HostActionPanes />
            </FlexGridItem>
            <FlexGridItem>
              <Votes />
            </FlexGridItem>
            <FlexGridItem>
              <Hand userId={userId} />
            </FlexGridItem>
          </FlexGrid>
        </FlexGridItem>

        <FlexGridItem {...narrowItemProps}>
          <FlexGrid flexGridColumnCount={1}>
            <FlexGridItem>
              <Stories />
            </FlexGridItem>
            <FlexGridItem>
              <StoryActionsPanel />
            </FlexGridItem>
          </FlexGrid>
        </FlexGridItem>
      </FlexGrid>

      <Modal
        autoFocus
        closeable={false}
        isOpen={isModalOpen}
        role={ROLE.dialog}
      >
        <ModalHeader>Join Room</ModalHeader>
        <ModalBody>
          <FormControl label="Username">
            <Input
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            disabled={!userNameInput}
            isLoading={createUserLoading}
            onClick={() => {
              createUser({
                variables: { name: userNameInput, roomId },
              });
            }}
          >
            Enter
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}
