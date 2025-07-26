import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { MoreHorizontal } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Drawer,
  DrawerTitle,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawer";

import { type job_type } from "@/apis/jobapis";
import { useUpdateJobPrivate, useDeleteJobPrivate } from "@/hooks/useJob";
import { useListCompaniesPrivate } from "@/hooks/useCompany";
import { useListDepartmentsPrivate } from "@/hooks/useDepartment";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Actionscell = ({ item }: { item: job_type }) => {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isMobile, setMobile] = useState<boolean>(window.innerWidth < 600);

  const checksize = () => {
    setMobile(window.innerWidth < 600);
  };

  useEffect(() => {
    window.addEventListener("resize", checksize);
    return () => {
      window.removeEventListener("resize", checksize);
    };
  }, []);

  const handleUpdateClick = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setDrawerOpen(true);
    }, 100);
  };

  const handleDeleteClick = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setDeleteDialogOpen(true);
    }, 100);
  };

  const handleDrawerClose = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        document.body.focus();
      }, 100);
    }
  };

  const schema = z.object({
    id: z.number(),
    title: z.string(),
    location: z.string(),
    responsiblities: z.string(),
    qualification: z.string(),
    nice_to_haves: z.string(),
    end_date: z.date(),
    company: z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
    }),
    department: z.object({
      id: z.number(),
      title: z.string(),
      slug: z.string(),
    }),
    recruiter: z
      .object({
        id: z.number(),
        username: z.string(),
      })
      .nullable()
      .optional(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: item.id,
      title: item.title,
      location: item.location,
      responsiblities: item.responsiblities,
      qualification: item.qualification,
      nice_to_haves: item.nice_to_haves, // ADDED
      end_date: item.end_date, // ADDED
      recruiter: item.recruiter, // ADDED
      company: item.company,
      department: item.department,
    },
  });

  const updateJob = useUpdateJobPrivate();
  const deleteJob = useDeleteJobPrivate();
  const { data: companies } = useListCompaniesPrivate();
  const { data: departments } = useListDepartmentsPrivate();

  const onSubmit = (data: FormData) => {
    console.log("Submitting job update:", data);
    const updateData = {
      ...data,
      company: {
        ...data.company,
        logo: item.company.logo, // Add the logo from the original item
      },
    };

    updateJob.mutate(updateData, {
      onSuccess: () => {
        setDrawerOpen(false);
        console.log("Job updated successfully");
        toast.success("Job updated successfully");
      },
      onError: (error) => {
        console.error("Error updating job:", error);
        toast.error("Error updating job");
      },
    });
  };

  const handleDeleteConfirm = () => {
    deleteJob.mutate(item.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        console.log(`Job "${item.title}" deleted successfully`);
        toast.success(`Job "${item.title}" deleted successfully`);
      },
      onError: (error) => {
        console.error("Error deleting job:", error);
        toast.error(`Error deleting job`);
      },
    });
  };

  const companyOptions = companies?.map((company) => (
    <SelectItem key={company.id} value={company.id.toString()}>
      {company.name}
    </SelectItem>
  ));
  const departmentOptions = departments?.map((department) => (
    <SelectItem key={department.id} value={department.id.toString()}>
      {department.title}
    </SelectItem>
  ));

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleUpdateClick}>
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600 focus:bg-red-100 focus:text-red-600 dark:focus:bg-red-900/20"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this job?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{item.title}" from your job list.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteJob.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteJob.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteJob.isPending ? "Deleting..." : "Delete Job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Drawer */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={handleDrawerClose}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent
          className={
            isMobile
              ? "min-h-[92.5vh]"
              : "max-h-screen overflow-x-hidden overflow-y-auto"
          }
        >
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DrawerHeader className="flex-shrink-0 gap-1">
                <DrawerTitle>{item.title}</DrawerTitle>
                <DrawerDescription>Edit Job Information</DrawerDescription>
              </DrawerHeader>
              <div
                className={`flex flex-col gap-4 overflow-y-auto px-4 text-sm ${
                  isMobile
                    ? "max-h-[calc(90vh-200px)] min-h-0 flex-1 pb-4"
                    : "flex-1 overflow-y-auto"
                }`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded"
                            placeholder="Job name"
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
                            placeholder="Austin,TX"
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
                        <FormLabel>Last Date</FormLabel>
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
                    name="company"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Company</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const selectedCompany = companies?.find(
                              (company) => company.id.toString() === value,
                            );
                            if (selectedCompany) {
                              field.onChange(selectedCompany);
                            }
                          }}
                          value={field.value?.id?.toString()}
                        >
                          <FormControl className="w-full rounded">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Company" />
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
                    name="department"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const selectedDepartment = departments?.find(
                              (department) =>
                                department.id.toString() === value,
                            );
                            if (selectedDepartment) {
                              field.onChange(selectedDepartment);
                            }
                          }}
                          value={field.value?.id?.toString()}
                        >
                          <FormControl className="w-full rounded">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Department" />
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
                            placeholder="Job Qualification"
                            className="resize-none"
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
                            placeholder="Job Responsibilities"
                            className="resize-none"
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
                            placeholder="Job Nice to Haves"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DrawerFooter className="flex-shrink-0 pt-4">
                <Button type="submit" disabled={updateJob.isPending}>
                  {updateJob.isPending ? "Updating..." : "Update"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Actionscell;
