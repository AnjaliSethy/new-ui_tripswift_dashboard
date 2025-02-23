import Dashboard from "layouts/dashboard";
import Properties from "layouts/properties";
import Revenue from "layouts/revenue";
import Reservations from "layouts/reservations";
import Notifications from "layouts/notifications";
import Users from "layouts/users";
import Analytic from "layouts/analytics";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Logout from "layouts/authentication/log-out";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Properties",
    key: "properties",
    icon: <Icon fontSize="small">room_preferences</Icon>,
    route: "/properties",
    component: <Properties />,
  },
  {
    type: "collapse",
    name: "Revenue",
    key: "revenue",
    icon: <Icon fontSize="small">attach_money</Icon>,
    route: "/revenue",
    component: <Revenue />,
  },
  {
    type: "collapse",
    name: "Reservations",
    key: "reservations",
    icon: <Icon fontSize="small">how_to_reg</Icon>,
    route: "/reservations",
    component: <Reservations />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: <Users />,
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/analytics",
    component: <Analytic />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/logout",
    component: <Logout />,
  },
];

export default routes;
