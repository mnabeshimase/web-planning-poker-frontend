import { fireEvent, render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import { RoomForm, CREATE_USER_MUTATION } from "../RoomForm";

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: () => {},
  }),
}));

describe("RoomForm", () => {
  const user = {
    id: "id",
    name: "name",
    roomId: "roomId",
  };
  test("create host user and room", async () => {
    const mockCreateUser = jest.fn();
    mockCreateUser.mockReturnValueOnce({
      data: {
        createUser: user,
      },
    });
    const mocks = [
      {
        request: {
          query: CREATE_USER_MUTATION,
          variables: { name: user.name },
        },
        result: mockCreateUser,
      },
    ];

    const roomForm = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RoomForm />
      </MockedProvider>
    );
    await waitFor(() => roomForm.container.querySelector("input"));
    const input = roomForm.container.querySelector("input");
    fireEvent.change(input, { target: { value: user.name } });
    fireEvent.submit(roomForm.getByTestId("form"));

    await waitFor(() => expect(mockCreateUser).toBeCalledTimes(1));
  });
});
