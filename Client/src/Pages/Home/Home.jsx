import { Skeleton } from "@/components/ui/skeleton";
import { useLabData } from "@/hooks/Data/useLabData";
import Error from "@/components/error/Error";
import { TopSection } from "@/components/top-section/TopSection";
import { GridSection } from "@/components/grid-section/GridSection";
import { Suspense, lazy } from "react";
import { useState } from "react";
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";

const LazyBarChartCard = lazy(() =>
  import("@/components/bar-chart-card/BarChartCard")
);
const LazyTableCard = lazy(() => import("@/components/table-card/TableCard"));

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { data, isPending, isError, error, gridItems, dropdownOptions } =
    useLabData();

  window.onload = () => sessionStorage.clear();

  if (isLoading)
    return (
      <TextShimmerWave className="flex justify-center items-center h-[calc(100vh-10rem)]">
        Fetching Filtered Data...
      </TextShimmerWave>
    );
  if (isError) return <Error error={error} />;

  return (
    <div className="mb-2 motion-duration-[4s] motion-opacity-in-0 ">
      {!isPending ? (
        <TopSection
          dropdownOptions={dropdownOptions}
          setIsLoading={setIsLoading}
        />
      ) : (
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-72" />
        </div>
      )}

      {!isPending ? (
        <GridSection gridItems={gridItems} />
      ) : (
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {!isPending ? (
        <div className="mt-2 flex flex-col gap-4">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyBarChartCard entries={data.labGroupedEntries} lab={true} />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyBarChartCard entries={data.testGroupedEntries} />
          </Suspense>

          <div className="rounded-xl border text-card-foreground shadow p-4">
            <div className="p-2 space-y-1.5 flex flex-col mb-4">
              <div className="font-semibold leading-none tracking-tight">
                Lab Table
              </div>
              <div className="text-sm text-muted-foreground">
                Main Food Categories
              </div>
            </div>
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <LazyTableCard entries={data.crossTabMatrix} />
            </Suspense>
          </div>
        </div>
      ) : (
        <Skeleton className="h-96 w-full" />
      )}
    </div>
  );
}

export default Home;
