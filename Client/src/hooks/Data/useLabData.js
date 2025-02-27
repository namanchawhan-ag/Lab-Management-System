import { getLabData, postLabData } from "@/services/data.service.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useToast } from "../use-toast";

export const useLabData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["labData"],
    queryFn: () => getLabData(),
  });

  const mutation = useMutation({
    mutationFn: postLabData,
    onSuccess: (data) => {
      if (data.total_labs == "0") {
        queryClient.invalidateQueries(["labData"]);
        toast({
          variant: "destructive",
          title: "No data found!!",
          description: "There are no labs with the selected filters",
        });
        sessionStorage.clear();
      } else {
        queryClient.setQueryData(["labData"], data);
      }
    },
  });

  const option = useMemo(() => {
    if (!data?.categories) return [];

    return [
      {
        name: "Lab Name",
        options:
          data?.categories.lab_names[0] === null
            ? []
            : data?.categories.lab_names,
      },
      {
        name: "Main Food Category",
        options:
          data?.categories.food_categories[0] === null
            ? []
            : data?.categories.food_categories,
      },
      {
        name: "Test Sub Category",
        options:
          data?.categories.test_categories[0] === null
            ? []
            : data?.categories.test_categories,
      },
    ];
  }, [data]);

  const gridItems = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: 1,
        name: "Total Labs",
        value: data?.total_labs,
      },
      {
        id: 2,
        name: "Total Entries",
        value: data?.total_entries,
      },
      {
        id: 3,
        name: "Main Food Categories",
        value: data?.total_food_categories,
      },
      {
        id: 4,
        name: "Test Sub Categories",
        value: data?.total_test_categories,
      },
    ];
  }, [data]);

  const dropdownOptions = useMemo(() => {
    if (!option) return [];

    return [
      { id: 1, name: "Lab Name", options: option[0]?.options },
      { id: 2, name: "Main Food Category", options: option[1]?.options },
      { id: 3, name: "Test Sub Category", options: option[2]?.options },
    ];
  }, [option]);

  return {
    data,
    isPending,
    isError,
    error,
    gridItems,
    dropdownOptions,
    mutation,
  };
};
