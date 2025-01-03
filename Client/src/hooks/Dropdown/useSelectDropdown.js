import { useState, useCallback, useMemo } from "react";
import { postLabData } from "@/services/data.service.js";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useSelectDropdown(
  options,
  name,
  selectedOptions,
  onSelectionChange,
  allSelectedValues,
  setSelectedValues
) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const isAllSelected =
    selectedOptions.length === options.length && options.length > 0;

  const createRequestBody = (newSelection) => {
    const requestBody = {};

    if (name === "Lab Name") {
      if (newSelection.length > 0) requestBody.lab_name = newSelection;
    } else if (allSelectedValues["Lab Name"]?.length > 0) {
      requestBody.lab_name = allSelectedValues["Lab Name"];
    }

    if (name === "Main Food Category") {
      if (newSelection.length > 0)
        requestBody.main_food_category = newSelection;
    } else if (allSelectedValues["Main Food Category"]?.length > 0) {
      requestBody.main_food_category = allSelectedValues["Main Food Category"];
    }

    if (name === "Test Sub Category") {
      if (newSelection.length > 0) requestBody.test_sub_category = newSelection;
    } else if (allSelectedValues["Test Sub Category"]?.length > 0) {
      requestBody.test_sub_category = allSelectedValues["Test Sub Category"];
    }

    return requestBody;
  };

  const toggleSelectAll = useCallback(async () => {
    const newSelection = isAllSelected ? [] : [...options];

    const requestBody = createRequestBody(newSelection);

    try {
      const data = await postLabData(requestBody);
      if (data.total_labs == "0") {
        queryClient.invalidateQueries(["labData"]);
        setSelectedValues({
          "Lab Name": [],
          "Main Food Category": [],
          "Test Sub Category": [],
        });

        toast({
          variant: "destructive",
          title: "No data found!!",
          description: "There are no labs with the selected filters",
        })
      } else {
        queryClient.setQueryData(["labData"], data);
        onSelectionChange(newSelection);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }, [
    options,
    isAllSelected,
    onSelectionChange,
    name,
    allSelectedValues,
    queryClient,
  ]);

  const toggleOption = useCallback(
    async (option) => {
      const isSelected = selectedOptions.includes(option);
      const newSelection = isSelected
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];

      const requestBody = createRequestBody(newSelection);

      try {
        const data = await postLabData(requestBody);
        if (data.total_labs == "0") {
          queryClient.invalidateQueries(["labData"]);
          setSelectedValues({
            "Lab Name": [],
            "Main Food Category": [],
            "Test Sub Category": [],
          });

          toast({
            variant: "destructive",
            title: "No data found!!",
            description: "There are no labs with the selected filters",
          })
        } else {
          queryClient.setQueryData(["labData"], data);
          onSelectionChange(newSelection);
        }
      } catch (error) {
        console.error("Error updating data:", error);
      }
    },
    [selectedOptions, onSelectionChange, name, allSelectedValues, queryClient]
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [options, searchTerm]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return {
    searchTerm,
    isAllSelected,
    toggleSelectAll,
    toggleOption,
    handleSearchChange,
    filteredOptions,
  };
}
