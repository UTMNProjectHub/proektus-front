import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import UserBadge from "@/components/ui/userbadge";
import {IProject, IProjectUser} from "@/components/widgets/projects/types/ProjectTypes";
import axios from "axios";
import {BookOpen, FileText, GitBranch} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {ISanctumUser, IUser} from "@/models/user/types.ts";
import ProjectEdit from "./project-edit.tsx";
import ProjectFiles from "@/components/pages/project/project-view/project-files.tsx";
import {toast} from "sonner";
import GenericLoader from "@/components/ui/genericLoader.tsx";
import {useSanctum} from "react-sanctum";
import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose} from "@/components/ui/dialog.tsx";
import {Edit3} from "lucide-react";
import EditorToolbar from "./EditorToolbar.tsx"; // Import the toolbar

function ProjectPage() {
    const {id} = useParams<{ id: string }>();
    const {user} = useSanctum<ISanctumUser>();
    const [project, setProject] = useState({} as IProject);
    const [readmeContent, setReadmeContent] = useState(''); // Initialize with empty string
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [projectUsers, setProjectUsers] = useState<IProjectUser[]>([]);
    const [isEditable, setIsEditable] = useState(false);
    const [isProjectUser, setIsProjectUser] = useState(false);
    const [isReadmeEditorOpen, setIsReadmeEditorOpen] = useState(false);
    const navigate = useNavigate();

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: readmeContent,
        // onUpdate: ({editor}) => {
        //     setReadmeContent(editor.getHTML());
        // },
        editable: isEditable,
    });

    useEffect(() => {
        axios
            .get(`/api/projects/${id}`)
            .then((res) => {
                setProject(res.data);
                setReadmeContent(res.data.description || 'asdf'); // Use project.description or default
            })
            .catch((err) => {
                toast.error("Ошибка при загрузке проекта: " + err.message);
                if (err.response?.status === 404) navigate("/404");
                if (err.response?.status === 403) navigate("/");
            });

        axios
            .get(`/api/projects/${id}/readme`)
            .then((res) => {
                setReadmeContent(res.data.readme || ''); // Use readme or default to empty string
                editor?.commands.setContent(res.data.readme || ''); // Set initial content in editor
            })
            .catch((err) => {
                toast.error("Ошибка при загрузке README: " + err.message);
            });

    }, [id, navigate]);

    useEffect(() => {
        axios
            .get(`/api/projects/${id}/users`)
            .then((res) => setProjectUsers(res.data.users))
            .catch((err) => toast.error("Ошибка при загрузке участников: " + err.message));
    }, [id, selectedUsers]);

    useEffect(() => {
        if (user) {
            setIsProjectUser(projectUsers.some((u) => u.id === user.data.id));
            setIsEditable(
                projectUsers.some(
                    (u) => u.id === user.data.id && ["admin", "owner"].includes(u.pivot.role)
                ) || user.data.roles.some(role => role.name === 'admin' || role.name === 'teacher')
            );
        }
    }, [projectUsers, user]);

    useEffect(() => {
        if (editor && isEditable !== editor.isEditable) {
            editor.setEditable(isEditable);
        }
        // Update editor content when readmeContent changes from outside (e.g. initial load)
        if (editor && readmeContent !== editor.getHTML()) {
            editor.commands.setContent(readmeContent);
        }
    }, [isEditable, editor, readmeContent]);

    if (import.meta.env.MODE === 'development') {
        console.log(project);
    }

    if (project === null) { // Explicitly check for null
        return <GenericLoader/>
    }

    return (
        <div className="flex flex-col mx-10 py-6 justify-center">
            <div className="">
                {project.cover ? (
                    <img src={`${import.meta.env.VITE_APP_URL}/storage/${project.cover}`} alt="Cover preview"
                         className="h-24 w-full object-cover rounded-t-md"/>) : (
                    <div className="h-24 w-full bg-gray-200 rounded-t-md"/>)}
            </div>

            <div className="border-gray-200 border-1">
                <Tabs defaultValue="overview">
                    <TabsList className="w-full rounded-none justify-start bg-gray-200">
                        <TabsTrigger value="overview">Описание</TabsTrigger>
                        <TabsTrigger value="files">Файлы</TabsTrigger>
                        {isEditable && <TabsTrigger value="settings">Настройки</TabsTrigger>}
                    </TabsList>
                    <TabsContent value={"overview"}>
                        <div className="flex flex-wrap space-y-2 md:flex-row space-x-4 px-8 py-4 md:justify-between">
                            {project.logo && (
                                <img src={`${import.meta.env.VITE_APP_URL}/storage/${project.logo}`} alt="Logo preview"
                                     className="h-36 w-36 object-cover rounded-md outline-1 outline-gray-200 order-1 md:order-2"/>)}
                            <div className="flex flex-col space-y-2 order-2 md:order-1">
                                <div className="flex flex-row flex-wrap space-y-2 items-center space-x-4"><p
                                    className="text-4xl font-bold">{project.name}</p><Badge className="w-24 h-8"
                                                                                            variant={"outline"}>{project.privacy === 'public' ? "Публичный" : "Приватный"}</Badge>
                                </div>
                                <div><p className="text-secondary-foreground whitespace-normal break-all">{project.description}</p></div>
                                <div className="flex flex-wrap space-x-1">{project.tags?.map((tag, index) => (
                                    <Badge key={index} variant={"outline"}>{tag.name}</Badge>
                                ))}</div>
                                <div className="flex space-x-1">{
                                    project.urls?.map((link, index) => (
                                        <Badge key={`repo-${index}`} className="bg-white outline-1"><GitBranch
                                            className="invert"/><a href={link.repository_url} target="_blank"
                                                                   className="text-blue-500 hover:underline">Репозиторий</a></Badge>
                                    ))
                                }</div>
                                <div className="flex space-x-1"></div>
                            </div>
                        </div>
                        <hr/>
                        <div className="flex flex-col md:flex-row justify-between px-4 py-2">
                            <div className="max-w-[80%] space-y-2 flex-grow order-2 md:order-1 px-4 py-2">
                                {project.annotation && <div className={'inline-flex flex-col gap-1'}>
                                    <p className={'flex gap-1 flex-row'}><FileText/><span className={'text-xl font-medium'}>Аннотация: </span></p>
                                    <p className={'border px-2 py-1 rounded-md text-wrap'}>{project.annotation}</p>
                                </div>}
                                <div className="inline-flex gap-1 items-center text-xl font-medium">
                                    <BookOpen/><span>README</span>
                                    {isEditable && (
                                        <Button variant="ghost" size="sm" onClick={() => setIsReadmeEditorOpen(true)}
                                                className="ml-2">
                                            <Edit3 className="h-4 w-4"/>
                                        </Button>
                                    )}
                                </div>
                                <div className={'text-wrap border p-2 rounded min-h-32 prose dark:prose-invert max-w-none overflow-auto'}
                                     dangerouslySetInnerHTML={{__html: readmeContent}}/>
                            </div>
                            <div
                                className="flex order-1 flex-grow-0 md:order-2 flex-col max-w-96 px-2 mx-3 md:mx-0 py-1 rounded-md border-1 border-gray-200">
                                <p className="font-medium text-xl">Участники</p>
                                <hr/>
                                <div className="flex flex-col py-1.5 space-y-1">
                                    {project.users?.length ? project.users?.map((user, index) => (
                                        <UserBadge key={index} user={user} withFullName={false}
                                                   className="text-black rounded-md border-1 border-gray-400"/>
                                    )) : <div className={'text-center text-muted-foreground w-36'}>Нет участников</div>}
                                </div>
                            </div>
                        </div>

                    </TabsContent>
                    <TabsContent value="files">
                        <ProjectFiles isProjectUser={isProjectUser || isEditable} project={project} />
                    </TabsContent>
                    <TabsContent value="settings">
                        <ProjectEdit project={project} setProject={setProject} projectUsers={projectUsers}
                                     setProjectUsers={setProjectUsers}
                                     selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
                    </TabsContent>


                </Tabs>
            </div>

            {isEditable && (
                <Dialog open={isReadmeEditorOpen} onOpenChange={setIsReadmeEditorOpen}>
                    <DialogContent className="sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] w-full">
                        <DialogHeader>
                            <DialogTitle>Редактирование README</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col h-full overflow-hidden">
                            <EditorToolbar editor={editor}/>
                            <div
                                className="prose dark:prose-invert max-w-none flex-grow overflow-auto border rounded-md p-2">
                                <EditorContent editor={editor}/>
                            </div>
                        </div>
                        <DialogFooter className="mt-auto pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" onClick={() => setIsReadmeEditorOpen(false)}>
                                    Отмена
                                </Button>
                            </DialogClose>
                            <Button type="button" onClick={() => {
                                const newReadme = editor?.getHTML() || '';


                                axios.put(`/api/projects/${id}/readme`, {readme: newReadme}).then((res) =>
                                    {
                                        if (res.status === 200) {
                                            setReadmeContent(newReadme);
                                            toast.success("README обновлено успешно.");
                                        }
                                    }
                                ).catch((err) => {
                                    toast.error("Ошибка при сохранении README: " + err.message);
                                }).finally(() => {
                                    setIsReadmeEditorOpen(false);
                                });

                            }}>
                                Сохранить
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    )
}

export default ProjectPage;