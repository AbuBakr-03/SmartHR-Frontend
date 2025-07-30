"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Actionscell from "./actioncell";
import { type predicted_type } from "@/apis/predictedapis";
import { status as statuss } from "./PredictedData";

export const columns: ColumnDef<predicted_type>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    id: "candidate_name",
    accessorFn: (row) => row.interview.application.name,

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
    accessorFn: (row) => row.interview.application.job.title,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => {
      const prediction = row.original;
      return <span>{prediction.interview.application.job.title}</span>;
    },
    filterFn: (row, _id, value) => {
      const predictionObject = row.original.interview.application.job;
      return value.includes(predictionObject.title);
    },
  },
  {
    id: "company_name",
    accessorFn: (row) => row.interview.application.job.company.name,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const prediction = row.original;
      return <span>{prediction.interview.application.job.company.name}</span>;
    },
    filterFn: (row, _id, value) => {
      const companyObject = row.original.interview.application.job.company;
      return value.includes(companyObject.name);
    },
  },
  {
    id: "interview_date",
    accessorFn: (row) => row.interview.date,

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
          {status.value == "Hired" && (
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
      const statusObject = row.getValue(id) as {
        id: number;
        title: string;
        slug: string;
      };
      return value.includes(statusObject.title);
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
