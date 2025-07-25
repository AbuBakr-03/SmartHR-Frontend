import { useEffect, useState } from "react";
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

import { type application_type } from "@/apis/applicationapis";
import {
  useUpdateApplicationPrivate,
  useDeleteApplicationPrivate,
} from "@/hooks/useApplication";
import { useListJobsPrivate } from "@/hooks/useJob";
import { toast } from "sonner";

const Actionscell = ({ item }: { item: application_type }) => {
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
    name: z.string().min(1, "Name is required"),
    email: z.email("Valid email is required"),
    residence: z.string().min(1, "Residence is required"),
    cover_letter: z.string().min(1, "Cover letter is required"),
    resume: z.string().nullable(),
    match_score: z.number().nullable(),
    job: z.object({
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
    }),
    status: z.object({
      id: z.number(),
      title: z.string(),
      slug: z.string(),
    }),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: item.id,
      name: item.name,
      email: item.email,
      residence: item.residence,
      cover_letter: item.cover_letter,
      resume: item.resume, // ADDED
      match_score: item.match_score, // ADDED
      job: item.job, // ADDED
      status: item.status,
    },
  });

  const updateApplication = useUpdateApplicationPrivate();
  const deleteApplication = useDeleteApplicationPrivate();
  const { data: jobs } = useListJobsPrivate();

  const onSubmit = (data: FormData) => {
    const updateData = {
      ...data,
      job: {
        ...data.job,
        company: {
          ...data.job.company,
          logo: item.job.company.logo, // Add the logo from the original item
        }, // Add the logo from the original item
      },
    };
    console.log("Submitting application update:", data);
    updateApplication.mutate(updateData, {
      onSuccess: () => {
        setDrawerOpen(false);
        console.log("Application updated successfully");
        toast.success("Application updated successfully");
      },
      onError: (error) => {
        console.error("Error updating application:", error);
        toast.error("Error updating application");
      },
    });
  };

  const handleDeleteConfirm = () => {
    deleteApplication.mutate(item.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        console.log(`Application "${item.name}" deleted successfully`);
        toast.success(`Application "${item.name}" deleted successfully`);
      },
      onError: (error) => {
        console.error("Error deleting application:", error);
        toast.error(`Error deleting application`);
      },
    });
  };

  const jobOptions = jobs?.map((job) => (
    <SelectItem key={job.id} value={job.id.toString()}>
      {job.title}
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
              Are you sure you want to delete this application?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{item.name}" from your application
              list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteApplication.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteApplication.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteApplication.isPending
                ? "Deleting..."
                : "Delete Application"}
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
        <DrawerContent className={isMobile ? "min-h-[92.5vh]" : ""}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DrawerHeader className="flex-shrink-0 gap-1">
                <DrawerTitle>{item.name}</DrawerTitle>
                <DrawerDescription>
                  Edit Application Information
                </DrawerDescription>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded"
                            placeholder="Applicant name"
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
                            placeholder="placeholder@gmail.com"
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
                    name="job"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Job</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const selectedJob = jobs?.find(
                              (job) => job.id.toString() === value,
                            );
                            if (selectedJob) {
                              field.onChange(selectedJob);
                            }
                          }}
                          value={field.value?.id?.toString()}
                        >
                          <FormControl className="w-full rounded">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a job" />
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
                    name="cover_letter"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Cover Letter</FormLabel>
                        <FormControl className="rounded">
                          <Textarea
                            placeholder="Application cover letter"
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
                <Button type="submit" disabled={updateApplication.isPending}>
                  {updateApplication.isPending ? "Updating..." : "Update"}
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
