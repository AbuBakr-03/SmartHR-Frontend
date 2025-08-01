"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Actionscell from "./actioncell";
import { type job_type } from "@/apis/jobapis";

export const columns: ColumnDef<job_type>[] = [
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
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Application Deadline" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("end_date") as Date;
      return <span>{format(new Date(date), "PPP")}</span>;
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const company = row.getValue("company") as {
        id: number;
        name: string;
        slug: string;
        logo: string;
      };

      return <span>{company.name}</span>;
    },
    filterFn: (row, id, value) => {
      // Get the company object and extract the name for filtering
      const companyObject = row.getValue(id) as {
        id: number;
        name: string;
        slug: string;
        logo: string;
      };
      return value.includes(companyObject.name);
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const department = row.getValue("department") as {
        id: number;
        title: string;
        slug: string;
      };
      return <span>{department.title}</span>;
    },
    filterFn: (row, id, value) => {
      const department = row.getValue(id) as {
        id: number;
        title: string;
        slug: string;
      };
      return value.includes(department.title);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actionscell item={row.original} />;
    },
  },
];
