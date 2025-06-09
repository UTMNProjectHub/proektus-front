import {Badge} from "@/components/ui/badge";
import {UserAutocomplete} from "./user-autocomplete";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Label} from "@/components/ui/label";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import {X} from "lucide-react";
import {IProject, IProjectUser} from "@/components/widgets/projects/types/ProjectTypes";
import {IUser} from "@/models/user/types";
import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    Textarea
} from "@/components/ui/textarea"
import axios from "axios";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {useNavigate} from "react-router";

type ProjectEditProps = {
    project: IProject;
    setProject: React.Dispatch<React.SetStateAction<IProject>>;
    projectUsers: IProjectUser[];
    setProjectUsers: React.Dispatch<React.SetStateAction<IProjectUser[]>>;
    selectedUsers: IUser[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    privacy: z.enum(['public', 'private']),
    cover: z.any().optional(),
    logo: z.any().optional(),
    repository_url: z.string().url().optional().or(z.literal('')), // Added for repository URL
});

function ProjectEdit({
                         project, setProject,
                         projectUsers,
                         setProjectUsers,
                         selectedUsers,
                         setSelectedUsers,
                     }: ProjectEditProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: project.name,
            description: project.description || "",
            privacy: project.privacy,
            cover: undefined,
            logo: undefined,
            repository_url: project.urls && project.urls[0]?.repository_url ? project.urls[0].repository_url : '', // Default to empty string if not set
        }
    })

    const navigate = useNavigate();

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description || '');
            formData.append('privacy', values.privacy);

            if (values.cover) {
              formData.append('cover', values.cover);
            }
            if (values.logo) {
              formData.append('logo', values.logo);
            }
            if (values.repository_url) {
                formData.append('repository_url', values.repository_url);
            }

            formData.append('_method', 'PUT');

            axios.post(`/api/projects/${project.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((response) => {
                if (response.status === 200) {
                    toast.success("Проект успешно обновлен");
                    setProjectUsers(response.data.users);
                    setProject(response.data);
                } else {
                    toast.error("Не удалось обновить проект" + response.statusText);
                }
            });
        } catch (error: any) {
            toast.error("Произошла ошибка при обновлении проекта, попробуйте позже" + error.message);
        }
    }

    function removeUser(userId: number) {
        axios.delete(`/api/projects/${project.id}/users/${userId}`).then(() => {
            const updatedUsers = projectUsers.filter((user) => user.id !== userId);
            setProjectUsers(updatedUsers);
            toast.success("Пользователь успешно удален из проекта");
        }).catch((error) => {
            toast.error("Не удалось удалить пользователя из проекта, попробуйте позже: " + error.response.data.error);
        });
    }

    function handleUserRoleChange(userId: number, role: string) {
        axios.put(`/api/projects/${project.id}/users/${userId}`, {role}).then(() => {
            const updatedUsers = projectUsers.map((user) => {
                if (user.id === userId) {
                    return {...user, pivot: {...user.pivot, role}};
                }
                return user;
            });
            setProjectUsers(updatedUsers);
            toast.success("Роль пользователя успешно обновлена");
        }).catch((error: any) => {
            toast.error("Не удалось обновить роль пользователя, попробуйте позже" + error.response.error);
        });
    }

    function handleProjectDeletion() {
        axios.delete(`/api/projects/${project.id}`).then((response) => {
            if (response.status === 200) {
                navigate("/projects");
            } else {
                toast.error("Не удалось удалить проект");
            }
        }).catch((error: any) => {
            toast.error("Произошла ошибка при удалении проекта, попробуйте позже" + error.message);
        });
    }

    return (
        <div className="flex flex-col space-y-4 px-6 py-4">
            <div className="flex flex-col space-y-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl py-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Название</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Интересное и крутое название для вашего проекта"

                                            type="text"
                                            {...field} />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Описание</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Описание"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Краткое описание позволяющее понять ваш проект</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cover"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Обложка проекта</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            // field.onChange expects a FileList, but react-hook-form might need a single file or string.
                                            // Adjust if your backend/form handling expects a different format.
                                            onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                        />
                                    </FormControl>
                                    <FormDescription>Выберите изображение для обложки вашего проекта.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Логотип проекта</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                        />
                                    </FormControl>
                                    <FormDescription>Выберите изображение для логотипа вашего проекта.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="repository_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ссылка на репозиторий</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://github.com/your/project"
                                            type="url"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Укажите URL вашего репозитория (например, GitHub, GitLab).</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Select value={form.watch('privacy')} onValueChange={(value) => {
                            form.setValue('privacy', value as 'public' | 'private');
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder={'Приватность'}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={'public'}>Публичный</SelectItem>
                                <SelectItem value={'private'}>Приватный</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit">Сохранить</Button>
                    </form>
                </Form>
                <hr/>
                <div className="flex flex-col space-y-4 py-4">
                    <Label>Пользователи</Label>
                    <UserAutocomplete projectID={project.id} selectedUsers={selectedUsers}
                                      setSelectedUsers={setSelectedUsers}/>
                    <div className="flex flex-col space-y-1.5">
                        {projectUsers && projectUsers.map((user) => (
                            <Badge key={user.id} variant="outline"
                                   className="max-w-md flex flex-wrap items-center gap-3 px-2 py-1">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={"/placeholder.svg"} alt={user.name}/>
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-lg">{user.name}</span>
                                <Select value={user.pivot ? user.pivot.role : 'member'} onValueChange={(value) => {
                                    handleUserRoleChange(user.id, value);
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Роль"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Участник</SelectItem>
                                        <SelectItem value="admin">Администратор</SelectItem>
                                        <SelectItem value="owner">Владелец</SelectItem>
                                    </SelectContent>
                                </Select>
                                <button
                                    type="button"
                                    onClick={() => removeUser(user.id)}
                                    className="ml-1 rounded-full hover:bg-muted"
                                    aria-label={`Remove ${user.name}`}
                                >
                                    <X className="w-3 h-3"/>
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
                <hr/>
                <div className="flex flex-col space-y-2">
                    <Label className="text-xl">Удалить проект</Label>
                    <Dialog>
                        <DialogTrigger className="max-w-24" asChild>
                            <Button variant={'destructive'}>
                                Удалить
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="text-lg">
                                <DialogTitle>
                                    Вы действительно хотите удалить проект?
                                </DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                Это действие нельзя отменить. Вы уверены, что хотите удалить проект?
                            </DialogDescription>
                            <DialogFooter className="flex flex-row justify-between">
                                <Button type="submit" onClick={() => (handleProjectDeletion())} variant={'destructive'}>
                                    Да, удалить
                                </Button>
                                <DialogClose>
                                    <Button type="reset" variant={'outline'}>
                                        Нет, отменить
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default ProjectEdit;