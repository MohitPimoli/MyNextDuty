import { cn } from "@/util/cn";

/**
 * LoadingState — skeleton placeholder shown while a region's data is fetched.
 *
 * Renders one or more skeleton blocks whose count and dimensions can be sized
 * to the pending content so that swapping in the loaded content causes no
 * layout shift . Each block is a pulsing token-colored placeholder
 * that optionally reserves space for a leading media/avatar element and a
 * configurable number of text lines.
 *
 * The whole placeholder is announced to assistive technology as a busy status
 * region with an accessible label, and the individual visual bars are hidden
 * from the accessibility tree.
 *
 *
 * @param {Object} props
 * @param {number} [props.count=1] - number of skeleton blocks to render, sized
 *   to match the number of pending content items.
 * @param {number} [props.lines=3] - number of text-line placeholders per block.
 * @param {boolean} [props.showMedia=false] - reserve a leading media/avatar
 *   placeholder to mirror content that leads with an image.
 * @param {string} [props.ariaLabel="Loading content"] - accessible label
 *   announced while the skeleton is visible.
 * @param {string} [props.className] - classes applied to the outer container
 *   (use to constrain width/height to the loaded content's footprint).
 * @param {string} [props.blockClassName] - classes applied to each block
 *   (use to size an individual block to its content).
 * @param {string} [props.mediaClassName] - classes applied to the media
 *   placeholder (use to size it to the real media element).
 * @returns {JSX.Element}
 */
const LoadingState = ({
  count = 1,
  lines = 3,
  showMedia = false,
  ariaLabel = "Loading content",
  className,
  blockClassName,
  mediaClassName,
}) => {
  const blockCount = Math.max(1, count);
  const lineCount = Math.max(1, lines);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-3", className)}
    >
      {Array.from({ length: blockCount }).map((_, blockIndex) => (
        <div
          key={blockIndex}
          aria-hidden="true"
          className={cn("flex gap-3 rounded-card bg-card p-3 shadow-low", blockClassName)}
        >
          {showMedia && (
            <div
              className={cn(
                "h-12 w-12 shrink-0 animate-pulse rounded-full bg-border",
                mediaClassName
              )}
            />
          )}
          <div className="flex flex-1 flex-col gap-2">
            {Array.from({ length: lineCount }).map((__, lineIndex) => (
              <div
                key={lineIndex}
                className={cn(
                  "h-3 animate-pulse rounded-input bg-border",
                  lineIndex === lineCount - 1 ? "w-2/3" : "w-full"
                )}
              />
            ))}
          </div>
        </div>
      ))}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default LoadingState;
