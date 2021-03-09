import { fireEvent, render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import {
  HostActionPanel,
  ROOM_QUERY,
  UPDATE_ROOM_MUTATION,
} from "../HostActionPanel";
import { PHASE } from "../../../constants";

const roomId = "roomId";
jest.mock("react-router-dom", () => ({
  useParams: () => ({
    roomId,
  }),
}));

describe("HostActionPanel", () => {
  const room = {
    id: roomId,
    phase: PHASE.INIT,
    currentStoryId: "currentStoryId",
  };
  const story = {
    id: "storyId",
    description: "description",
  };
  it("update room phase", async () => {
    const roomMock = jest.fn();
    roomMock.mockReturnValueOnce({
      data: {
        room,
        listStoriesByRoomId: [story],
      },
    });
    const updateRoomMock = jest.fn();
    updateRoomMock.mockReturnValueOnce({
      data: { updateRoom: { phase: PHASE.VOTE } },
    });
    const mocks = [
      {
        request: {
          query: ROOM_QUERY,
          variables: { id: roomId },
        },
        result: roomMock,
      },
      {
        request: {
          query: UPDATE_ROOM_MUTATION,
          variables: {
            updateRoomInput: {
              id: room.id,
              phase: PHASE.VOTE,
              currentStoryId: story.id,
            },
          },
        },
        result: updateRoomMock,
      },
    ];
    const hostActionPanel = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HostActionPanel />
      </MockedProvider>
    );

    await waitFor(() => expect(roomMock).toBeCalledTimes(1));
    const button = hostActionPanel.getByText("Start");
    fireEvent.click(button);
    await waitFor(() => expect(updateRoomMock).toBeCalledTimes(1));
  });
});
