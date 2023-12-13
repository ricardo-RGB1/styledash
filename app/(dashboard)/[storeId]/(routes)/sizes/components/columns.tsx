"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"


/**
 * Represents a column in the sizes component.
 */
export type SizeColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

/**
 * Represents the columns configuration for the sizes table.
 */
export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  }, 
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]

