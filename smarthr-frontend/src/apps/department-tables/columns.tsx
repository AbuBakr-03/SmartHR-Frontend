"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Actionscell from "./actioncell";
import { type department_type } from "@/apis/departmentapis";

export const columns: ColumnDef<department_type>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },

  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="slug" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <Actionscell item={row.original} />;
    },
  },
];
