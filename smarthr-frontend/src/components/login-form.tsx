// littlelemon/src/components/login-form.tsx
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useLoginAccount } from "@/hooks/useLogin";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useEffect } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const schema = z.object({
    username: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  });
  type form_schema = z.infer<typeof schema>;
  const form = useForm<form_schema>({ resolver: zodResolver(schema) });
  const loginAccount = useLoginAccount();
  const authContext = useAuth();

  if (!authContext) {
    throw new Error("LoginForm must be used within an AuthProvider");
  }

  const { setAuth, persist, setPersist } = authContext;
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data: form_schema) => {
    console.log(data);
    loginAccount.mutate(data, {
      onSuccess: (response) => {
        setAuth({
          access: response.access,
          refresh: null, // Don't store refresh token in state - it's in HttpOnly cookie
          role: response.role,
          user: data.username,
          password: data.password,
        });
        toast("Welcome back 🎉", {
          description: "You're now logged in and ready to explore.",
        });
        form.reset();
        navigate(from, { replace: true });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        if (error?.response) {
          toast("No Server Response");
        } else if (error?.response?.status === 400) {
          toast("Missing Username or Password");
        } else if (error?.response?.status === 401) {
          toast("Unauthorized");
        } else {
          toast("Login failed");
        }
      },
    });
  };

  const togglePersist = (checked: boolean) => {
    setPersist(checked);
  };

  useEffect(() => {
    // Only store if persist is not undefined and is a valid boolean
    if (typeof persist === "boolean") {
      localStorage.setItem("persist", JSON.stringify(persist));
    }
  }, [persist]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input className="rounded" {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded"
                        type="password"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Checkbox
                    onCheckedChange={togglePersist}
                    checked={persist}
                    id="terms"
                  />
                  <Label htmlFor="terms">Trust this device</Label>
                </div>
                <div className="flex flex-col">
                  <Button type="submit" className="w-full">
                    Login
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
