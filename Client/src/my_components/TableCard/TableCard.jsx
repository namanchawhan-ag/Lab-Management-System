import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PropTypes from "prop-types";

export function TableCard({ entries }) {
  const uniqueCategories = useMemo(
    () => [...new Set(Object.values(entries).flatMap(lab => Object.keys(lab)))].sort(),
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
            <TableHead className="w-[200px]">Lab Name</TableHead>
            {uniqueCategories.map((category) => (
              <TableHead key={category} className="w-[150px]">
                {category}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {labEntries.map(([labName, categories]) => (
            <TableRow key={labName}>
              <TableCell className="font-medium">{labName}</TableCell>
              {uniqueCategories.map((category) => (
                <TableCell key={`${labName}-${category}`}>
                  {categories[category] || '0'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

TableCard.propTypes = {
  entries: PropTypes.objectOf(
    PropTypes.objectOf(PropTypes.number)
  ).isRequired,
};
