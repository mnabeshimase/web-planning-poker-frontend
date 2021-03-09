import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, waitFor } from "@testing-library/react";

import { Card, UPSERT_VOTE_MUTATION, ROOM_QUERY } from "../Card";

const roomId = "roomId";
jest.mock("react-router-dom", () => ({
  useParams: () => ({
    roomId,
  }),
}));

describe("Card", () => {
  const currentStoryId = "currentStoryId";
  const value = "value";
  const userId = "userId";
  const props = {
    value,
    userId,
    isSelected: true,
    setSelectedCard: () => {},
  };
  it("upsert vote", async () => {
    const mockRoom = jest.fn();
    mockRoom.mockReturnValueOnce({
      data: { room: { currentStoryId } },
    });
    const mockUpsertVote = jest.fn();
    mockUpsertVote.mockReturnValueOnce({
      data: { upsertVote: { storyId: currentStoryId, userId, score: value } },
    });
    const mocks = [
      {
        request: {
          query: ROOM_QUERY,
          variables: { id: roomId },
        },
        result: mockRoom,
      },
      {
        request: {
          query: UPSERT_VOTE_MUTATION,
          variables: {
            upsertVoteInput: {
              userId,
              storyId: currentStoryId,
              score: value,
            },
          },
        },
        result: mockUpsertVote,
      },
    ];
    const card = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Card {...props} />
      </MockedProvider>
    );

    await waitFor(() => expect(mockRoom).toBeCalledTimes(1));
    const button = card.container.querySelector("button");
    fireEvent.click(button);
    await waitFor(() => expect(mockUpsertVote).toBeCalledTimes(1));
  });
});
