import { styled } from "baseui";
import { RoomForm } from "./RoomForm";

const Layout = styled("div", ({ $theme }) => ({
  paddingTop: $theme.sizing.scale1600,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const Home = () => {
  return (
    <Layout>
      <RoomForm />
    </Layout>
  );
};
