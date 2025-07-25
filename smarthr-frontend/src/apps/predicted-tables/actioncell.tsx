import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

import { type predicted_type } from "@/apis/predictedapis";
import {
  useDeletePredictionPrivate,
  useSubmitEvaluation,
} from "@/hooks/usePredicted";
import { toast } from "sonner";

const Actionscell = ({ item }: { item: predicted_type }) => {
  const [isEvaluateDrawerOpen, setEvaluateDrawerOpen] =
    useState<boolean>(false);
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

  const handleEvaluateClick = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setEvaluateDrawerOpen(true);
    }, 100);
  };

  const handleDeleteClick = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setDeleteDialogOpen(true);
    }, 100);
  };

  const handleEvaluateDrawerClose = (open: boolean) => {
    setEvaluateDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        document.body.focus();
      }, 100);
    }
  };

  // Evaluation form schema
  const evaluationSchema = z.object({
    technical_skills: z.number().min(1).max(5),
    communication: z.number().min(1).max(5),
    problem_solving: z.number().min(1).max(5),
    cultural_fit: z.number().min(1).max(5),
    experience: z.number().min(1).max(5),
    motivation: z.number().min(1).max(5),
    comments: z.string().optional(),
  });

  type EvaluationFormData = z.infer<typeof evaluationSchema>;

  const evaluationForm = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      technical_skills: 3,
      communication: 3,
      problem_solving: 3,
      cultural_fit: 3,
      experience: 3,
      motivation: 3,
      comments: "",
    },
  });

  const submitEvaluation = useSubmitEvaluation();
  const deletePrediction = useDeletePredictionPrivate();

  const onEvaluationSubmit = (data: EvaluationFormData) => {
    console.log("Submitting evaluation:", data);

    // Transform form data to match the API format
    const evaluationData = {
      questions: [
        {
          question: "Technical Skills",
          score: data.technical_skills,
          category: "technical",
        },
        {
          question: "Communication Skills",
          score: data.communication,
          category: "communication",
        },
        {
          question: "Problem Solving",
          score: data.problem_solving,
          category: "analytical",
        },
        {
          question: "Cultural Fit",
          score: data.cultural_fit,
          category: "cultural",
        },
        {
          question: "Experience Level",
          score: data.experience,
          category: "experience",
        },
        {
          question: "Motivation",
          score: data.motivation,
          category: "motivation",
        },
      ],
      comments: data.comments || "",
    };

    submitEvaluation.mutate(
      { id: item.id, evaluationData },
      {
        onSuccess: (response) => {
          setEvaluateDrawerOpen(false);
          console.log("Evaluation submitted successfully:", response);
          toast.success(
            `Evaluation submitted successfully. Status: ${response.status}`,
          );
        },
        onError: (error) => {
          console.error("Error submitting evaluation:", error);
          toast.error("Error submitting evaluation");
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    deletePrediction.mutate(item.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        console.log(
          `Predicted candidate "${item.interview.application.name}" deleted successfully`,
        );
        toast.success(
          `Predicted candidate "${item.interview.application.name}" deleted successfully`,
        );
      },
      onError: (error) => {
        console.error("Error deleting predicted candidate:", error);
        toast.error("Error deleting predicted candidate");
      },
    });
  };

  // Check if already evaluated
  const isEvaluated = item.evaluation_score !== null;

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
          <DropdownMenuItem onClick={handleEvaluateClick}>
            {isEvaluated ? "Re-evaluate" : "Evaluate"}
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
              Are you sure you want to delete this predicted candidate?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{item.interview.application.name}"
              from your predicted candidates list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePrediction.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletePrediction.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deletePrediction.isPending
                ? "Deleting..."
                : "Delete Predicted Candidate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Evaluation Drawer */}
      <Drawer
        open={isEvaluateDrawerOpen}
        onOpenChange={handleEvaluateDrawerClose}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent className={isMobile ? "min-h-[92.5vh]" : ""}>
          <Form {...evaluationForm}>
            <form onSubmit={evaluationForm.handleSubmit(onEvaluationSubmit)}>
              <DrawerHeader className="flex-shrink-0 gap-1">
                <DrawerTitle>
                  Evaluate {item.interview.application.name}
                </DrawerTitle>
                <DrawerDescription>
                  Rate the candidate on different criteria (1-5 scale)
                </DrawerDescription>
              </DrawerHeader>
              <div
                className={`flex flex-col gap-6 overflow-y-auto px-4 text-sm ${
                  isMobile
                    ? "max-h-[calc(90vh-200px)] min-h-0 flex-1 pb-4"
                    : "flex-1 overflow-y-auto"
                }`}
              >
                <div className="space-y-6">
                  {/* Technical Skills */}
                  <FormField
                    control={evaluationForm.control}
                    name="technical_skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Technical Skills
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="w-full"
                            />
                            <div className="text-muted-foreground flex justify-between text-sm">
                              <span>Poor (1)</span>
                              <span className="font-medium">
                                Score: {field.value}
                              </span>
                              <span>Excellent (5)</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Communication Skills */}
                  <FormField
                    control={evaluationForm.control}
                    name="communication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Communication Skills
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="w-full"
                            />
                            <div className="text-muted-foreground flex justify-between text-sm">
                              <span>Poor (1)</span>
                              <span className="font-medium">
                                Score: {field.value}
                              </span>
                              <span>Excellent (5)</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Problem Solving */}
                  <FormField
                    control={evaluationForm.control}
                    name="problem_solving"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Problem Solving
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="w-full"
                            />
                            <div className="text-muted-foreground flex justify-between text-sm">
                              <span>Poor (1)</span>
                              <span className="font-medium">
                                Score: {field.value}
                              </span>
                              <span>Excellent (5)</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cultural Fit */}
                  <FormField
                    control={evaluationForm.control}
                    name="cultural_fit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Cultural Fit
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="w-full"
                            />
                            <div className="text-muted-foreground flex justify-between text-sm">
                              <span>Poor (1)</span>
                              <span className="font-medium">
                                Score: {field.value}
                              </span>
                              <span>Excellent (5)</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Experience Level */}
                  <FormField
                    control={evaluationForm.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Experience Level
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="w-full"
                            />
                            <div className="text-muted-foreground flex justify-between text-sm">
                              <span>Poor (1)</span>
                              <span className="font-medium">
                                Score: {field.value}
                              </span>
                              <span>Excellent (5)</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Motivation */}
                  <FormField
                    control={evaluationForm.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Motivation
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="w-full"
                            />
                            <div className="text-muted-foreground flex justify-between text-sm">
                              <span>Poor (1)</span>
                              <span className="font-medium">
                                Score: {field.value}
                              </span>
                              <span>Excellent (5)</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Comments */}
                  <FormField
                    control={evaluationForm.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Additional Comments
                        </FormLabel>
                        <FormControl className="rounded">
                          <Textarea
                            placeholder="Add any additional comments about the candidate..."
                            className="resize-none"
                            rows={4}
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
                <Button type="submit" disabled={submitEvaluation.isPending}>
                  {submitEvaluation.isPending
                    ? "Submitting..."
                    : "Submit Evaluation"}
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
