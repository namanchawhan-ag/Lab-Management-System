import { useState, useCallback, useMemo } from 'react';
import { useLabData } from '../Data/useLabData';

export function useSelectDropdown(options, name, dependencies = {}, selectedOptions, onSelectionChange) {
  const { labData } = useLabData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    let filtered = [...options];

    if (name === "Main Food Category" && dependencies.labName?.length > 0) {
      const labSpecificCategories = labData
        .filter(item => dependencies.labName.includes(item.lab_name))
        .map(item => item.main_food_category);
      filtered = filtered.filter(option => labSpecificCategories.includes(option));
    }

    if (name === "Test Sub Category" && 
        (dependencies.labName?.length > 0 || dependencies.mainFoodCategory?.length > 0)) {
      let filteredData = labData;
      
      if (dependencies.labName?.length > 0) {
        filteredData = filteredData.filter(item => 
          dependencies.labName.includes(item.lab_name)
        );
      }
      
      if (dependencies.mainFoodCategory?.length > 0) {
        filteredData = filteredData.filter(item => 
          dependencies.mainFoodCategory.includes(item.main_food_category)
        );
      }

      const validTestCategories = filteredData.map(item => item.test_sub_category);
      filtered = filtered.filter(option => validTestCategories.includes(option));
    }

    return filtered.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, name, dependencies]);

  const isAllSelected = selectedOptions.length === filteredOptions.length && filteredOptions.length > 0;

  const toggleSelectAll = useCallback(() => {
    onSelectionChange(isAllSelected ? [] : [...filteredOptions]);
  }, [filteredOptions, isAllSelected, onSelectionChange]);

  const toggleOption = useCallback((option) => {
    const isSelected = selectedOptions.includes(option);
    if (isSelected) {
      onSelectionChange(selectedOptions.filter(item => item !== option));
    } else {
      onSelectionChange([...selectedOptions, option]);
    }
  }, [selectedOptions, onSelectionChange]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return {
    searchTerm,
    filteredOptions,
    isAllSelected,
    toggleSelectAll,
    toggleOption,
    handleSearchChange
  };
} 