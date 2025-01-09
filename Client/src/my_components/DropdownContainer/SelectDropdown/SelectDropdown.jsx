import { useRef, useEffect, memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { DropdownOptions } from "./DropdownOptions/DropdownOptions";
import { DropdownTrigger } from "./DropdownTrigger/DropdownTrigger";
import { useSelectDropdown } from "@/hooks/Dropdown/useSelectDropdown";

const SelectDropdown = memo(function SelectDropdown({ 
  name, 
  options, 
  isOpen, 
  onToggle,
  onSelectionChange,
  selectedOptions,
  allSelectedValues,
  setSelectedValues
}) {
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState("auto");

  const {
    searchTerm,
    isAllSelected,
    toggleSelectAll,
    toggleOption,
    handleSearchChange,
    filteredOptions,
  } = useSelectDropdown(options, name, selectedOptions, onSelectionChange, allSelectedValues, setSelectedValues);

  useEffect(() => {
    if (isOpen) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      if (triggerRef.current) {
        setDropdownWidth(`${triggerRef.current.offsetWidth}px`);
      }
    }
  }, [isOpen]);

  const handleTriggerClick = useCallback((e) => {
    e.stopPropagation();
    onToggle();
  }, [onToggle]);
  return (
    <div className="relative">
      <DropdownTrigger
        name={name}
        selectedCount={selectedOptions.length}
        onClick={handleTriggerClick}
        isOpen={isOpen}
        triggerRef={triggerRef}
      />

      {isOpen && (
        <div
          className="absolute bg-card shadow rounded-md mt-1 z-50 max-h-96 overflow-hidden text-card-foreground whitespace-nowrap max-w-screen-sm"
          style={{ maxWidth: dropdownWidth, minWidth: dropdownWidth }}
          role="listbox"
          id="dropdown-list"
        >
          <div className="w-full">
            <DropdownOptions
              options={filteredOptions.length > 0 ? filteredOptions : options }
              selectedOptions={selectedOptions}
              onToggleOption={toggleOption}
              name={name}
              isAllSelected={isAllSelected}
              onToggleAll={toggleSelectAll}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              searchInputRef={searchInputRef}
            />
          </div>
        </div>
      )}
    </div>
  );
});

SelectDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  dependencies: PropTypes.shape({
    labName: PropTypes.arrayOf(PropTypes.string),
    mainFoodCategory: PropTypes.arrayOf(PropTypes.string)
  }),
  onSelectionChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  allSelectedValues: PropTypes.object.isRequired
};

export default SelectDropdown;
