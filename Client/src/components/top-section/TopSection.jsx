import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { useLabData } from "@/hooks/data/useLabData";
import createRequestBody from "@/lib/createRequestBody";
import { memo } from "react";
import { useQueryClient } from "@tanstack/react-query";

const LazyDropdownContainer = lazy(() =>
  import("@/components/dropdown-container/DropdownContainer")
);

const TopSection = memo(function TopSection({
  dropdownOptions,
  setIsFetchingFilteredData,
  initialData,
}) {
  const queryClient = useQueryClient();
  const mutation = useLabData().mutation;

  const handleSearch = async () => {
    if (
      sessionStorage.getItem("Lab Name") === null &&
      sessionStorage.getItem("Main Food Category") === null &&
      sessionStorage.getItem("Test Sub Category") === null
    ) {
      queryClient.setQueryData(["labData"], initialData);
      return;
    }
    
    setIsFetchingFilteredData(true);
    const requestBody = createRequestBody();
    try {
      await mutation.mutateAsync(requestBody);
      setIsFetchingFilteredData(false);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setIsFetchingFilteredData(false);
    }
  };

  return (
    <div className="flex items-center mb-2 gap-2 justify-between">
      {dropdownOptions.map((option) => (
        <Suspense
          key={option.id}
          fallback={<Skeleton className="h-10 w-full" />}
        >
          <LazyDropdownContainer
            key={option.id}
            name={option.name}
            options={option.options}
          />
        </Suspense>
      ))}
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
});

TopSection.propTypes = {
  dropdownOptions: PropTypes.array,
  setIsFetchingFilteredData: PropTypes.func,
};

export default TopSection;
