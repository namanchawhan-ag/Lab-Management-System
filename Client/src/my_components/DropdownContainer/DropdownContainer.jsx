import { memo } from "react";
import PropTypes from "prop-types";
import SelectDropdown from "./SelectDropdown/SelectDropdown";

export const DropdownContainer = memo(function DropdownContainer({ 
  name, 
  options, 
  isOpen, 
  onToggle,
  onSelectionChange,
  selectedOptions,
  allSelectedValues,
  setSelectedValues
}) {
  return (
    <div 
      className="dropdown-container w-full"
      role="region"
      aria-label={`${name} dropdown section`}
    >
      <SelectDropdown
        name={name}
        options={options}
        isOpen={isOpen}
        onToggle={onToggle}
        onSelectionChange={onSelectionChange}
        selectedOptions={selectedOptions}
        allSelectedValues={allSelectedValues}
        setSelectedValues={setSelectedValues}
      />
    </div>
  );
});

DropdownContainer.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  dependencies: PropTypes.object,
  onSelectionChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  allSelectedValues: PropTypes.object.isRequired,
  setSelectedValues: PropTypes.func.isRequired
};