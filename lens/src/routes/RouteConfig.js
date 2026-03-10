import { Root } from "../layout/Root";
import Loader from "../components/common/Loader";
import AuthPage from "../page/auth/AuthPage";
import NearbyUsersPage from "../page/location/NearbyUsersPage";
export const PrivateRouteConfig = [
  {
    key: "Root",
    component: Root,
    path: "/",
    children: [
      {
        key: "Loader",
        path: "",
        component: Loader,
      },
      {
        key: "NearbyUsers",
        path: "nearby",
        component: NearbyUsersPage,
      },
    ],
  },
];

export const PublicRouteConfig = [
  {
    key: "AuthPage",
    path: "",
    component: AuthPage,
  },
];
