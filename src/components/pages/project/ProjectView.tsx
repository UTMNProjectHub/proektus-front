import { IProject } from "@/components/widgets/projects/types/ProjectTypes";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function ProjectPage() {
    const param = useParams();
    const [project, setProject] = useState({} as IProject);

    useEffect(() => {
        axios.get(`/api/projects/${param.id}`).then((response) => {
            setProject(response.data);
        }).catch((error) => {
            console.error("Error fetching project:", error);
        });
    }, [])


    return (
        <div className="container flex mx-auto py-6 justify-center">
            <div className="w-full">
                {project.cover ? (<img src={`${import.meta.env.VITE_APP_URL}/storage/${project.cover}`} alt="Cover preview" className="h-24 w-full object-fill rounded-t-md"/>) : (<div className="h-24 w-full bg-gray-200 rounded-t-md"/>)}
            </div>

        </div>
    )
}

export default ProjectPage;