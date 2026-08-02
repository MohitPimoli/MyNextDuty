"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import GithubIcon from "../../assets/public/login/github-svgrepo-com.svg";
import GoogleIcon from "../../assets/public/login/google-color-svgrepo-com.svg";
import MicrosoftIcon from "../../assets/public/login/microsoft-svgrepo-com.svg";

/**
 * Social login buttons — "Continue with Google" and "Continue with GitHub"
 * Both visible without scrolling at desktop breakpoint.
 */
const SocialLoginButtons = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="outline"
        size="default"
        className="w-full justify-center gap-2"
        type="button"
        leftIcon={() => <Image src={GoogleIcon} alt="" width={24} height={24} aria-hidden="true" />}
        aria-label="Continue with Google"
      >
        Continue with Google
      </Button>
      <Button
        variant="outline"
        size="default"
        className="w-full justify-center gap-2"
        type="button"
        leftIcon={() => <Image src={GithubIcon} alt="" width={24} height={24} aria-hidden="true" />}
        aria-label="Continue with GitHub"
      >
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        size="default"
        className="w-full justify-center gap-2"
        type="button"
        leftIcon={() => (
          <Image src={MicrosoftIcon} alt="" width={24} height={24} aria-hidden="true" />
        )}
        aria-label="Continue with Microsoft"
      >
        Continue with Microsoft
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
