import { useCallback, useState } from "react";
import { DropdownContainer } from "@/my_components/DropdownContainer/DropdownContainer";
import { useDropdownManager } from "@/hooks/Dropdown/useDropdownManager";
import GridContainer from "@/my_components/GridContainer/GridContainer";
import { useLabData } from "@/hooks/Data/useLabData";
import { Skeleton } from "@/components/ui/skeleton";
import BarChartCard from "@/my_components/BarChartCard/BarChartCard";
import { TableCard } from "@/my_components/TableCard/TableCard";

function Home() {
  const { openDropdown, handleDropdownToggle } = useDropdownManager();
  const [selectedValues, setSelectedValues] = useState({
    "Lab Name": [],
    "Main Food Category": [],
    "Test Sub Category": [],
  });

  const { isLoading, isError, error, dropdowns, gridItems, data } =
    useLabData(selectedValues);

  const handleSelectionChange = useCallback((dropdownName, selectedOptions) => {
    setSelectedValues((prev) => ({
      ...prev,
      [dropdownName]: selectedOptions,
    }));
  }, []);

  // Show loading only for the affected parts of the UI
  const renderContent = () => {
    if (isError) return <div>Error: {error.message}</div>;

    return (
      <>
        <div className="grid grid-cols-4 gap-4">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            : gridItems.map((item) => (
                <GridContainer
                  key={item.id}
                  name={item.name}
                  value={item.value}
                />
              ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          data && (
            <div className="mt-2 flex flex-col gap-4">
              <BarChartCard entries={data.labGroupedEntries} lab={true} />
              <BarChartCard entries={data.testGroupedEntries} />
              <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
                <TableCard entries={data.crossTabMatrix} />
              </div>
            </div>
          )
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        {dropdowns.map((dropdown) => (
          <DropdownContainer
            key={dropdown.name}
            name={dropdown.name}
            options={dropdown.options}
            isOpen={openDropdown === dropdown.name}
            onToggle={() => handleDropdownToggle(dropdown.name)}
            onSelectionChange={(selected) =>
              handleSelectionChange(dropdown.name, selected)
            }
            selectedOptions={selectedValues[dropdown.name]}
            allSelectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
          />
        ))}
      </div>
      {renderContent()}
    </div>
  );
}

export default Home;
