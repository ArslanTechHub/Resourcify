import { RiDashboardLine } from "react-icons/ri";

export const sAdminRoutes = [
  {
    label: "Dashboard",
    value: "/admin",
    icon: RiDashboardLine,
    isExtendAble: false,
    subRoutes: [],
  },
];

export const sLibrarianRoutes = [
  {
    label: "Library Items",
    icon: RiDashboardLine,
    isExtendAble: true,
    subRoutes: [
      {
        label: "View All",
        value: "/librarian",
        icon: RiDashboardLine,
      },
      {
        label: "Add New Item",
        value: "/librarian/add",
        icon: RiDashboardLine,
      },

      {
        value: "/librarian/requests",
        label: "Requests",
        icon: RiDashboardLine,
      },
    ],
  },

  {
    label: "Discussion Rooms",
    icon: RiDashboardLine,
    isExtendAble: true,
    subRoutes: [
      {
        label: "View All",
        value: "/librarian/rooms",
        icon: RiDashboardLine,
      },
      {
        label: "Add New Item",
        value: "/librarian/room/add",
        icon: RiDashboardLine,
      },

      {
        value: "/librarian/bookings",
        label: "Bookings",
        icon: RiDashboardLine,
      },
    ],
  },
];

export const sLabAttendantRoutes = [
  {
    label: "Lab Resources",
    icon: RiDashboardLine,
    isExtendAble: true,
    subRoutes: [
      {
        label: "View All",
        value: "/lab_attendant",
        icon: RiDashboardLine,
      },
      {
        label: "Add New Resource",
        value: "/lab_attendant/add",
        icon: RiDashboardLine,
      },

      {
        label: "Requests",
        value: "/lab_attendant/requests",
        icon: RiDashboardLine,
      },
    ],
  },
];
