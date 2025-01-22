import { Skeleton } from "@/components/ui/skeleton";
import { useLabData } from "@/hooks/data/useLabData";
import Error from "@/components/error/Error";
import { Suspense, lazy } from "react";
import { useState } from "react";
import TextLoader from "@/components/text-loader/TextLoader";
import DashboardSkeleton from "@/components/dashboard-skeleton/DashboardSkeleton";
import GridSection from "@/components/grid-section/GridSection";
import TopSection from "@/components/top-section/TopSection";
import { useEffect } from "react";

const LazyBarChartCard = lazy(() =>
  import("@/components/bar-chart-card/BarChartCard")
);
const LazyTableCard = lazy(() => import("@/components/table-card/TableCard"));

function Home() {
  const [initialData, setInitialData] = useState(null);
  const [isFetchingFilteredData, setIsFetchingFilteredData] = useState(false);
  const { data, isPending, isError, error, gridItems, dropdownOptions } =
    useLabData();

  window.onload = () => sessionStorage.clear();

  useEffect(() => {
    if (!initialData && data) setInitialData(data);
  }, [data]);

  if (isFetchingFilteredData)
    return <TextLoader text="Fetching Filtered Data..." />;
  if (isError) return <Error error={error} />;
  if (isPending) return <DashboardSkeleton />;

  return (
    <main className="py-2 px-4">
      <div className="mb-2 motion-duration-[4s] motion-opacity-in-0 ">
        <TopSection
          dropdownOptions={dropdownOptions}
          setIsFetchingFilteredData={setIsFetchingFilteredData}
          initialData={initialData}
        />

        <GridSection gridItems={gridItems} />

        <div className="mt-2 flex flex-col gap-4">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyBarChartCard entries={data.labGroupedEntries} lab={true} />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyBarChartCard entries={data.testGroupedEntries} />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyTableCard entries={data.crossTabMatrix} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default Home;
