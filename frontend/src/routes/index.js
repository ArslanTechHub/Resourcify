import DiscussionRoomBooking from "../pages/academia/DiscussionRoomBooking";
import LabResourceBooking from "../pages/academia/LabResourceBooking";
import LibraryItemBooking from "../pages/academia/LibraryItemBooking";
import Dashboard from "../pages/admin/Dashboard";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import TeacherLogin from "../pages/auth/TeacherLogin";
import AddLabResoruce from "../pages/lab_attendant/AddLabResoruce";
import AllLabResourcesRequests from "../pages/lab_attendant/AllLabResourcesRequests";
import LabResources from "../pages/lab_attendant/LabResources";
import UpdateLabResource from "../pages/lab_attendant/UpdateLabResource";
import Home from "../pages/landing/Home";
import LabResourcesListing from "../pages/landing/LabResourcesListing";
import LibraryListing from "../pages/landing/LibraryListing";
import RoomsListing from "../pages/landing/RoomsListing";
import AddNewLibraryItem from "../pages/librarian/AddNewLibraryItem";
import AddNewRoom from "../pages/librarian/AddNewRoom";
import AllBookings from "../pages/librarian/AllBookings";
import AllLentItemsRequests from "../pages/librarian/AllLentItemsRequests";
import AllRooms from "../pages/librarian/AllRooms";
import EditRoom from "../pages/librarian/EditRoom";
import LibrarianNotificationScreen from "../pages/librarian/librarian-Notofication/librarian-notificatiob";
import LibraryItems from "../pages/librarian/librarian-sidebar/librarian-sidebar";
import LibrarianProfileScreen from "../pages/librarian/Profile/profile";
import UpdateLibraryItem from "../pages/librarian/UpdateLibraryItem";
import Profile from "../pages/other/Profile";

export const routes = [
  {
    title: "Home",
    path: "/",
    element: Home,
  },
  {
    title: "Library",
    path: "/library",
    element: LibraryListing,
  },

  {
    title: "Library",
    path: "/library/:id/lend",
    element: LibraryItemBooking,
  },

  {
    title: "Library",
    path: "/lab-resources",
    element: LabResourcesListing,
  },

  {
    title: "Library",
    path: "/lab-resource/:id/request",
    element: LabResourceBooking,
  },

  {
    title: "Discussion Rooms",
    path: "/discussion-rooms",
    element: RoomsListing,
  },

  {
    title: "Discussion Rooms",
    path: "/discussion-room/:id/book",
    element: DiscussionRoomBooking,
  },
];

export const authRoutes = [
  {
    title: "Login",
    path: "/login",
    element: Login,
  },

  {
    title: "Teacher Login",
    path: "/login/teacher",
    element: TeacherLogin,
  },

  {
    title: "Coordinators Login",
    path: "/login/coordinator",
    element: TeacherLogin,
  },

  {
    title: "Librarian Login",
    path: "/login/librarian",
    element: TeacherLogin,
  },

  {
    title: "Lab Attendant Login",
    path: "/login/lab-attendant",
    element: TeacherLogin,
  },

  {
    title: "Register",
    path: "/register",
    element: Register,
  },

  {
    title: "Forgot Password",
    path: "/forgotpassword",
    element: ForgotPassword,
  },
];

export const adminRoutes = [
  {
    title: "Admin Dashboard",
    path: "/admin",
    element: Dashboard,
  },

  {
    title: "Library Items",
    path: "/library-items",
    element: Dashboard,
  },
  {
    title: "Profile",
    path: "/me",
    element: Profile,
  },
];

export const librarianRoutes = [
  {
    path: "/librarian-view",
    title: "Library Items",
    element: LibraryItems,
  },

  {
    path: "/librarian/add",
    title: "Add Library Items",
    element: AddNewLibraryItem,
  },

  {
    path: "/librarian/item/:id/update",
    title: "Update Library Item",
    element: UpdateLibraryItem,
  },

  {
    path: "/librarian/requests",
    title: "Requests",
    element: AllLentItemsRequests,
  },

  {
    path: "/librarian/rooms",
    title: "Rooms",
    element: AllRooms,
  },

  {
    path: "/librarian/room/add",
    title: "Rooms",
    element: AddNewRoom,
  },

  {
    path: "/librarian/room/:id/edit",
    title: "Rooms",
    element: EditRoom,
  },

  {
    path: "/librarian/bookings",
    title: "Bookings",
    element: AllBookings,
  },

  {
    path: "/librarian/profile",
    title: "Profile",
    element: LibrarianProfileScreen,
  },
  {
    path: "/librarian-notifications",
    title: "Notifications",
    element: LibrarianNotificationScreen,
  },

  
  {
    title: "Profile",
    path: "/me",
    element: Profile,
  },
];

export const labAttendantRoutes = [
  {
    path: "/lab_attendant",
    title: "Lab Resources",
    element: LabResources,
  },

  {
    path: "/lab_attendant/add",
    title: "Add Lab Resource",
    element: AddLabResoruce,
  },

  {
    path: "/lab_attendant/requests",
    title: "Lab Resources Requests",
    element: AllLabResourcesRequests,
  },

  {
    path: "/lab_attendant/resource/:id/update",
    title: "Update Lab Resource",
    element: UpdateLabResource,
  },
  {
    title: "Profile",
    path: "/me",
    element: Profile,
  },
];
