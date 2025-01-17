import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';

const DropdownTrigger = memo(function DropdownTrigger({ 
  name, 
  onClick, 
  isOpen, 
  triggerRef 
}) {
  const selectedOptions = JSON.parse(sessionStorage.getItem(name));
  const selectedCount = selectedOptions?.length;

  const buttonClasses = useMemo(() => (
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl " +
    "border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background " +
    "placeholder:text-muted-foreground focus:outline-none focus:ring-1 " +
    "focus:ring-card focus:ring-offset-2 hover:bg-secondary"
  ), []);

  const ariaProps = useMemo(() => ({
    'aria-expanded': isOpen,
    'aria-haspopup': "listbox",
    'aria-controls': isOpen ? "dropdown-list" : undefined
  }), [isOpen]);

  return (
    <button
      ref={triggerRef}
      className={buttonClasses}
      onClick={onClick}
      {...ariaProps}
    >
      <span className='font-medium'>{name}</span>
      {selectedCount > 0 && (
        <span className="ml-2 text-xs text-muted-foreground">
          {selectedCount}
        </span>
      )}
    </button>
  );
});

DropdownTrigger.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  triggerRef: PropTypes.object.isRequired,
};

export { DropdownTrigger }; 