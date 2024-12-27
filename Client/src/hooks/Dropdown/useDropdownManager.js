import { useState, useEffect } from 'react';

export function useDropdownManager() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return {
    openDropdown,
    handleDropdownToggle,
  };
} 