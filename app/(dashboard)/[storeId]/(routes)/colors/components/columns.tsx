"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

/**
 * Represents a column in the sizes component.
 */
export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

/**
 * Represents the columns configuration for the color table.
 */
export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => ( // row.original.value is the hex value of the color
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div // this div is the color preview
          className="h-6 w-6 rounded-full border" // rounded-full makes it a circle
          style={{ backgroundColor: row.original.value }} 
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
