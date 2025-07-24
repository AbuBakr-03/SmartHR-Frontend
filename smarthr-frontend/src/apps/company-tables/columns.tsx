"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Actionscell from "./actioncell";
import { type company_type } from "@/apis/companyapis";

export const columns: ColumnDef<company_type>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <img
              src={company.logo}
              alt={company.name}
              className="h-6 w-6 rounded-full border object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/default-company-logo.png";
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
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
