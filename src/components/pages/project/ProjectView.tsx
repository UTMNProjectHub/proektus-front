import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import UserBadge from "@/components/ui/userbadge";
import { IProject, IProjectFile } from "@/components/widgets/projects/types/ProjectTypes";
import axios from "axios";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { columns } from "./file-columns-def.tsx"
import { DataTable } from "@/components/ui/data-table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx";
import LoadingForm from "@/components/widgets/projectFileLoading/LoadingForm.tsx";

function ProjectPage() {
    const param = useParams();
    const [project, setProject] = useState({} as IProject);
    const [projectFiles, setProjectFiles] = useState([] as IProjectFile[]);
    const [openFileDialog, setOpenFileDialog] = useState(false);

    useEffect(() => {
        axios.get(`/api/projects/${param.id}`).then((response) => {
            setProject(response.data);
        }).catch((error) => {
            console.error("Error fetching project:", error);
        });

        axios.get(`/api/projects/${param.id}/files`).then((response) => {
            setProjectFiles(response.data);
        }).catch((error) => {
            console.error("Error fetching project files:", error);
        });
    }, []);

    console.log(projectFiles)

    return (
        <div className="flex flex-col mx-10 py-6 justify-center">
            <div className="">
                {project.cover ? (<img src={`${import.meta.env.VITE_APP_URL}/storage/${project.cover}`} alt="Cover preview" className="h-24 w-full object-fill rounded-t-md" />) : (<div className="h-24 w-full bg-gray-200 rounded-t-md" />)}
            </div>

            <div className="border-gray-200 border-1">
                <Tabs defaultValue="overview">
                    <TabsList className="w-full rounded-none justify-start bg-gray-200">
                        <TabsTrigger value="overview">Описание</TabsTrigger>
                        <TabsTrigger value="files">Файлы</TabsTrigger>
                        <TabsTrigger value="changes">Изменения</TabsTrigger>
                        <TabsTrigger value="settings">Настройки</TabsTrigger>
                    </TabsList>
                    <TabsContent value={"overview"}>
                        <div className="flex flex-row justify-between px-6 py-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-row items-center space-x-4"><p className="text-4xl font-bold">{project.name}</p><Badge className="w-24 h-8" variant={"outline"}>Публичный</Badge></div>
                                <div><p className="text-secondary-foreground text-wrap">{project.description}</p></div>
                                <div className="flex space-x-1">{project.tags?.map((tag, index) => (
                                    <Badge key={index} variant={"outline"}>{tag.name}</Badge>
                                ))}</div>
                            </div>
                            {project.logo && (<img src={`${import.meta.env.VITE_APP_URL}/storage/${project.logo}`} alt="Logo preview" className="h-36 w-36 object-cover rounded-md outline-1 outline-gray-200" />)}
                        </div>
                        <hr />
                        <div className="flex py-2 px-4">
                            <div className="container px-4 py-2">
                                <div className="inline-flex gap-1 items-center text-xl font-medium"><BookOpen /><span>README</span></div>
                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porttitor egestas finibus. Maecenas pulvinar sapien felis, at convallis ipsum vestibulum efficitur. Nullam a ex hendrerit, auctor nulla sit amet, fringilla tortor. Donec euismod volutpat aliquet. Curabitur fermentum, neque sed molestie porta, arcu leo finibus est, ultricies semper orci libero sed tellus. Etiam rhoncus augue eu mi gravida, sed malesuada orci congue. Morbi a tempus felis. Nulla semper vehicula tellus, nec sollicitudin libero iaculis eget. Vivamus faucibus ex sapien, non condimentum ligula aliquam id. In non lorem sed mi molestie molestie et nec massa. Sed a justo nec magna porta semper nec suscipit tortor.

                                    Vivamus imperdiet nunc ac sem efficitur, vel facilisis lectus facilisis. Suspendisse egestas in quam laoreet tristique. Sed tristique, augue eget consectetur ornare, leo eros sodales felis, vitae rutrum urna est bibendum diam. Sed hendrerit egestas libero at dictum. Sed sed luctus leo. Pellentesque fermentum est vitae sapien placerat, vitae fringilla lacus dapibus. Donec vitae facilisis neque. Nulla nec tempus nulla, sit amet porta velit. Nullam ac sagittis lacus. Nulla ornare rhoncus metus non viverra.

                                    In dui lacus, facilisis eu sollicitudin eu, dignissim at diam. Sed non tellus molestie mauris pretium scelerisque. Suspendisse placerat interdum nisl vel lacinia. Nullam luctus nisi sit amet sollicitudin accumsan. Proin sollicitudin neque in lacus finibus fringilla. Proin in viverra dui, sed fermentum justo. In id volutpat purus, sit amet mollis mauris. Suspendisse porttitor lacus eros, et semper est sollicitudin in. Aenean quis dignissim odio.

                                    Pellentesque ullamcorper gravida auctor. Suspendisse feugiat fringilla eros in iaculis. In interdum massa vulputate, bibendum libero vel, vehicula urna. Sed a mi vel eros bibendum dapibus ut vel turpis. In vitae ex ipsum. Aliquam quis viverra ex. Quisque et libero mollis, sagittis metus eu, dictum est.

                                    Ut id tempor justo, non scelerisque leo. Phasellus molestie, libero eu aliquet imperdiet, diam ex pellentesque neque, a suscipit tellus risus vitae arcu. Pellentesque ornare ligula quis dictum luctus. Duis accumsan sem vitae urna tincidunt fringilla. Etiam eget risus velit. Nullam pretium eget lacus non placerat. Donec vehicula justo augue, eget dapibus mi gravida id. Donec arcu nisi, laoreet in facilisis et, ornare eget augue. Pellentesque turpis erat, tempus id consequat at, malesuada in ex. Morbi mollis egestas tincidunt. Aliquam erat volutpat. Nulla ac dui tristique libero venenatis varius non at eros. Mauris malesuada dolor nisl, nec suscipit nibh gravida nec.</div>
                            </div>
                            <div className="flex flex-col max-w-96 px-2 py-1 rounded-md border-1 border-gray-200">
                                <p className="font-medium text-xl">Участники</p>
                                <hr />
                                <div className="flex flex-col py-1.5">
                                    {project.users?.map((user, index) => (
                                        <UserBadge key={index} user={user} withFullName={false} className="text-black rounded-md border-1 border-gray-400" />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </TabsContent>
                    <TabsContent value="files">
                        <div className="flex flex-col space-y-4 justify-between px-6 py-4">
                            <div className="flex flex-row">
                                <Dialog open={openFileDialog} onOpenChange={setOpenFileDialog}>
                                    <DialogTrigger asChild>
                                        <Button>Загрузить файл</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <LoadingForm projectId={project.id} setOpen={setOpenFileDialog} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <DataTable columns={columns} data={projectFiles} />
                        </div>
                    </TabsContent>


                </Tabs>
            </div>

        </div>
    )
}

export default ProjectPage;