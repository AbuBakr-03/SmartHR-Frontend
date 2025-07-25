"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Plus, CalendarIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DataTablePagination } from "@/components/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table-visibility";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

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
import { useCreateInterviewPrivate } from "@/hooks/useInterview";
import { useListApplicationsPrivate } from "@/hooks/useApplication";
import { toast } from "sonner";

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

  // State for dialog open/close
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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

  const schema = z.object({
    application_id: z.number().min(1, "Please select an application"),
    date: z.date().optional(),
    external_meeting_link: z.string().optional(),
    interview_video: z.any().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      application_id: undefined,
      date: undefined,
      external_meeting_link: "",
      interview_video: undefined,
    },
  });

  const createInterview = useCreateInterviewPrivate();
  const { data: applicationsData } = useListApplicationsPrivate();

  const onSubmit = async (data: FormData) => {
    try {
      const formData = {
        application_id: data.application_id,
        date: data.date ? data.date.toISOString() : null,
        external_meeting_link: data.external_meeting_link || null,
        interview_video: data.interview_video?.[0] || null,
      };

      console.log("Submitting interview:", formData);
      await createInterview.mutateAsync(formData, {
        onSuccess: () => {
          toast.success("Interview scheduled successfully");
        },
        onError: () => {
          toast.error("Error scheduling interview");
        },
      });

      // Reset form and close dialog on successful submission
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // Reset form when dialog opens
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      form.reset({
        application_id: undefined,
        date: undefined,
        external_meeting_link: "",
        interview_video: undefined,
      });
    }
  };

  const applicationOptions = applicationsData?.map((application) => (
    <SelectItem key={application.id} value={application.id.toString()}>
      {application.name} - {application.job.title}
    </SelectItem>
  ));

  return (
    <div>
      <div className="flex flex-1 flex-wrap items-center space-y-2 space-x-2 py-4">
        <Input
          placeholder="Filter by applicant name..."
          value={
            (table.getColumn("application")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("application")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <DataTableViewOptions table={table} />

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size={"sm"} className="h-8 place-self-start lg:flex">
              <Plus className="h-4 w-4" />
              New Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto md:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
              <DialogDescription>
                Schedule an interview for an application.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="grid grid-cols-2 gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="application_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Application</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString() || ""}
                      >
                        <FormControl className="w-full rounded">
                          <SelectTrigger>
                            <SelectValue placeholder="Select an application" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{applicationOptions}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex flex-col">
                      <FormLabel>Interview Date & Time</FormLabel>
                      <Popover modal={false}>
                        <PopoverTrigger asChild>
                          <FormControl className="rounded">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP 'at' p")
                              ) : (
                                <span>Pick interview date and time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                          side="bottom"
                          sideOffset={8}
                          avoidCollisions={true}
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                // Set time to current time if not already set
                                const now = new Date();
                                date.setHours(now.getHours(), now.getMinutes());
                                const fixedDate = new Date(
                                  date.getTime() -
                                    date.getTimezoneOffset() * 60000,
                                );
                                field.onChange(fixedDate);
                              }
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="external_meeting_link"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Meeting Link (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded"
                          placeholder="https://zoom.us/j/123456789"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interview_video"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Interview Video (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="col-span-1"
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  className="col-span-1"
                  type="submit"
                  disabled={createInterview.isPending}
                >
                  {createInterview.isPending
                    ? "Scheduling..."
                    : "Schedule Interview"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
