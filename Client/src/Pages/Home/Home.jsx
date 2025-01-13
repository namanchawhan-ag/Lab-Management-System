import { useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import GridContainer from "@/my_components/GridContainer/GridContainer";
import { DropdownContainer } from "@/my_components/DropdownContainer/DropdownContainer";
import BarChartCard from "@/my_components/BarChartCard/BarChartCard";
import { TableCard } from "@/my_components/TableCard/TableCard";
import { useLabData } from "@/hooks/Data/useLabData";
import { Button } from "@/components/ui/button";
import { postLabData } from "@/services/data.service";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function Home() {
  const [selectedLabName, setSelectedLabName] = useState([]);
  const [selectedMainFoodCategory, setSelectedMainFoodCategory] = useState([]);
  const [selectedTestSubCategory, setSelectedTestSubCategory] = useState([]);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isPending, isError, error, gridItems, option } = useLabData();

  console.log(option);

  const handleSelectionChange = useCallback((dropdownName, selectedOptions) => {
    if (dropdownName === "Lab Name") {
      setSelectedLabName(selectedOptions);
    } else if (dropdownName === "Main Food Category") {
      setSelectedMainFoodCategory(selectedOptions);
    } else if (dropdownName === "Test Sub Category") {
      setSelectedTestSubCategory(selectedOptions);
    }
  }, []);

  const createRequestBody = () => {
    const requestBody = {};

    requestBody.lab_name = selectedLabName;
    requestBody.main_food_category = selectedMainFoodCategory;
    requestBody.test_sub_category = selectedTestSubCategory;

    return requestBody;
  };

  const handleSearch = async () => {
    const requestBody = createRequestBody();
    try {
      const data = await postLabData(requestBody);
      if (data.total_labs == "0") {
        queryClient.invalidateQueries(["labData"]);
        setSelectedLabName([]);
        setSelectedMainFoodCategory([]);
        setSelectedTestSubCategory([]);

        toast({
          variant: "destructive",
          title: "No data found!!",
          description: "There are no labs with the selected filters",
        });
      } else {
        queryClient.setQueryData(["labData"], data);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleFilterClick = (category, value) => {
    if (category === "Lab Name") {
      setSelectedLabName((prevSelectedValues) =>
        prevSelectedValues.filter((item) => item !== value)
      );
    } else if (category === "Main Food Category") {
      setSelectedMainFoodCategory((prevSelectedValues) =>
        prevSelectedValues.filter((item) => item !== value)
      );
    } else if (category === "Test Sub Category") {
      setSelectedTestSubCategory((prevSelectedValues) =>
        prevSelectedValues.filter((item) => item !== value)
      );
    }
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!event.target.closest(".dropdown-container")) {
  //       setOpenDropdown(null);
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);

  const renderContent = () => {
    if (isError) return <div>Error: {error.message}</div>;
    return (
      <>
        <div className="grid grid-cols-4 gap-4 ">
          {isPending
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

        {isPending ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          data && (
            <div className="mt-2 flex flex-col gap-4 ">
              <BarChartCard entries={data.labGroupedEntries} lab={true} />
              {data.total_test_categories != "0" && (
                <BarChartCard entries={data.testGroupedEntries} />
              )}
              <div className="rounded-xl border text-card-foreground shadow p-4">
                <div className="p-2 space-y-1.5 flex flex-col mb-4">
                  <div className="font-semibold leading-none tracking-tight">
                    Lab Table
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Main Food Categories
                  </div>
                </div>
                <TableCard entries={data.crossTabMatrix} />
              </div>
            </div>
          )
        )}
      </>
    );
  };
  console.log("Home");

  return (
    <div className="mb-2">
      <div className="flex items-center mb-2 gap-2 justify-between">
        <DropdownContainer
          key="1"
          name="Lab Name"
          options={option?.[0]?.options}
          onSelectionChange={(selected) =>
            handleSelectionChange("Lab Name", selected)
          }
          selectedOptions={selectedLabName}
          setSelectedValues={setSelectedLabName}
        />
        <DropdownContainer
          key="2"
          name="Main Food Category"
          options={option?.[1]?.options}
          onSelectionChange={(selected) =>
            handleSelectionChange("Main Food Category", selected)
          }
          selectedOptions={selectedMainFoodCategory}
          setSelectedValues={setSelectedMainFoodCategory}
        />
        <DropdownContainer
          key="3"
          name="Test Sub Category"
          options={option?.[2]?.options}
          onSelectionChange={(selected) =>
            handleSelectionChange("Test Sub Category", selected)
          }
          selectedOptions={selectedTestSubCategory}
        />

        {!isPending && (
          <Button
            className="bg-black hover:bg-muted-foreground motion-blur-in-md motion-duration-[2s] motion-opacity-in-0"
            onClick={handleSearch}
          >
            Search
          </Button>
        )}
      </div>
      <div className="flex gap-2 mb-2">
        {selectedLabName.length > 0 &&
          selectedLabName.map((value, index) => (
            <button
              key={index}
              className="rounded-md bg-destructive text-destructive-foreground hover:opacity-50 text-white py-1 px-2 text-xs"
              onClick={() => handleFilterClick("Lab Name", value)}
            >
              {value}
            </button>
          ))}
        {selectedMainFoodCategory.length > 0 &&
          selectedMainFoodCategory.map((value, index) => (
            <button
              key={index}
              className="rounded-md bg-destructive text-destructive-foreground hover:opacity-50 text-white py-1 px-2 text-xs"
              onClick={() => handleFilterClick("Main Food Category", value)}
            >
              {value}
            </button>
          ))}
        {selectedTestSubCategory.length > 0 &&
          selectedTestSubCategory.map((value, index) => (
            <button
              key={index}
              className="rounded-md bg-destructive text-destructive-foreground hover:opacity-50 text-white py-1 px-2 text-xs"
              onClick={() => handleFilterClick("Test Sub Category", value)}
            >
              {value}
            </button>
          ))}
      </div>
      {renderContent()}
    </div>
  );
}

export default Home;
