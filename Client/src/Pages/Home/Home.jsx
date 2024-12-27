import { useCallback, useState } from "react";
import { DropdownContainer } from "@/my_components/DropdownContainer/DropdownContainer";
import { useDropdownManager } from "@/hooks/Dropdown/useDropdownManager";
import GridContainer from "@/my_components/GridContainer/GridContainer";
import { useLabData } from "@/hooks/Data/useLabData";
import { Skeleton } from "@/components/ui/skeleton";

function Home() {
  const { openDropdown, handleDropdownToggle } = useDropdownManager();
  const [selectedValues, setSelectedValues] = useState({
    "Lab Name": [],
    "Main Food Category": [],
    "Test Sub Category": [],
  });

  const {
    isLoading,
    isError,
    error,
    dropdowns,
    gridItems,
  } = useLabData();

  const handleSelectionChange = useCallback((dropdownName, selectedOptions) => {
    setSelectedValues((prev) => ({
      ...prev,
      [dropdownName]: selectedOptions,
    }));
  }, []);

  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (isError) return <Error error={error} />;

  return (
    <>
      <div className="flex items-center gap-2 justify-between">
        {dropdowns.map((dropdown) => (
          <DropdownContainer
            key={dropdown.name}
            name={dropdown.name}
            options={dropdown.options}
            isOpen={openDropdown === dropdown.name}
            onToggle={() => handleDropdownToggle(dropdown.name)}
            dependencies={{
              labName: selectedValues["Lab Name"],
              mainFoodCategory: selectedValues["Main Food Category"],
            }}
            onSelectionChange={(selected) =>
              handleSelectionChange(dropdown.name, selected)
            }
            selectedOptions={selectedValues[dropdown.name]}
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {gridItems.map((item) => (
          <GridContainer key={item.id} name={item.name} value={item.value} />
        ))}
      </div>
    </>
  );
}

export default Home;
