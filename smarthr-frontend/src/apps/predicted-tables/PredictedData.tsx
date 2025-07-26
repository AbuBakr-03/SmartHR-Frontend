import { ClockFadingIcon, CircleXIcon, CircleCheckIcon } from "lucide-react";

export const status = [
  {
    value: "Rejected",
    label: "Rejected",
    icon: CircleXIcon,
  },
  {
    value: "Hired",
    label: "Hired",
    icon: CircleCheckIcon,
  },
  {
    value: "Pending",
    label: "Pending",
    icon: ClockFadingIcon,
  },
];
