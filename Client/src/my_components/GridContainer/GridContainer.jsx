import { memo } from "react";

const GridContainer = memo(function GridContainer({ name, value }) {
  return (
    <>
      <div className="border-2 border-slate-500 flex flex-col items-center justify-center ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active] bg-background text-card-foreground shadow rounded-lg p-4 w-full hover:bg-slate-100 hover:cursor-pointer">
        <div className="text-lg font-medium">{name}</div>
        <div className="text-lg ">{value}</div>
      </div>
    </>
  );
});

export default GridContainer;
