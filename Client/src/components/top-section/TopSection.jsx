import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { postLabData } from "@/services/data.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLabData } from "@/hooks/Data/useLabData";

const LazyDropdownContainer = lazy(() =>
  import("@/components/dropdown-container/DropdownContainer")
);

export function TopSection({ dropdownOptions, setIsLoading }) {
  const mutation = useLabData().mutation;

  const createRequestBody = () => {
    const requestBody = {};

    if (sessionStorage.getItem("Lab Name") != null) {
      requestBody.lab_name = JSON.parse(sessionStorage.getItem("Lab Name"));
    }
    if (sessionStorage.getItem("Main Food Category") != null) {
      requestBody.main_food_category = JSON.parse(
        sessionStorage.getItem("Main Food Category")
      );
    }
    if (sessionStorage.getItem("Test Sub Category") != null) {
      requestBody.test_sub_category = JSON.parse(
        sessionStorage.getItem("Test Sub Category")
      );
    }

    return requestBody;
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const requestBody = createRequestBody();
    try {
      await mutation.mutateAsync(requestBody);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
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
}

TopSection.propTypes = {
  dropdownOptions: PropTypes.array,
};
