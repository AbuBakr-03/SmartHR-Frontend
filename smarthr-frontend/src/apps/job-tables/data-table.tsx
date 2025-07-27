"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Plus, CalendarIcon, Building2, Building } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import { useCreateJobPrivate } from "@/hooks/useJob";
import { useListCompaniesPrivate } from "@/hooks/useCompany";
import { useListDepartmentsPrivate } from "@/hooks/useDepartment";

import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthProvider";

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
    title: z.string().min(1, "Title is required"),
    location: z.string().min(1, "Location is required"),
    responsiblities: z.string().min(1, "Responsibilities are required"),
    qualification: z.string().min(1, "Qualifications are required"),
    nice_to_haves: z.string().min(1, "Nice to Haves are required"),
    end_date: z.date(),
    company_id: z.number().min(1, "Please select a company"),
    department_id: z.number().min(1, "Please select a department"),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      location: "",
      responsiblities: "",
      qualification: "",
      nice_to_haves: "",
      company_id: undefined,
      department_id: undefined,
      end_date: undefined,
    },
  });

  const createJob = useCreateJobPrivate();
  const { data: companiesData } = useListCompaniesPrivate();
  const { data: departmentsData } = useListDepartmentsPrivate();

  const companies_filter = companiesData?.map((x) => {
    return { label: x.name, value: x.name, icon: Building2 };
  });

  const departments_filter = departmentsData?.map((x) => {
    return { label: x.title, value: x.title, icon: Building };
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Submitting job:", data);
      await createJob.mutateAsync(data, {
        onSuccess: () => {
          toast.success(`Job "${data.title}" created successfully`);
        },
        onError: () => {
          toast.error("Error creating job");
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
        title: "",
        location: "",
        qualification: "",
        responsiblities: "",
        nice_to_haves: "",
        company_id: undefined,
        department_id: undefined,
        end_date: undefined,
      });
    }
  };

  const companyOptions = companiesData?.map((company) => (
    <SelectItem key={company.id} value={company.id.toString()}>
      {company.name}
    </SelectItem>
  ));

  const departmentOptions = departmentsData?.map((department) => (
    <SelectItem key={department.id} value={department.id.toString()}>
      {department.title}
    </SelectItem>
  ));

  const authContext = useAuth();
  const { auth } = authContext;

  // Define which roles can perform actions
  const canPerformActions =
    auth?.role === "admin" || auth?.role === "Recruiter";

  return (
    <div>
      <div className="flex flex-1 flex-wrap items-center space-y-2 space-x-2 py-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("company") && (
          <DataTableFacetedFilter
            column={table.getColumn("company")}
            title="Company"
            options={companies_filter ?? []}
          />
        )}
        {table.getColumn("department") && (
          <DataTableFacetedFilter
            column={table.getColumn("department")}
            title="Department"
            options={departments_filter ?? []}
          />
        )}

        <DataTableViewOptions table={table} />

        {canPerformActions && (<Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size={"sm"} className="h-8 place-self-start lg:flex">
              <Plus className="h-4 w-4" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto md:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
              <DialogDescription>Submit a new job posting.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="grid grid-cols-2 gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded"
                          placeholder="Software Engineer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
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
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Deadline</FormLabel>
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
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                                // Fix timezone offset by setting to noon UTC
                                const fixedDate = new Date(
                                  date.getTime() -
                                    date.getTimezoneOffset() * 60000,
                                );
                                field.onChange(fixedDate);
                              }
                            }}
                            disabled={(date) => date < new Date()}
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
                  name="company_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString() || ""}
                      >
                        <FormControl className="w-full rounded">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{companyOptions}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString() || ""}
                      >
                        <FormControl className="w-full rounded">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{departmentOptions}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Qualifications</FormLabel>
                      <FormControl className="rounded">
                        <Textarea
                          placeholder="Required qualifications and skills..."
                          className="resize-none"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsiblities"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl className="rounded">
                        <Textarea
                          placeholder="Key responsibilities and duties..."
                          className="resize-none"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nice_to_haves"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nice to Haves</FormLabel>
                      <FormControl className="rounded">
                        <Textarea
                          placeholder="Preferred qualifications or bonus skills..."
                          className="resize-none"
                          rows={6}
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
                  disabled={createJob.isPending}
                >
                  {createJob.isPending ? "Creating..." : "Create Job"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>)}

        
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
