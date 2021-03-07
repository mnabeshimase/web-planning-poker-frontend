import { useEffect, useState } from "react";
import { Button, KIND, SIZE } from "baseui/button";
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from "baseui/modal";
import { Textarea } from "baseui/textarea";
import { FormControl } from "baseui/form-control";
import { gql, useMutation } from "@apollo/client";
import { useParams } from "react-router";

const CREATE_STORY_MUTATION = gql`
  mutation CreateStory($roomId: ID!, $description: String!) {
    createStory(roomId: $roomId, description: $description) {
      description
    }
  }
`;
export const StoryActionsPanel = () => {
  const { roomId } = useParams();
  const [
    createStory,
    { data: createStoryData, loading: createStoryLoading },
  ] = useMutation(CREATE_STORY_MUTATION);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");

  useEffect(() => {
    if (createStoryData && !createStoryLoading) {
      setIsStoryModalOpen(false);
    }
  }, [createStoryData, createStoryLoading]);

  return (
    <div style={{ width: "100%" }}>
      <Button
        onClick={() => setIsStoryModalOpen(true)}
        overrides={{ BaseButton: { style: { width: "100%" } } }}
      >
        Add Story
      </Button>
      <Modal
        onClose={() => setIsStoryModalOpen(false)}
        isOpen={isStoryModalOpen}
      >
        <ModalHeader>Add Story</ModalHeader>
        <ModalBody>
          <FormControl label="Description">
            <Textarea
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            kind={KIND.secondary}
            size={SIZE.large}
            onClick={() => setIsStoryModalOpen(false)}
          >
            Cancel
          </ModalButton>
          <ModalButton
            size={SIZE.large}
            isLoading={createStoryLoading}
            onClick={() => {
              createStory({
                variables: {
                  description: descriptionInput,
                  roomId,
                },
              });
            }}
          >
            Create
          </ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};
