import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PropTypes from "prop-types";

export function TableCard({ entries }) {
  const uniqueCategories = [
    ...new Set(
      entries.flatMap((entry) =>
        entry.main_food_category.map((food) => food.category)
      )
    ),
  ];

  if (!entries || Object.keys(entries).length === 0) {
    return <div>No data available</div>;
  }
  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Lab Name</TableHead>
            {uniqueCategories.map((category) => (
              <TableHead key={category} className="w-[150px]">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger className="">
                      {category?.slice(0, 15)}...
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{category}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.lab_name}>
              <TableCell className="font-medium w-[250px]">
                {entry.lab_name}
              </TableCell>
              {uniqueCategories.map((category) => {
                const foundCategory = entry.main_food_category.find(
                  (food) => food.category === category
                );
                return (
                  <TableCell
                    key={`${entry.lab_name}-${category}`}
                    className="bg-muted mx-1 rounded hover:cursor-pointer hover:bg-card hover:text-card-foreground w-[142px]"
                  >
                    <span className="text-muted-foreground ml-1">
                      {foundCategory ? foundCategory.entry_count : "-"}
                    </span>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

TableCard.propTypes = {
  entries: PropTypes.array.isRequired,
};
