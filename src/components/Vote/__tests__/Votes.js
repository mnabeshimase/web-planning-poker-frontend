import { render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import { ROOM_QUERY, Votes } from "../Votes";
import { PHASE } from "../../../constants";

const roomId = "roomId";
jest.mock("react-router-dom", () => ({
  useParams: () => ({
    roomId,
  }),
}));

describe("Votes", () => {
  const room = {
    id: roomId,
    phase: PHASE.VOTE,
    currentStoryId: "currentStoryId",
  };
  const story = {
    id: "storyId",
  };
  const vote = {
    userId: "userId",
    score: "score",
  };
  it("fetch room", async () => {
    const roomMock = jest.fn();
    roomMock.mockReturnValueOnce({
      data: {
        room: {
          phase: room.phase,
          currentStoryId: room.currentStoryId,
          stories: [
            {
              id: story.id,
              votes: [vote],
            },
          ],
        },
      },
    });

    const mocks = [
      {
        request: {
          query: ROOM_QUERY,
          variables: { id: roomId },
        },
        result: roomMock,
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Votes />
      </MockedProvider>
    );

    await waitFor(() => expect(roomMock).toBeCalledTimes(1));
  });
});
