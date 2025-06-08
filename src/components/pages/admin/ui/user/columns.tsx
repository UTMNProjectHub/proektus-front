import {ColumnDef} from "@tanstack/react-table";
import {User} from "@/components/pages/admin/api/type.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu.tsx";
import {Menu} from "lucide-react";

export const userColumns: ColumnDef<User>[] = [
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Email',
    accessorKey: 'email'
  },
  {
    header: 'Surname',
    accessorKey: 'surname'
  },
  {
    header: 'Firstname',
    accessorKey: 'firstname'
  },
  {
    header: 'Middlename',
    accessorKey: 'middlename'
  },
  {
    header: 'Roles',
    accessorKey: 'roles',
  },
  {
    id: 'userActions',
    cell: ({row}) => {
      // const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem>
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      )
    }
  }
]