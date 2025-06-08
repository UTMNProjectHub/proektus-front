import React from "react";
import {IProjectUser} from "../widgets/projects/types/ProjectTypes";
import {Avatar, AvatarFallback, AvatarImage} from "./avatar";
import {cn} from "@/lib/utils";

interface UserBadgeProps {
    className?: React.HTMLAttributes<HTMLDivElement>["className"]
    user: IProjectUser
    withFullName?: boolean
    clickable?: boolean
    portable?: boolean
}

function UserBadge({className, ...props}: UserBadgeProps) {
    return (
        <div
            className={cn("inline-flex justify-center text-s font-medium w-fit px-2 py-1 items-center gap-1.5", className)}>
            <Avatar>
                {props.user.avatar ? (<AvatarImage src={`${import.meta.env.VITE_APP_URL}/storage/${props.user.avatar}`}
                                                   alt="Avatar"/>) : (
                    <AvatarFallback className="text-black">{props.user.firstname.slice(0, 1)}</AvatarFallback>)}
            </Avatar>
            {props.portable ?
                <span className={'font-light font-montserrat'}>@{props.user.name}</span>
                :
                <span className="font-light font-montserrat">
                    {props.withFullName ? `${props.user.surname} ${props.user.firstname.slice(0, 1)}. ${props.user.middlename.slice(0, 1)}. (@${props.user.name})` : `@${props.user.name}`}
                </span>
            }
        </div>
    )
}

export default UserBadge;