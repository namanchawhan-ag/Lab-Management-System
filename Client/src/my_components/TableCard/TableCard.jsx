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
  const uniqueCategories = useMemo(
    () =>
      [
        ...new Set(Object.values(entries).flatMap((lab) => Object.keys(lab))),
      ].sort(),
    [entries]
  );

  const labEntries = useMemo(
    () => Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)),
    [entries]
  );

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
                      {category.slice(0, 15)}...
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
        <TableBody >
          {labEntries.map(([labName, categories]) => (
            <TableRow key={labName}>
              <TableCell className="font-medium w-[250px]">{labName}</TableCell>
              {uniqueCategories.map((category) => (
                <TableCell
                  key={`${labName}-${category}`}
                  className="bg-muted mx-1 rounded hover:cursor-pointer hover:bg-card hover:text-card-foreground w-[142px]"
                >
                  <span className="text-muted-foreground ml-1">
                    {categories[category] || "-"}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableCaption></TableCaption>
        </TableBody>
      </Table>
    </div>
  );
}

TableCard.propTypes = {
  entries: PropTypes.object.isRequired,
};
