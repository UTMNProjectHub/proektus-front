import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import LoadingForm from "@/components/widgets/projectFileLoading/LoadingForm.tsx";
import {DataTable} from "@/components/ui/data-table.tsx";
import {getFileColumns} from "@/components/pages/project/file-columns-def.tsx";
import {useEffect, useState} from "react";
import {IProject, IProjectFile} from "@/components/widgets/projects/types/ProjectTypes.ts";
import axios from "axios";
import {useParams} from "react-router";
import {toast} from "sonner";
import GenericLoader from "@/components/ui/genericLoader.tsx";

interface PageProps {
    project: IProject;
}

function ProjectFiles({ project }: PageProps)
{
    const [projectFiles, setProjectFiles] = useState<IProjectFile[]>([]);
    const [openFileDialog, setOpenFileDialog] = useState(false);
    const param = useParams();

    useEffect(() => {
        axios.get(`/api/projects/${param.id}/files`).then((response) => {
            setProjectFiles(response.data.files);
        }).catch((error) => {
            toast.error("Ошибка при загрузке файлов проекта: " + error.message)
        });
    }, [param.id, openFileDialog]);

    const handleDelete = (fileId: number) => {
        setProjectFiles(prevState => prevState.filter(f=> f.id !== fileId));
    };

    if (!projectFiles) {
        return (
            <GenericLoader/>
        );
    }

    return (
        <div className="flex flex-col space-y-4 justify-between px-6 py-4">
            <div className="flex flex-row">
                <Dialog open={openFileDialog} onOpenChange={setOpenFileDialog}>
                    <DialogTrigger asChild>
                        <Button>Загрузить файл</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Загрузить файл</DialogTitle>
                        <DialogDescription>
                            Выберите файл для загрузки в проект {project.name}.
                        </DialogDescription>
                        <LoadingForm projectId={project.id} setOpen={setOpenFileDialog} />
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={getFileColumns(handleDelete)} data={projectFiles} />
        </div>
    )
}

export default ProjectFiles;