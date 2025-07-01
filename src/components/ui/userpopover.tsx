import { PartyPopper } from "lucide-react";
import { IProjectUser } from "../widgets/projects/types/ProjectTypes";
import { Avatar, AvatarFallback } from "./avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import UserBadge from "./userbadge";
import { formatDateTime } from "@/shared/convertDateLocal";

function UserPopover({ user }: { user: IProjectUser }) {
  return (
    <Popover>
      <PopoverTrigger>
        <UserBadge
          key={user.id}
          user={user}
          withFullName={false}
          className="text-black rounded-md border-1 border-gray-400"
        />
      </PopoverTrigger>
      <PopoverContent className="max-w-sm">
        <div className="flex flex-col space-y-2">
          <Avatar>
            <AvatarFallback>{user.firstname.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <p>
              {user.surname +
                " " +
                user.firstname +
                " " +
                (user.middlename ?? "")}
            </p>
            <p className="text-muted-foreground">@{user.name}</p>
          </div>
          <p className="flex items-center gap-1">
            <PartyPopper size={16} />
            {formatDateTime(user.created_at, "MMMM d, yyyy")}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default UserPopover;
