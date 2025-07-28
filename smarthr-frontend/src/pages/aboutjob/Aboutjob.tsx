import styles from "./Aboutjob.module.css";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import Jobhero from "./jobhero/Jobhero";
import Jobdescription from "./jobdescription/Jobdescription";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { useState } from "react";
import { useCreateApplicationPrivate } from "@/hooks/useApplication";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

const AboutJob: React.FC = () => {
  const postApplicationMutation = useCreateApplicationPrivate();
  const { id } = useParams();
  const authdata = useAuth();
  const { auth } = authdata;

  const schema = z.object({
    name: z
      .string()
      .min(8, { message: "Name must be at least 8 characters long." })
      .max(50, { message: "Name must be at most 50 characters long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    residence: z
      .string()
      .min(8, { message: "Residence must be at least 8 characters long." })
      .max(100, { message: "Residence must be at most 100 characters long." }),
    cover_letter: z
      .string()
      .min(20, { message: "Cover letter must be at least 20 characters long." })
      .max(1000, {
        message: "Cover letter must be at most 1000 characters long.",
      }),
    resume: z
      .any()
      .refine((files) => files?.[0], {
        message: "Resume file is required.",
      })
      .refine((files) => files?.[0]?.type === "application/pdf", {
        message: "Only PDF files are accepted.",
      })
      .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, {
        message: "Resume file must be smaller than 5MB.",
      }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [open, setOpen] = useState<boolean>(false);

  const submitter: SubmitHandler<FormData> = (data) => {
    if (!auth?.role) {
      toast.error("Authentication required", {
        description: "Please log in to submit your application",
      });
      return;
    }

    if (!id) {
      toast.error("Invalid job ID", {
        description: "Unable to submit application for this job",
      });
      return;
    }

    // Convert job_id to number and ensure resume is a File
    const formData = {
      name: data.name,
      email: data.email,
      residence: data.residence,
      cover_letter: data.cover_letter,
      resume: data.resume[0] as File, // Type assertion to File
      job_id: parseInt(id, 10), // Convert string to number
    };

    console.log("Submitting application:", formData);

    postApplicationMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(`Application for ${formData.name} created successfully`);
      },
      onError: (error) => {
        console.error("Application submission error:", error);
        toast.error("Error creating application");
      },
    });
  };

  const handlechange = () => {
    setOpen(false);
  };

  return (
    <main>
      <Jobhero />

      <div className="grid place-items-center">
        <div className={`${styles.layout} w-11/12 gap-8 py-6`}>
          <Jobdescription />

          <div
            className={`${styles.form} grid h-fit gap-8 rounded-xl border border-slate-300 p-6`}
          >
            <div className="grid gap-1">
              <h1 className="text-xl font-bold">Apply for this Position</h1>
              <p className="text-sm">
                Fill out the form below to apply for this role.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(submitter)}
              className="grid gap-4"
              action=""
            >
              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="name">
                  Name
                </label>
                <input
                  {...register("name")}
                  className="rounded-md border border-slate-300 py-2 pr-6 pl-3"
                  type="text"
                  name="name"
                  id="name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  {...register("email")}
                  className="rounded-md border border-slate-300 py-2 pr-6 pl-3"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="m@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="residence">
                  Place of Residence
                </label>
                <input
                  {...register("residence")}
                  className="rounded-md border border-slate-300 py-2 pr-6 pl-3"
                  type="text"
                  name="residence"
                  id="residence"
                />
                {errors.residence && (
                  <p className="text-sm text-red-500">
                    {errors.residence.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="resume">
                  Resume/CV (PDF)
                </label>
                <input
                  {...register("resume")}
                  className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-full items-center rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="resume"
                  type="file"
                  accept=".pdf"
                />
                <p className="text-xs text-slate-500">
                  Upload your resume in PDF format. Max size: 5MB
                </p>
                {errors.resume && (
                  <p className="text-sm text-red-500">
                    {errors.resume.message?.toString()}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="cover_letter">
                  Cover Letter
                </label>
                <textarea
                  {...register("cover_letter")}
                  className="rounded-md border border-slate-300 py-1 pr-6 pl-3 text-sm"
                  name="cover_letter"
                  id="cover_letter"
                  cols={30}
                  rows={5}
                  placeholder="Tell us why you're interested in this position and why you'd be a great fit."
                  maxLength={1000}
                />
                {errors.cover_letter && (
                  <p className="text-sm text-red-500">
                    {errors.cover_letter.message}
                  </p>
                )}
              </div>

              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="rounded-md bg-black py-2 text-sm font-medium text-white"
                  >
                    Submit Application
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Ready to Submit Your Application?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Please ensure all the information you provided is
                      accurate. Once submitted, you won't be able to make
                      changes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handlechange();
                        handleSubmit(submitter)();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <p className="text-center text-xs text-slate-500">
                By applying, you confirm that all information provided is
                accurate and complete.
              </p>
            </form>
            <Toaster />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutJob;
