import PropTypes from "prop-types";
import { DropdownSearch } from "./DropdownSearch/DropdownSearch";

export function DropdownOptions({
  options,
  selectedOptions,
  onToggleOption,
  name,
  isAllSelected,
  onToggleAll,
  searchTerm,
  onSearchChange,
  searchInputRef,
}) {
  const handleClick = (e, option) => {
    e.stopPropagation();
    onToggleOption(option);
  };

  return (
    <>
      <div className="flex justify-between relative items-center rounded-sm py-2.5 px-4 text-sm bg-slate-100">
        <span>{name}</span>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleAll();
            }}
            className="h-3.5 w-3.5"
            aria-label="Select all options"
          />
        </label>
      </div>
      <DropdownSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchInputRef={searchInputRef}
      />

      <div className="overflow-auto max-h-[200px]">
        {options.length === 0 ? (
          <div className="py-2 px-4 text-sm text-gray-500">
            No options found
          </div>
        ) : (
          options.map((option) => (
            <div
              key={option}
              className={`flex gap-2 relative cursor-pointer select-none items-center justify-between rounded-sm py-3 px-4 text-sm hover:bg-slate-50 ${
                selectedOptions.includes(option) ? "bg-slate-100" : ""
              }`}
              onClick={(e) => handleClick(e, option)}
              role="option"
              aria-selected={selectedOptions.includes(option)}
            >
              <span>{option}</span>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={(e) => handleClick(e, option)}
                className="h-3.5 w-3.5"
                aria-label={`Select ${option}`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

DropdownOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleOption: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchInputRef: PropTypes.object.isRequired,
};
