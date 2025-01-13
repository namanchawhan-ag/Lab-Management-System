import { memo } from "react";
import PropTypes from "prop-types";
import SelectDropdown from "./SelectDropdown/SelectDropdown";
import { useDropdownManager } from "@/hooks/Dropdown/useDropdownManager";

export const DropdownContainer = memo(function DropdownContainer({
  name,
  options,
  onSelectionChange,
  selectedOptions,
  setSelectedValues
}) {
  const { openDropdown, handleDropdownToggle } = useDropdownManager();
  console.log("DropdownContainer");
  return (
    <div
      className="dropdown-container w-full motion-blur-in-md motion-duration-[2s] motion-opacity-in-0 z-50 "
      role="region"
      aria-label={`${name} dropdown section`}
    >
      <SelectDropdown
        name={name}
        options={options}
        isOpen={openDropdown}
        onToggle={handleDropdownToggle}
        onSelectionChange={onSelectionChange}
        selectedOptions={selectedOptions}
        setSelectedValues={setSelectedValues}
      />
    </div>
  );
});

DropdownContainer.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  dependencies: PropTypes.object,
  onSelectionChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  allSelectedValues: PropTypes.object.isRequired,
  setSelectedValues: PropTypes.func.isRequired,
};
