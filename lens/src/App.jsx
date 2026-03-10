import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PrivateRouteConfig, PublicRouteConfig } from "./routes/RouteConfig";
import NavigationProvider from "../src/layout/NavigationProvider";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <Routes>
          {PublicRouteConfig.map((route) => (
            <Route key={route.key} path={route.path} element={<route.component />}>
              
            </Route>
          ))}
          {PrivateRouteConfig.map((route) => (
            <Route key={route.key} path={route.path} element={<route.component />}>
              {route.children?.map((child) => (
                <Route key={child.key} path={child.path} element={<child.component />} />
              ))}
            </Route>
          ))}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </NavigationProvider>
    </BrowserRouter>
  );
};

export default App;
