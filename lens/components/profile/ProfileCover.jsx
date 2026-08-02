import { cn } from "@/util/cn";

/**
 * ProfileCover — displays the user's cover image or a gradient placeholder.
 *
 * Full-width banner at the top of the profile page. When no coverUrl is
 * provided (null/undefined/empty), renders a decorative gradient background.
 *
 * Requirements: 12.1
 *
 * @param {Object} props
 * @param {string | null} [props.coverUrl] - URL of the user's cover image.
 * @param {string} [props.className] - additional classes for the container.
 */
const ProfileCover = ({ coverUrl, className }) => {
    const hasCover = typeof coverUrl === "string" && coverUrl.trim().length > 0;

    return (
        <div
            className={cn(
                "relative h-40 w-full overflow-hidden rounded-card sm:h-48 md:h-56",
                className
            )}
            aria-hidden="true"
        >
            {hasCover ? (
                <img
                    src={coverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/60 via-primary/40 to-primary/20" />
            )}
        </div>
    );
};

export default ProfileCover;
