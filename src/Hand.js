import { useState } from "react";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";

import { Card } from "./Card";

export const Hand = (props) => {
  const { userId } = props;
  const cardValues = [0, 0.5, 1, 2, 3, 5, 8, 13];
  const [selectedCard, setSelectedCard] = useState();
  return (
    <>
      <FlexGrid
        flexGridColumnCount={cardValues.length}
        flexGridColumnGap="scale200"
      >
        {cardValues.map((value) => (
          <FlexGridItem>
            <Card
              key={value}
              value={value}
              isSelected={value === selectedCard}
              setSelectedCard={setSelectedCard}
              userId={userId}
            />
          </FlexGridItem>
        ))}
      </FlexGrid>
    </>
  );
};
