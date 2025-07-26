import { ClockFadingIcon, CircleXIcon, CircleCheckIcon } from "lucide-react";
export const status = [
  {
    value: "Approved for Interview",
    label: "Approved for Interview",
    icon: CircleCheckIcon,
  },
  { value: "Rejected", label: "Rejected", icon: CircleXIcon },
  { value: "Pending", label: "Pending", icon: ClockFadingIcon },
];
