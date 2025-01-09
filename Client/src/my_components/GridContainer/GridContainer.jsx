import { memo } from "react";

const GridContainer = memo(function GridContainer({ name, value }) {
  return (
    <>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-4 flex flex-col items-center">
        <div className="text-lg font-medium">{name}</div>
        <div className="text-lg text-muted-foreground">{value}</div>
      </div>
    </>
  );
});

export default GridContainer;
