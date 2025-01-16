import PropTypes from "prop-types";
import { useMemo } from "react";
import { DropdownSearch } from "./dropdown-search/DropdownSearch";

export function DropdownOptions({
  options,
  onToggleOption,
  name,
  isAllSelected,
  onToggleAll,
  searchTerm,
  onSearchChange,
  searchInputRef,
  selectedOptions = [],
  setSelectedOptions,
}) {
  const handleClick = (e, option) => {
    e.stopPropagation();
    const isCurrentlySelected =
      Array.isArray(selectedOptions) && selectedOptions.includes(option);
    onToggleOption(option, !isCurrentlySelected);
  };

  const onRemoveFilters = () => {
    sessionStorage.removeItem(name);
    setSelectedOptions([]);
  };

  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => {
      const aSelected = selectedOptions?.includes(a);
      const bSelected = selectedOptions?.includes(b);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [options, selectedOptions]);

  const Row = ({ index, option }) => {
    if (!option) return null;

    const isSelected =
      Array.isArray(selectedOptions) && selectedOptions.includes(option);

    return (
      <div
        key={index}
        className={`w-full cursor-pointer select-none items-center justify-start py-3 px-4 text-sm rounded ${
          isSelected
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "hover:bg-primary text-muted-foreground hover:text-primary-foreground"
        }`}
        role="option"
        onClick={(e) => handleClick(e, option)}
      >
        {option}
      </div>
    );
  };

  return (
    <>
      <div
        className={`flex cursor-pointer relative items-center text-sm rounded `}
      >
        <div
          className={`hover:opacity-90 py-2.5 flex-1 text-center border-r ${
            isAllSelected
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "hover:bg-primary hover:text-primary-foreground "
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleAll();
          }}
        >
          <span className="font-semibold">
            {isAllSelected ? "Unselect All" : "Select All"}
          </span>
        </div>
        <div
          className={`hover:opacity-90 py-2.5  flex-1 text-center hover:bg-primary hover:text-primary-foreground `}
          onClick={onRemoveFilters}
        >
          <span className="font-semibold">Remove Filters</span>
        </div>
      </div>
      <DropdownSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchInputRef={searchInputRef}
      />

      <div className="overflow-auto max-h-[200px]">
        {sortedOptions.length === 0 ? (
          <div className="py-2 px-4 text-sm text-muted-foreground">
            No options found
          </div>
        ) : (
          <div className="flex flex-col">
            {sortedOptions.map((option, index) => (
              <Row key={index} option={option} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

DropdownOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string),
  onToggleOption: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchInputRef: PropTypes.object.isRequired,
};
