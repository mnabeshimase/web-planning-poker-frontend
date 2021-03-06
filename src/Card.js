import { Button } from "baseui/button";

export const Card = (props) => {
  const { value, isSelected, setSelectedCard } = props;
  return (
    <Button
      isSelected={isSelected}
      onClick={() => setSelectedCard(value)}
      overrides={{
        BaseButton: {
          style: { fontSize: "4em", height: "4em", width: "100%" },
        },
      }}
    >
      {value}
    </Button>
  );
};
