import { styled } from "baseui";
import { Display1 } from "baseui/typography";

const Outline = styled("div", ({ $theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: $theme.sizing.scale900,
}));

export const NotFound = () => {
  return (
    <Outline>
      <Display1>Page Not Found</Display1>
    </Outline>
  );
};
