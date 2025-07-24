"use client";
import * as React from "react";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
import { useCreateApplicationPrivate } from "@/hooks/useApplication";
import { useListJobsPrivate } from "@/hooks/useJob";
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
    name: z.string().min(1, "Name is required"),
    email: z.email("Valid email is required"),
    residence: z.string().min(1, "Residence is required"),
    cover_letter: z.string().min(1, "Cover letter is required"),
    resume: z.any().refine((files) => {
      return files?.[0] instanceof File;
    }, "Please select a resume file"),
    job_id: z.number().min(1, "Please select a job"),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      residence: "",
      cover_letter: "",
      resume: undefined,
      job_id: undefined,
    },
  });

  const createApplication = useCreateApplicationPrivate();
  const { data: jobsData } = useListJobsPrivate();

  const onSubmit = async (data: FormData) => {
    try {
      const formData = {
        ...data,
        resume: data.resume[0], // Get the File from FileList
      };
      console.log("Submitting application:", formData);
      await createApplication.mutateAsync(formData, {
        onSuccess: () => {
          toast.success(
            `Application for ${formData.name} created successfully`,
          );
        },
        onError: () => {
          toast.error("Error creating application");
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
        name: "",
        email: "",
        residence: "",
        cover_letter: "",
        resume: undefined,
        job_id: undefined,
      });
    }
  };

  const jobOptions = jobsData?.map((job) => (
    <SelectItem key={job.id} value={job.id.toString()}>
      {job.title} - {job.company.name}
    </SelectItem>
  ));

  return (
    <div>
      <div className="flex flex-1 flex-wrap items-center space-y-2 space-x-2 py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <DataTableViewOptions table={table} />

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size={"sm"} className="h-8 place-self-start lg:flex">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto md:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Application</DialogTitle>
              <DialogDescription>
                Submit a new job application.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="grid grid-cols-2 gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded"
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="residence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residence</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded"
                          placeholder="Austin, TX"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="job_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Job Position</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString() || ""}
                      >
                        <FormControl className="w-full rounded">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a job position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{jobOptions}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Resume</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cover_letter"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl className="rounded">
                        <Textarea
                          placeholder="Tell us why you're interested in this position..."
                          className="resize-none"
                          rows={4}
                          {...field}
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
                  disabled={createApplication.isPending}
                >
                  {createApplication.isPending
                    ? "Submitting..."
                    : "Submit Application"}
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
