"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { status as statuss } from "./ApplicationData";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Actionscell from "./actioncell";
import { type application_type } from "@/apis/applicationapis";

export const columns: ColumnDef<application_type>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "residence",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Residence" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      // Get the status object from the row
      const statusObject = row.getValue("status") as {
        id: number;
        title: string;
        slug: string;
      };

      // Find the matching status configuration by title
      const status = statuss.find(
        (status) => status.value === statusObject.title,
      );

      if (!status) {
        // Fallback: display the status title even if no icon is found
        return <span>{statusObject.title}</span>;
      }

      return (
        <>
          {status.value == "Approved for Interview" && (
            <div className="flex items-center justify-center justify-self-center rounded-xl border border-green-600 px-2 py-1 text-xs">
              {status.icon && (
                <status.icon className="mr-2 h-4 w-4 text-green-500" />
              )}

              <span>{status.label}</span>
            </div>
          )}
          {status.value == "Pending" && (
            <div className="flex items-center justify-center justify-self-center rounded-xl border border-yellow-600 px-2 py-1 text-xs">
              {status.icon && (
                <status.icon className="mr-2 h-4 w-4 text-yellow-500" />
              )}

              <span>{status.label}</span>
            </div>
          )}
          {status.value == "Rejected" && (
            <div className="flex items-center justify-center justify-self-center rounded-xl border border-red-600 px-2 py-1 text-xs">
              {status.icon && (
                <status.icon className="mr-2 h-4 w-4 text-red-500" />
              )}

              <span>{status.label}</span>
            </div>
          )}
        </>
      );
    },
    filterFn: (row, id, value) => {
      // Get the status object and extract the title for filtering
      const statusObject = row.getValue(id) as {
        id: number;
        title: string;
        slug: string;
      };
      return value.includes(statusObject.title);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actionscell item={row.original} />;
    },
  },
];
