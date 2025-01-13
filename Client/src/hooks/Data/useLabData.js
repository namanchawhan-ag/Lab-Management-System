import { getLabData } from "@/services/data.service.js";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useLabData = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["labData"],
    queryFn: () => getLabData(),
  });

  const option = useMemo(() => {
    if (!data?.categories) return [];

    return [
      {
        name: "Lab Name",
        options:
          data.categories.lab_names[0] === null
            ? []
            : data.categories.lab_names,
      },
      {
        name: "Main Food Category",
        options:
          data.categories.food_categories[0] === null
            ? []
            : data.categories.food_categories,
      },
      {
        name: "Test Sub Category",
        options:
          data.categories.test_categories[0] === null
            ? []
            : data.categories.test_categories,
      },
    ];
  }, [data]);

  const gridItems = useMemo(() => {
    if (!data) return [];

    return [
      { id: 1, name: "Total Labs", value: data.total_labs },
      { id: 2, name: "Total Entries", value: data.total_entries },
      { id: 3, name: "Food Categories", value: data.total_food_categories },
      { id: 4, name: "Test Categories", value: data.total_test_categories },
    ];
  }, [data]);

  return {
    data,
    isPending,
    isError,
    error,
    option,
    gridItems,
  };
};
