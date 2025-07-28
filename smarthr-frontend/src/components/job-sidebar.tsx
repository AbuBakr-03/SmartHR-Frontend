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
import { useListDepartments } from "@/hooks/useDepartment";
import { Input } from "./ui/input";
import {
  BriefcaseBusiness,
  Home,
  LayoutDashboard,
  LogIn,
  Plus,
} from "lucide-react";
import { useSearch } from "@/contexts/SearchProvider";
import { useFilter } from "@/contexts/FilterProvider";

type jobSidebarType = React.ComponentProps<typeof Sidebar>;

export function JobSidebar({ ...props }: jobSidebarType) {
  const { state } = useSidebar();

  const querydata = useSearch();
  const { setQuery } = querydata;

  const filterData = useFilter();
  const { company, department, setCompany, setDepartment } = filterData;

  const FormSchema = z.object({
    job_title: z.string().optional(),
    company: z.string().optional(),
    department: z.string().optional(),
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
                              setQuery(e.target.value);
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
                            if (value == "all-companies") {
                              field.onChange("");
                              setCompany("");
                            } else {
                              field.onChange(value);
                              setCompany(value);
                            }
                            // setCompany(value as string);
                          }}
                          value={company}
                        >
                          <FormControl className="w-full rounded">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all-companies">
                              All Companies
                            </SelectItem>
                            {companiesList}
                          </SelectContent>
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
                            if (value == "all-departments") {
                              field.onChange("");
                              setCompany("");
                            } else {
                              field.onChange(value);
                              setDepartment(value);
                            }
                          }}
                          value={department}
                        >
                          <FormControl className="w-full rounded">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all-departments">
                              All Departments
                            </SelectItem>
                            {departmentsList}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
