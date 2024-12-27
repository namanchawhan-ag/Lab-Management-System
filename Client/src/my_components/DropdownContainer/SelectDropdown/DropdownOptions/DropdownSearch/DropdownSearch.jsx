import { IoIosSearch } from "react-icons/io";
import PropTypes from 'prop-types';

export function DropdownSearch({ searchTerm, onSearchChange, searchInputRef }) {
  return (
    <div className=" flex items-center justify-start px-4 border-t border-b gap-2">
      <IoIosSearch size={20} aria-hidden="true" />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full py-3 text-sm focus:outline-none"
        aria-label="Search options"
      />
    </div>
  );
}

DropdownSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchInputRef: PropTypes.object.isRequired,
}; 