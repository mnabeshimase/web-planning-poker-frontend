import { useEffect, useState } from "react";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";

import { Card } from "./Card";
import { styled } from "baseui";
import { gql, useSubscription } from "@apollo/client";

const Outline = styled("div", ({ $theme }) => ({
  margin: $theme.sizing.scale800,
}));

const ROOM_UPDATED_SUBSCRIPTION = gql`
  subscription RoomUpdated {
    roomUpdated {
      phase
    }
  }
`;

export const Hand = (props) => {
  const { userId } = props;
  const cardValues = ["0", "0.5", "1", "2", "3", "5", "8", "13"];
  const { data: roomUpdatedData } = useSubscription(ROOM_UPDATED_SUBSCRIPTION);
  const [selectedCard, setSelectedCard] = useState();

  useEffect(() => {
    if (roomUpdatedData) {
      const {
        roomUpdated: { phase },
      } = roomUpdatedData;
      if (phase === "VOTE") {
        setSelectedCard();
      }
    }
  }, [roomUpdatedData]);

  return (
    <Outline>
      <FlexGrid
        flexGridColumnCount={cardValues.length}
        flexGridColumnGap="scale200"
      >
        {cardValues.map((value) => (
          <FlexGridItem key={value}>
            <Card
              value={value}
              isSelected={value === selectedCard}
              setSelectedCard={setSelectedCard}
              userId={userId}
            />
          </FlexGridItem>
        ))}
      </FlexGrid>
    </Outline>
  );
};
