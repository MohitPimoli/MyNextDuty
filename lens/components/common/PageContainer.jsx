/**
 * PageContainer — responsive page wrapper.
 *
 * Applies max-width 1280px, horizontal centering above 1280px, and
 * breakpoint-driven padding (32/20/16px for desktop/tablet/mobile).
 * Uses Tailwind responsive utilities aligned with the design token breakpoints
 * defined in `util/responsive.js`:
 *   - mobile (<768px): 16px padding
 *   - tablet (768–1279px): 20px padding
 *   - desktop (≥1280px): 32px padding, centered
 *
 * Prevents horizontal overflow from 360–1920px  via
 * overflow-x-hidden and proper width constraints.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - page content
 * @param {string} [props.className] - optional additional classes
 */
import { cn } from "@/util/cn";

const PageContainer = ({ children, className }) => {
  return (
    <div
      className={cn(
        // Max-width constraint
        "mx-auto w-full max-w-[1280px]",
        // Responsive padding: mobile 16px, tablet 20px, desktop 32px
        "px-4 md:px-5 xl:px-8",
        // Prevent horizontal overflow
        "overflow-x-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;
