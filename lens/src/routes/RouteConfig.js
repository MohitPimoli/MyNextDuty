import { Root } from "../layout/Root";
import Loader from "../components/common/Loader";
import AuthPage from "../page/auth/AuthPage";
import MapPage from "../page/location/MapPage";
import VerifyEmail from "../page/email/EmailVerificationPage";
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
        component: MapPage,
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
  {
    key: "VerifyEmail",
    path: "/verify-email",
    component: VerifyEmail,
  },
];
