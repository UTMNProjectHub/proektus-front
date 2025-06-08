import {ColumnDef} from '@tanstack/react-table';
import {MoreHorizontal} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {IProjectFile} from '@/components/widgets/projects/types/ProjectTypes';
import {formatDateTime} from '@/shared/convertDateLocal';
import axios from 'axios';
import UserBadge from '@/components/ui/userbadge';
import {toast} from "sonner";

export function getFileColumns(onDeleteSuccess: (fileId: number) => void): ColumnDef<IProjectFile>[] {
    return [
        {accessorKey: 'original_filename', header: 'Имя файла'},
        {
            accessorKey: 'user',
            header: 'Пользователь',
            cell: ({row}) => <UserBadge user={row.getValue('user')}/>,
        },
        {
            accessorKey: 'created_at',
            header: 'Дата загрузки',
            cell: ({row}) => formatDateTime(row.getValue('created_at'), 'dd.MM.yyyy HH:mm:ss'),
        },
        {
            accessorKey: 'updated_at',
            header: 'Дата изменения',
            cell: ({row}) => formatDateTime(row.getValue('updated_at'), 'dd.MM.yyyy HH:mm:ss'),
        },
        {
            id: 'actions',
            cell: ({row}) => {
                const file = row.original;
                const deleteFile = async () => {
                    await axios.delete('/api/file/delete', {data: {file_id: file.id}}).then((res) => {
                        if (res.status === 200) {
                            toast.success('Файл успешно удален');
                            onDeleteSuccess(file.id);
                        }
                    }).catch((e) => {
                        toast.error('Ошибка при удалении файла: ' + e.message);
                    });
                }

                const downloadFile = async () => {
                    try {
                        await axios.get(`/api/file/download/${file.id}`, { responseType: 'blob' }).then((res) => {
                            const blob = new Blob([res.data], {type: res.headers['content-type']});
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = file.original_filename;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                        })
                    } catch (e) {
                        toast.error('Ошибка при скачивании файла: ' + e.error);
                    }
                };

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <a onClick={e => {
                                    downloadFile();
                                    e.preventDefault();
                                }}>
                                    Скачать
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <a onClick={e => {
                                    deleteFile();
                                    e.preventDefault();
                                }}>
                                    Удалить
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}