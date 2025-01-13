import { useState, useCallback, useMemo } from "react";

export function useSelectDropdown(
  options,
  name,
  selectedOptions,
  onSelectionChange
) {
  const [searchTerm, setSearchTerm] = useState("");

  const isAllSelected =
    selectedOptions.length === options?.length && options?.length > 0;

  const toggleSelectAll = useCallback(async () => {
    const newSelection = isAllSelected ? [] : [...options];

    onSelectionChange(newSelection);
  }, [options, isAllSelected]);

  const toggleOption = useCallback(
    async (option) => {
      const isSelected = selectedOptions.includes(option);
      const newSelection = isSelected
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];

      onSelectionChange(newSelection);
    },
    [selectedOptions]
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return null;

    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm, options]);

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
