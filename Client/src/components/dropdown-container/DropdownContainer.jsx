import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import SelectDropdown from "./select-dropdown/SelectDropdown";
import { useDropdownManager } from "@/hooks/dropdown/useDropdownManager";

const DropdownContainer = memo(function DropdownContainer({ name, options }) {
  const { openDropdown, handleDropdownToggle } = useDropdownManager();

  const handleToggle = useCallback(() => {
    handleDropdownToggle();
  }, [handleDropdownToggle]);
  
  return (
    <div
      className="dropdown-container w-full z-50"
      role="region"
      aria-label={`${name} dropdown section`}
    >
      <SelectDropdown
        name={name}
        options={options}
        isOpen={openDropdown}
        onToggle={handleToggle}
      />
    </div>
  );
});

DropdownContainer.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DropdownContainer;
