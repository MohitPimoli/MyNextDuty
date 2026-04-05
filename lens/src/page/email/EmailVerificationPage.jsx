import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import commonService from "../../service/commonService";
import "./style.scss";
import toastService from "../../util/toastService";
import { ROUTE_PATHS } from "../../routes/RoutePath";
import Paper from "../../components/common/Paper";
import Button from "../../components/common/Button";
import RedirectCountdown from "../../components/common/Redirect/RedirectCountdown";
import { BUTTON_SIZES, BUTTON_VARIANTS } from "../../components/common/Button/button.constants";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setStatus("loading");
        const response = await commonService.AUTH.verifyEmail(token);
        if (response?.data?.status === 200) {
          toastService.success(response?.data?.message);
          setStatus("success");
          setTimeout(() => {
            navigate(ROUTE_PATHS.HOME);
          }, 3000);
        }
      } catch (error) {
        toastService.error(error?.data?.message);
        setMessage(error?.data?.message);
        setStatus("error");
        console.error("Error:", error?.data);
      }
    };
    if (token) {
      verifyEmail();
    } else {
      toastService.error("Token not found");
      console.error("Error: No token found: ", token);
    }
  }, [token, navigate]);

  const resendVerification = async () => {
    try {
      const response = await commonService.AUTH.resendVerification(token);
      if (response?.data?.status === 200) {
        toastService.success(response?.data?.message);
        setTimeout(() => {
          navigate(ROUTE_PATHS.LOGIN);
        }, 3000);
      }
    } catch (error) {
      toastService.error(error?.data?.message);
    }
  };

  return (
    <Paper className="verification-container">
      <div className="verification-card">
        {status === "loading" && (
          <>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your account.</p>
          </>
        )}
        {status === "success" && (
          <>
            <h2 className="success-text">Email Verified</h2>
            <RedirectCountdown location={"Home"} redirectPath={"/"}></RedirectCountdown>
          </>
        )}
        {status === "failed" && (
          <>
            <h2 className="error-text">Verification Failed</h2>
            <p>{message}</p>
            <Button
              className="resend-button"
              variant={BUTTON_VARIANTS.PRIMARY}
              size={BUTTON_SIZES.SM}
              onClick={resendVerification}
            >
              Resend Verification Link
            </Button>
          </>
        )}
      </div>
    </Paper>
  );
};

export default VerifyEmail;
