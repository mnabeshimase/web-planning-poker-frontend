import { styled } from "baseui";
import { Heading, HeadingLevel } from "baseui/heading";

const Outline = styled("header", ({ $theme }) => ({
  width: "100%",
  height: "6em",
  backgroundColor: $theme.colors.backgroundInverseSecondary,
  color: $theme.colors.contentInversePrimary,
}));

export const Header = () => {
  return (
    <Outline>
      <HeadingLevel>
        <Heading color="primaryInverse200" marginTop="0" padding="scale600">
          Planning Poker
        </Heading>
      </HeadingLevel>
    </Outline>
  );
};
