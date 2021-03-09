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

import { Hand } from "../Card/Hand";
import { Input } from "baseui/input";
import { Votes } from "../Vote/Votes";
import { HostActionPanel } from "../Host/HostActionPanel";
import { Stories } from "../Story/Stories";
import { StoryActionsPanel } from "../Story/StoryActionsPanel";
import { StoryMetadata } from "../Story/StoryMedatada";

const ROOM_QUERY = gql`
  query Room($id: ID!) {
    room(id: $id) {
      id
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($roomId: ID, $name: String!) {
    createUser(roomId: $roomId, name: $name) {
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
  const isHost = location.state?.isHostUser; // TODO: replace location state with auth
  const hostUserId = location.state?.hostUserId;

  // TODO: Handle error state
  const { data: roomData, loading } = useQuery(ROOM_QUERY, {
    variables: { id: roomId },
  });
  const [
    createUser,
    { data: createUserData, loading: createUserLoading },
  ] = useMutation(CREATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [userId, setUserId] = useState();
  const [userNameInput, setUserNameInput] = useState();
  const [isModalOpen, setIsModalOpen] = useState(!isHost);

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
            <FlexGridItem>{isHost && <HostActionPanel />}</FlexGridItem>
            <FlexGridItem>
              <Votes />
            </FlexGridItem>
            <FlexGridItem>
              <Hand userId={isHost ? hostUserId : userId} />
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createUser({
              variables: { name: userNameInput, roomId },
            });
          }}
        >
          <ModalBody>
            <FormControl label="Username">
              <Input
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
              />
            </FormControl>
            {!roomData && <span>Room does not exist</span>}
          </ModalBody>
          <ModalFooter>
            <ModalButton
              disabled={!userNameInput || !roomData}
              isLoading={createUserLoading}
            >
              Enter
            </ModalButton>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
