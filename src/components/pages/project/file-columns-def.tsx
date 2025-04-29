import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { useNavigate } from 'react-router';

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IProjectFile } from "@/components/widgets/projects/types/ProjectTypes";
import { formatDateTime } from '@/shared/convertDateLocal';
import axios from 'axios';
import UserBadge from '@/components/ui/userbadge';


export const columns: ColumnDef<IProjectFile>[] = [
    {
        accessorKey: 'original_filename',
        header: 'Имя файла',
    },
    {
        accessorKey: 'user',
        header: 'Пользователь',
        cell: ({ row }) => {
            return <UserBadge user={row.getValue('user')} />
        },
        
    },
    {
        accessorKey: 'created_at',
        header: 'Дата загрузки',
        cell: ({ row }) => {
            return formatDateTime(row.getValue('created_at'), 'dd.MM.yyyy HH:mm:ss');
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Дата изменения',
        cell: ({ row }) => {
            return formatDateTime(row.getValue('updated_at'), 'dd.MM.yyyy HH:mm:ss');
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const file = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            Действия
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            <a href={`${import.meta.env.VITE_APP_URL}/storage/${file.s3_key}`} target="_blank" rel="noopener noreferrer">
                                Скачать
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <a onClick={(e) => {e.preventDefault, deleteFile(file)}} target="_blank" rel="noopener noreferrer">
                                Удалить
                            </a>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]