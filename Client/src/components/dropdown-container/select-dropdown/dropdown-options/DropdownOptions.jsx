import PropTypes from "prop-types";
import { memo, useCallback, useMemo } from "react";
import { DropdownSearch } from "./dropdown-search/DropdownSearch";
import DropdownRow from "./dropdown-row/DropdownRow";

const DropdownOptions = memo(function DropdownOptions({
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
  const onRemoveFilters = useCallback(() => {
    sessionStorage.removeItem(name);
    setSelectedOptions([]);
  }, [name, setSelectedOptions]);

  const handleToggleAll = useCallback(
    (e) => {
      e.stopPropagation();
      onToggleAll();
    },
    [onToggleAll]
  );

  const buttonClasses = useMemo(
    () => ({
      base: "hover:opacity-90 py-2.5 flex-1 text-center",
      toggleAll: `${
        isAllSelected
          ? "bg-primary text-primary-foreground hover:opacity-90"
          : "hover:bg-primary hover:text-primary-foreground"
      } border-r`,
      removeFilters: "hover:bg-primary hover:text-primary-foreground",
    }),
    [isAllSelected]
  );

  const sortedOptions = useMemo(() => {
    const selected = options?.filter((option) =>
      selectedOptions?.includes(option)
    );
    const unselected = options?.filter(
      (option) => !selectedOptions?.includes(option)
    );
    return [...selected, ...unselected];
  }, [options, selectedOptions]);

  const optionsList = useMemo(
    () =>
      sortedOptions.map((option, index) => (
        <DropdownRow
          key={`${index}`}
          index={index}
          option={option}
          selectedOptions={selectedOptions}
          onToggleOption={onToggleOption}
        />
      )),
    [sortedOptions, selectedOptions, onToggleOption]
  );

  return (
    <>
      <div className="flex cursor-pointer relative items-center text-sm rounded">
        <button
          className={`${buttonClasses.base} ${buttonClasses.toggleAll}`}
          onClick={handleToggleAll}
        >
          <span className="font-semibold">
            {isAllSelected ? "Unselect All" : "Select All"}
          </span>
        </button>
        <button
          className={`${buttonClasses.base} ${buttonClasses.removeFilters}`}
          onClick={onRemoveFilters}
        >
          <span className="font-semibold">Remove Filters</span>
        </button>
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
          <div className="flex flex-col">{optionsList}</div>
        )}
      </div>
    </>
  );
});

DropdownOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  selectedOptions: PropTypes.arrayOf(PropTypes.string),
  onToggleOption: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchInputRef: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};

export { DropdownOptions };
