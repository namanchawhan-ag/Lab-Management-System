import { getLabData } from "@/services/labDataServices";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getUniqueValues, getDropdowns, getGridItems } from "@/utils/dataUtils";

export const useLabData = () => {
  const {
    data: labData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["labData"],
    queryFn: getLabData,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const uniqueValues = useMemo(() => getUniqueValues(labData), [labData]);

  const dropdowns = useMemo(() => getDropdowns(uniqueValues), [uniqueValues]);

  const gridItems = useMemo(() => getGridItems(uniqueValues, labData), [uniqueValues, labData]);

  return {
    labData,
    isLoading,
    isError,
    error,
    dropdowns,
    gridItems,
  };
};
