import { Badge } from "@/components/ui/badge";
import { UserAutocomplete } from "./user-autocomplete";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { X } from "lucide-react";
import { IProject, IProjectUser } from "@/components/widgets/projects/types/ProjectTypes";
import { IUser } from "@/models/user/types";
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

type ProjectEditProps = {
  project: IProject;
  projectUsers: IProjectUser[];
  setProjectUsers: React.Dispatch<React.SetStateAction<IProjectUser[]>>;
  selectedUsers: IUser[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

function ProjectEdit({
  project,
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
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      axios.put(`/api/projects/${project.id}`, {
        ...values
      }).then((response) => {
        if (response.status === 200) {
          toast.success("Project updated successfully");
          setProjectUsers(response.data.users);
        } else {
          toast.error("Failed to update the project");
        }
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  function removeUser(userId: number) {
    axios.delete(`/api/projects/${project.id}/users/`).then((response) => {
      const updatedUsers = projectUsers.filter((user) => user.id !== userId);
      setProjectUsers(updatedUsers);
      toast.success("User removed successfully");
    }).catch((error) => {
      console.error("Error removing user", error);
      toast.error("Failed to remove user");
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Интересное и крутое название для вашего проекта"

                      type="text"
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Сохранить</Button>
          </form>
        </Form>
        <hr />
        <div className="flex flex-col space-y-4 py-4">
          <Label>Пользователи</Label>
          <UserAutocomplete projectID={project.id} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
          <div className="flex justify-between">
            {projectUsers && projectUsers.map((user) => (
              <Badge key={user.id} variant="outline" className="flex items-center gap-2 px-2 py-1">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={"/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-lg">{user.name}</span>
                <Select value={user.pivot ? user.pivot.role : 'member'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Роль" />
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
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectEdit;