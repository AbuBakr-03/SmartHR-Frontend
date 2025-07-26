"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table-visibility";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import { useListJobsPrivate } from "@/hooks/useJob";
import { BriefcaseBusiness, Building2 } from "lucide-react";
import { status } from "./PredictedData";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const jobsData = useListJobsPrivate();

  const jobs_filter = jobsData.data?.map((x) => {
    return { label: x.title, value: x.title, icon: BriefcaseBusiness };
  });
  const companies_filter = jobsData.data?.map((x) => {
    return { label: x.company.name, value: x.company.name, icon: Building2 };
  });

  return (
    <div>
      <div className="flex flex-1 flex-wrap items-center space-y-2 space-x-2 py-4">
        <Input
          placeholder="Filter by candidate name..."
          value={
            (table.getColumn("candidate_name")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("candidate_name")
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("job_title") && (
          <DataTableFacetedFilter
            column={table.getColumn("job_title")}
            title="Position"
            options={jobs_filter ?? []}
          />
        )}
        {table.getColumn("company_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("company_name")}
            title="Company"
            options={companies_filter ?? []}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={status}
          />
        )}

        <DataTableViewOptions table={table} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-center" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
