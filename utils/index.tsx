import { Calendar, CalendarDays, Grid2X2, Inbox } from "lucide-react";

export const primaryNavItems = [
  {
    id: "primary",
    name: "Inbox",
    link: "/loggedin",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    name: "Today",
    link: "/loggedin/today",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    name: "Upcoming",
    link: "/loggedin/upcoming",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    name: "Filters & Labels",
    link: "/loggedin/filter-labels",
    icon: <Grid2X2 className="h-4 w-4" />,
  },
];

export const GET_STARTED_PROJECT_ID = "ks774jrfb3frcmy3ys2m8vrmq96zs46j";
