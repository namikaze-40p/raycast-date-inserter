import { Grid } from "@raycast/api";

export default function Command() {
  return (
    <Grid columns={7} aspectRatio="1">
      <Grid.EmptyView title="Calendar coming soon" />
    </Grid>
  );
}
