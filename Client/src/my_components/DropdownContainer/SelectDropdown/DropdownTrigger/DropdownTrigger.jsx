import PropTypes from 'prop-types';

export function DropdownTrigger({ name, selectedCount, onClick, isOpen, triggerRef }) {
  return (
    <button
      ref={triggerRef}
      className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-lg border bg-transparent px-3 hover:bg-slate-100 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring hover:bg-muted"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={isOpen ? "dropdown-list" : undefined}
    >
      <span className='font-medium'>{name}</span>
      {selectedCount > 0 && (
        <span className="ml-2 text-xs text-gray-500">
          ({selectedCount})
        </span>
      )}
    </button>
  );
}

DropdownTrigger.propTypes = {
  name: PropTypes.string.isRequired,
  selectedCount: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  triggerRef: PropTypes.object.isRequired,
}; 