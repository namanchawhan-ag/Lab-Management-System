import { useState, useCallback, useMemo } from "react";

export function useSelectDropdown(options, name, setSelectedOptions) {
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOptions = JSON.parse(sessionStorage.getItem(name)) || [];
  const isAllSelected =
    Array.isArray(selectedOptions) &&
    Array.isArray(options) &&
    selectedOptions.length === options?.length &&
    options.length > 0;

  const toggleSelectAll = useCallback(async () => {
    const newSelection = isAllSelected ? [] : [...(options || [])];
    sessionStorage.setItem(name, JSON.stringify(newSelection));
    setSelectedOptions(newSelection);
  }, [options, isAllSelected, name, setSelectedOptions]);

  const toggleOption = useCallback(
    async (option, checked) => {
      const currentSelection = JSON.parse(sessionStorage.getItem(name)) || [];
      const newSelection = !checked
        ? currentSelection.filter((item) => item !== option)
        : [...currentSelection, option];

      sessionStorage.setItem(name, JSON.stringify(newSelection));
      setSelectedOptions(newSelection);
    },
    [name, setSelectedOptions]
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return null;
    const normalizedSearchTerm = searchTerm
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    return (
      options?.filter((option) =>
        option
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, " ")
          .includes(normalizedSearchTerm)
      ) || []
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
