import { ClockFadingIcon, CircleXIcon, CircleCheckIcon } from "lucide-react";

export const status = [
  {
    value: "Pending",
    label: "Pending",
    icon: ClockFadingIcon,
  },
  {
    value: "Approved for Interview",
    label: "Approved",
    icon: CircleCheckIcon,
  },
  {
    value: "Rejected",
    label: "Rejected",
    icon: CircleXIcon,
  },
];
