import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { useForgotPassword } from "@/hooks/useForgotPassword";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const schema = z.object({
    email: z.email(),
  });
  type form_schema = z.infer<typeof schema>;
  const navigate = useNavigate();
  const forgotPassword = useForgotPassword();
  const form = useForm<form_schema>({ resolver: zodResolver(schema) });
  const onSubmit = (data: form_schema) => {
    console.log(data);
    forgotPassword.mutate(data, {
      onSuccess: () => {
        toast.success(`Check your email for reset password instruction`);
        navigate("/log-in");
      },
    });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email, and we’ll send you instructions on how to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded"
                        placeholder="m@example.com"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="mt-4 flex flex-col gap-6">
                <div className="flex flex-col">
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to={"/sign-up"} className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
