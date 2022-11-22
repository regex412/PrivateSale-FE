import LaunchDashboard from "layouts/launchDashboard";
import CreatePrivateSale from "layouts/createPrivateSale";
// import InvestDashboard from "layouts/investDashboard";

// @mui icons
// eslint-disable-next-line import/no-extraneous-dependencies
import RocketLaunchSharpIcon from "@mui/icons-material/RocketLaunchSharp";
import AddToPhotosSharpIcon from "@mui/icons-material/AddToPhotosSharp";

const routes = [
  {
    type: "collapse",
    name: "Launch Dashboard",
    key: "launchDashboard",
    icon: <RocketLaunchSharpIcon />,
    route: "/launchDashboard",
    component: <LaunchDashboard />,
  },
  {
    type: "collapse",
    name: "Create PrivateSale",
    key: "createPrivateSale",
    icon: <AddToPhotosSharpIcon />,
    route: "/createPrivateSale",
    component: <CreatePrivateSale />,
  },
  // {
  //   type: "collapse",
  //   name: "Invest Dashboard",
  //   key: "investDashboard",
  //   icon: <LoyaltyIcon />,
  //   route: "/investDashboard",
  //   component: <InvestDashboard />,
  // },
];

export default routes;
