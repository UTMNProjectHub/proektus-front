import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

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


function deleteFile(file: IProjectFile) {
    axios.delete(`/api/file/delete`, {data: {
        file_id: file.id
    }}).then((response) => {
        console.log("File deleted successfully", response.data);
    }).catch((error) => {
        console.error("Error deleting file:", error);
    });

    
}

function downloadFile(file: IProjectFile) {
    axios.get(`/api/file/download/${file.id}`, {
        responseType: 'blob',
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Set the file name (you can customize this based on the file metadata)
        link.download = file.original_filename || 'downloaded_file';

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('File downloaded successfully');
    }).catch((error) => {
        console.error("Error downloading file:", error);
    });
}

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
                            <a onClick={(e) => {downloadFile(file); e.preventDefault;}} target="_blank" rel="noopener noreferrer">
                                Скачать
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <a onClick={(e) => {deleteFile(file); e.preventDefault();}} target="_blank" rel="noopener noreferrer">
                                Удалить
                            </a>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]