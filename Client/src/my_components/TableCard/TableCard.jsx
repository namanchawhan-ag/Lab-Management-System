import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableCard({ entries }) {
  const uniqueCategories = [
    ...new Set(
      Object.values(entries).flatMap(lab => Object.keys(lab))
    )
  ];

  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Lab Name</TableHead>
          {uniqueCategories.map((category) => (
            <TableHead key={category} className="w-[150px]">{category}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(entries).map(([labName, categories]) => (
          <TableRow key={labName}>
            <TableCell className="font-medium">{labName}</TableCell>
            {uniqueCategories.map((category) => (
              <TableCell key={category}>
                {categories[category] || '0'}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
