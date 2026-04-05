import { Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Root } from "../layout/Root";
import Loader from "../components/common/Loader";
import { LAYOUT_PATH, ROUTE_PATHS } from "./RoutePath";
import DynamicComponents from "./DynamicComponents";

function RequireAuth() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

function GuestOnly() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.HOME} replace />;
  }
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader fullscreen ariaLabel="Loading application" />
        </div>
      }
    >
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path={ROUTE_PATHS.LOGIN} element={<DynamicComponents.AuthPage />} />
        </Route>
        <Route path={ROUTE_PATHS.VERIFY_EMAIL} element={<DynamicComponents.VerifyEmail />} />
        <Route path={ROUTE_PATHS.FORBIDDEN} element={<DynamicComponents.Forbidden />} />
        <Route path={ROUTE_PATHS.NOT_FOUND} element={<DynamicComponents.NotFound />} />
        <Route path={ROUTE_PATHS.SERVER_ERROR} element={<DynamicComponents.ServerError />} />
        <Route element={<RequireAuth />}>
          <Route element={<Root />}>
            <Route index element={<DynamicComponents.HomeShellPage />} />
            <Route path={LAYOUT_PATH.NEARBY} element={<DynamicComponents.MapPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={ROUTE_PATHS.NOT_FOUND} replace />} />
      </Routes>
    </Suspense>
  );
}
