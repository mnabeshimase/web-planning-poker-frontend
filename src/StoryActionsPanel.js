import { useState } from "react";
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

export const StoryActionsPanel = () => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");

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
          <ModalButton size={SIZE.large}>Create</ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};
