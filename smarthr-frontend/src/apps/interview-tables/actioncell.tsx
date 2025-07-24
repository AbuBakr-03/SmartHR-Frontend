import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { MoreHorizontal, CalendarIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { type interview_type } from "@/apis/interviewapis";
import {
  useUpdateInterviewPrivate,
  useDeleteInterviewPrivate,
} from "@/hooks/useInterview";
import { useListApplicationsPrivate } from "@/hooks/useApplication";
import { toast } from "sonner";

const Actionscell = ({ item }: { item: interview_type }) => {
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
    application_id: z.number(),
    date: z.date().nullable(),
    external_meeting_link: z.string().nullable(),
    interview_video: z.any().nullable(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: item.id,
      application_id: item.application.id,
      date: item.date ? new Date(item.date) : null,
      external_meeting_link: item.external_meeting_link,
      interview_video: null,
    },
  });

  const updateInterview = useUpdateInterviewPrivate();
  const deleteInterview = useDeleteInterviewPrivate();
  const { data: applications } = useListApplicationsPrivate();

  const onSubmit = (data: FormData) => {
    console.log("Submitting interview update:", data);

    // Transform the data to match interview_put_type
    const updateData = {
      id: data.id,
      application_id: data.application_id,
      date: data.date ? data.date.toISOString() : null,
      external_meeting_link: data.external_meeting_link,
      interview_video: data.interview_video?.[0] || null,
    };

    updateInterview.mutate(updateData, {
      onSuccess: () => {
        setDrawerOpen(false);
        console.log("Interview updated successfully");
        toast.success("Interview updated successfully");
      },
      onError: (error) => {
        console.error("Error updating interview:", error);
        toast.error("Error updating interview");
      },
    });
  };

  const handleDeleteConfirm = () => {
    deleteInterview.mutate(item.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        console.log(
          `Interview for "${item.application.name}" deleted successfully`,
        );
        toast.success(
          `Interview for "${item.application.name}" deleted successfully`,
        );
      },
      onError: (error) => {
        console.error("Error deleting interview:", error);
        toast.error("Error deleting interview");
      },
    });
  };

  const applicationOptions = applications?.map((application) => (
    <SelectItem key={application.id} value={application.id.toString()}>
      {application.name} - {application.job.title}
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
              Are you sure you want to delete this interview?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the interview for "
              {item.application.name}" from your interview list. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteInterview.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteInterview.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteInterview.isPending ? "Deleting..." : "Delete Interview"}
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
                <DrawerTitle>Interview for {item.application.name}</DrawerTitle>
                <DrawerDescription>
                  Edit Interview Information
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
                    name="application_id"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Application</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString()}
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
                        <FormLabel>Interview Date</FormLabel>
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
                              selected={field.value || undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const fixedDate = new Date(
                                    date.getTime() -
                                      date.getTimezoneOffset() * 60000,
                                  );
                                  field.onChange(fixedDate);
                                } else {
                                  field.onChange(null);
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
                    name="external_meeting_link"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Meeting Link</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded"
                            placeholder="https://zoom.us/j/123456789"
                            {...field}
                            value={field.value || ""}
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
                        <FormLabel>Interview Video</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => field.onChange(e.target.files)}
                            className="cursor-pointer"
                          />
                        </FormControl>
                        <FormMessage />
                        {item.interview_video && (
                          <p className="text-muted-foreground text-sm">
                            Current video:{" "}
                            {item.interview_video.split("/").pop()}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DrawerFooter className="flex-shrink-0 pt-4">
                <Button type="submit" disabled={updateInterview.isPending}>
                  {updateInterview.isPending ? "Updating..." : "Update"}
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
