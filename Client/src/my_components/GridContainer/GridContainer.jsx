import { memo } from "react";

const GridContainer = memo(function GridContainer({ name, value }) {
  return (
    <>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-4 flex flex-col items-center motion-blur-in-md motion-duration-[2s] motion-opacity-in-0">
        <div className="text-lg font-medium">{name}</div>
        <div className="text-lg text-muted-foreground">{value}</div>
      </div>
    </>
  );
});

export default GridContainer;
