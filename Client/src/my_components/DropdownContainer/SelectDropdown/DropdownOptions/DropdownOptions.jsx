import PropTypes from "prop-types";
import { DropdownSearch } from "./DropdownSearch/DropdownSearch";
import { FixedSizeList as List } from "react-window";

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

  const Row = ({ index, style }) => {
    const option = options[index];
    if(!option) return;
    const isSelected = selectedOptions.includes(option);

    return (
      <div
        key={index}
        className={`flex gap-4 relative cursor-pointer select-none items-center justify-start py-3 px-4 text-sm hover:bg-secondary ${
          isSelected ? "bg-secondary" : ""
        }`}
        onClick={(e) => handleClick(e, option)}
        role="option"
        aria-selected={isSelected}
        style={style} 
      >
        <input
          type="checkbox"
          checked={isSelected}
          className="h-3.5 w-3.5"
          aria-label={`Select ${option}`}
          onChange={(e) => handleClick(e, option)}
          key={index}
        />
        <span>{option}</span>
      </div>
    );
  };
  console.log("DropdownOptions");
  
  return (
    <>
      <div className="flex justify-between relative items-center py-2.5 px-4 text-sm bg-secondary">
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
          <div className="py-2 px-4 text-sm text-muted-foreground">
            No options found
          </div>
        ) : (
          <List
            height={200} 
            itemCount={options.length} 
            itemSize={40} 
            width="100%" 
          >
            {Row}
          </List>
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
