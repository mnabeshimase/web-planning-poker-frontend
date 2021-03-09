import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";

import { Stories, LIST_STORIES_BY_ROOM_ID_QUERY } from "../Stories";

const roomId = "roomId";
jest.mock("react-router-dom", () => ({
  useParams: () => ({
    roomId,
  }),
}));

describe("Stories", () => {
  const story = {
    id: "id",
    description: "description",
  };
  it("fetch stories", async () => {
    const mockListStoriesByRoomId = jest.fn();
    mockListStoriesByRoomId.mockReturnValueOnce([story]);
    const mocks = [
      {
        request: {
          query: LIST_STORIES_BY_ROOM_ID_QUERY,
          variables: {
            id: roomId,
          },
        },
        result: mockListStoriesByRoomId,
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Stories />
      </MockedProvider>
    );
    await waitFor(() => expect(mockListStoriesByRoomId).toBeCalledTimes(1));
  });
});
