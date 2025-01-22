import { useRef, useEffect, memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { DropdownTrigger } from "./dropdown-trigger/DropdownTrigger";
import { useSelectDropdown } from "@/hooks/dropdown/useSelectDropdown";
import { DropdownOptions } from "./dropdown-options/DropdownOptions";

const SelectDropdown = memo(function SelectDropdown({ 
  name, 
  options, 
  isOpen, 
  onToggle,
}) {
  const [selectedOptions, setSelectedOptions] = useState(
    JSON.parse(sessionStorage.getItem(name))
  );
  
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  const {
    searchTerm,
    isAllSelected,
    toggleSelectAll,
    toggleOption,
    handleSearchChange,
    filteredOptions,
  } = useSelectDropdown(options, name, setSelectedOptions);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
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
        onClick={handleTriggerClick}
        isOpen={isOpen}
        triggerRef={triggerRef}
      />

      {isOpen && (
        <div
          className="absolute bg-card rounded-md mt-1 z-50 overflow-hidden text-card-foreground min-w-full border"
          role="listbox"
          id="dropdown-list"
        >
          <div className="w-full">
            <DropdownOptions
              options={filteredOptions == null ? options : filteredOptions}
              onToggleOption={toggleOption}
              name={name}
              isAllSelected={isAllSelected}
              onToggleAll={toggleSelectAll}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              searchInputRef={searchInputRef}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
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
};

export default SelectDropdown;
