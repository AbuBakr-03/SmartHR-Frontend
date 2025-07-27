import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useListCompanies } from "@/hooks/useCompany";
import { company_schema } from "@/apis/companyapis";
import { useListDepartments } from "@/hooks/useDepartment";
import { department_schema } from "@/apis/departmentapis";
import { Input } from "./ui/input";
import {
  BriefcaseBusiness,
  Home,
  LayoutDashboard,
  LogIn,
  Plus,
} from "lucide-react";
import { useSearch } from "@/contexts/SearchProvider";

type JobsFilters = {
  company: string;
  department: string;
};

type jobSidebarType = React.ComponentProps<typeof Sidebar> & {
  onChange: (company: string, department: string) => void;
};

export function JobSidebar({ onChange, ...props }: jobSidebarType) {
  const { state } = useSidebar();

  const querydata = useSearch();

  const FormSchema = z.object({
    job_title: z.string(),
    company: company_schema,
    department: department_schema,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const companiesData = useListCompanies();
  const departmentData = useListDepartments();

  const companiesList = companiesData.data?.map((x) => {
    return (
      <SelectItem key={x.name} value={x.name}>
        {x.name}
      </SelectItem>
    );
  });

  const departmentsList = departmentData.data?.map((x) => {
    return (
      <SelectItem key={x.title} value={x.title}>
        {x.title}
      </SelectItem>
    );
  });

  const links = [
    { name: "Home", link: "/", icon: <Home className="-ml-1 h-4 w-4" /> },
    {
      name: "Jobs",
      link: "/job",
      icon: <BriefcaseBusiness className="-ml-1 h-4 w-4" />,
    },
  ];

  const linkslist = links.map((x, index) => {
    return (
      <SidebarMenuItem key={index}>
        <SidebarMenuButton>
          <div className="flex items-center space-x-2">
            {x.icon}
            <Link to={x.link}>
              <span className="font-semibold"> {x.name}</span>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  });

  const [company, setCompany] = React.useState<string>("");
  const [department, setDepartment] = React.useState<string>("");
  React.useEffect(() => {
    onChange(company, department);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, department]);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <div>
                  <SidebarTrigger className="-ml-1" />
                  <Link to={"/dashboard"}>
                    <span className="text-base font-semibold">SmartHR</span>
                  </Link>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Only show form when sidebar is expanded */}
        {state === "expanded" && (
          <>
            <SidebarContent className="overflow-x-hidden">
              <Form {...form}>
                <form>
                  <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                      <FormItem className="mx-auto mt-6 w-10/12">
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded"
                            {...field}
                            onChange={(e) => {
                              querydata.setQuery(e.target.value);
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem className="mx-auto mt-3 w-10/12">
                        <FormLabel>Company</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange();
                            setCompany(value);
                            // setCompany(value as string);
                          }}
                          value={field.value.name || ""}
                        >
                          <FormControl className="w-full rounded">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>{companiesList}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="mx-auto mt-6 w-10/12">
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange();
                            setDepartment(value);
                          }}
                          value={field.value.title || ""}
                        >
                          <FormControl className="w-full rounded">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>{departmentsList}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button className="mx-auto mt-4.5 grid w-10/12 justify-self-center rounded border bg-slate-900 py-1 font-medium text-white">
                    Filter
                  </button>
                  <button className="text-slate800 mx-auto mt-3 grid w-10/12 justify-self-center rounded border bg-white py-1 font-medium">
                    Clear
                  </button>
                </form>
              </Form>
            </SidebarContent>
            <SidebarFooter className="mx-auto mb-4 w-11/12">
              <SidebarMenu>
                {linkslist}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div className="flex items-center space-x-2">
                      <Plus className="-ml-1 h-4 w-4" />
                      <Link to={"/sign-up"}>
                        <span className="font-semibold"> Sign Up</span>
                      </Link>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div className="flex items-center space-x-2">
                      <LogIn className="-ml-1 h-4 w-4" />
                      <Link to={"/log-in"}>
                        <span className="font-semibold"> Log In</span>
                      </Link>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div className="flex items-center space-x-2">
                      <LayoutDashboard className="-ml-1 h-4 w-4" />
                      <Link to={"/dashboard"}>
                        <span className="font-semibold"> Dashboard</span>
                      </Link>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </>
        )}

        <SidebarRail />
      </Sidebar>
    </>
  );
}
