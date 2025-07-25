"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Actionscell from "./actioncell";
import { type predicted_type } from "@/apis/predictedapis";

export const columns: ColumnDef<predicted_type>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    id: "candidate_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Candidate Name" />
    ),
    cell: ({ row }) => {
      const prediction = row.original;
      return <span>{prediction.interview.application.name}</span>;
    },
  },
  {
    id: "job_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => {
      const prediction = row.original;
      return <span>{prediction.interview.application.job.title}</span>;
    },
  },
  {
    id: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const prediction = row.original;
      return <span>{prediction.interview.application.job.company.name}</span>;
    },
  },
  {
    id: "interview_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Interview Date" />
    ),
    cell: ({ row }) => {
      const prediction = row.original;
      const date = prediction.interview.date;

      if (!date) {
        return <span className="text-muted-foreground">Not scheduled</span>;
      }

      return <span>{format(new Date(date), "PPP")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as {
        id: number;
        title: string;
        slug: string;
      };
      return <span>{status.title}</span>;
    },
  },
  {
    accessorKey: "evaluation_score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ row }) => {
      const score = row.getValue("evaluation_score") as number | null;
      return (
        <span>
          {score !== null ? `${score.toFixed(1)}/5.0` : "Not evaluated"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actionscell item={row.original} />;
    },
  },
];
