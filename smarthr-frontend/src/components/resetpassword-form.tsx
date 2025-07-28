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
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";
import { useResetPassword } from "@/hooks/useResetPassword";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const schema = z.object({
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Must include uppercase, lowercase, number & symbol",
      ),
    uid: z.string().optional(),
    token: z.string().optional(),
  });
  type form_schema = z.infer<typeof schema>;
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const resetPassword = useResetPassword();
  const form = useForm<form_schema>({ resolver: zodResolver(schema) });
  const onSubmit = (data: form_schema) => {
    console.log(data);
    const formdata = { ...data, uid: uid, token: token };
    resetPassword.mutate(formdata, {
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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new Password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input className="rounded" {...field}></Input>
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
