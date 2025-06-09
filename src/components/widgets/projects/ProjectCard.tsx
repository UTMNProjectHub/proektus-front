import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IProject } from "./types/ProjectTypes";
import { useNavigate } from "react-router";
import {Badge} from "@/components/ui/badge.tsx";

interface ProjectCardProps {
    project: IProject,
}

function ProjectCard(props: ProjectCardProps) {
    const { project } = props;
    const navigate = useNavigate();

    return (
        <Card>
          <div className="-my-6">
            {project.logo && (<img src={`${import.meta.env.VITE_APP_URL}/storage/${project.logo}`} alt="Logo preview" className="absolute mx-4 mt-4 h-16 w-16 object-cover rounded-md"/>)}
            {project.cover ? (<img src={`${import.meta.env.VITE_APP_URL}/storage/${project.cover}`} alt="Cover preview" className="h-24 w-full object-cover rounded-t-md"/>) : (<div className="h-24 w-full bg-gray-200 rounded-t-md"/>)}
          </div>
          <CardHeader className="pt-4">
            <CardTitle>{project.name}</CardTitle>
            {project.description && <CardDescription className={'whitespace-normal break-all'}>{project.description}</CardDescription>}
          </CardHeader>
          <CardContent>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-0.5">
                  {project.tags.slice(0, 8).map((tag, index) => (
                      <Badge key={index}>{tag.name}</Badge>
                  ))}
                </div>
              )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center justify-end w-full">
              <a onClick={() => navigate(`/project/${project.id}`)}>Узнать больше <span>→</span></a>
            </div>
          </CardFooter>
        </Card>
    );

}

export default ProjectCard;