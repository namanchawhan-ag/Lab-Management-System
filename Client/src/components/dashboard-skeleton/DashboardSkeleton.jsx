import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

const DashboardSkeleton = () => {
  const topSkeletons = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={`top-${index}`} className="h-10 w-full" />
      )),
    []
  );

  const middleSkeletons = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`middle-${index}`} className="h-24 w-full" />
      )),
    []
  );

  const containerClasses = useMemo(
    () => ({
      main: "mb-2",
      topRow: "flex gap-2 mb-2",
      middleRow: "flex gap-2 mb-2",
    }),
    []
  );

  return (
    <div className={containerClasses.main}>
      <div className={containerClasses.topRow}>
        {topSkeletons}
        <Skeleton className="h-10 w-72" />
      </div>
      <div className={containerClasses.middleRow}>{middleSkeletons}</div>
      <Skeleton className="h-screen w-full" />
    </div>
  );
};

export default DashboardSkeleton;
