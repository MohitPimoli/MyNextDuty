import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { resolveImage } from "@/util/format";
import { cn } from "@/util/cn";

const PLACEHOLDER = "/assets/default-avatar.png";

/**
 * ProfilePhoto — displays the user's profile photo with placeholder fallback.
 *
 * Uses the Avatar primitive with AvatarImage/AvatarFallback. When no photoUrl
 * is set or the image fails to load, shows the user's initials (if a name is
 * provided) or a generic User icon as fallback (Req 12.6).
 *
 * Requirements: 12.1, 12.6
 *
 * @param {Object} props
 * @param {string | null} [props.photoUrl] - URL of the user's profile photo.
 * @param {string} [props.name] - the user's display name (used for initials).
 * @param {string} [props.className] - additional classes for the avatar container.
 */
const ProfilePhoto = ({ photoUrl, name, className }) => {
    const resolvedUrl = resolveImage(photoUrl, "");
    const initials = name
        ? name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join("")
        : null;

    return (
        <Avatar
            className={cn(
                "h-20 w-20 border-4 border-card shadow-medium sm:h-24 sm:w-24",
                className
            )}
        >
            {resolvedUrl ? (
                <AvatarImage src={resolvedUrl} alt={name ? `${name}'s profile photo` : "Profile photo"} />
            ) : null}
            <AvatarFallback className="bg-muted text-text-secondary">
                {initials ? (
                    <span className="text-lg font-semibold sm:text-xl">{initials}</span>
                ) : (
                    <User className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
                )}
            </AvatarFallback>
        </Avatar>
    );
};

export default ProfilePhoto;
