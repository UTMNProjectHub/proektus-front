import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать минимум 2 символа",
  }),
  description: z.string().optional(),
  type: z.string().optional(),
});

function ProjectCreate() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.description) {
        formData.append("description", values.description);
      }

      if (values.type) {
        formData.append("type", values.type);
      }

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      console.log("Form submitted:", values);
      console.log("Logo file:", logoFile);
      console.log("Cover file:", coverFile);

      await axios
        .post("/api/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.status === 201) {
            toast.success("Проект успешно создан!");
            navigate(`/projects/my`);
          }
        })
        .catch((error) => {
          toast.error("Ошибка при создании проекта: " + error.message);

          const errors = error.response.data;

          for (const key in errors) {
            form.setError(key as keyof z.infer<typeof formSchema>, {
              type: "manual",
              message: errors[key][0],
            });
          }
        });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex mx-auto py-10 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Создание нового проекта</CardTitle>
          <CardDescription>
            Заполните форму ниже, чтобы создать новый проект.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название проекта*</FormLabel>
                    <FormControl>
                      <Input placeholder="Мой супер-дупер проект" {...field} />
                    </FormControl>
                    <FormDescription>
                      Дайте вашему проекту имя. Это обязательное поле.
                    </FormDescription>
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
                        placeholder="Опишите свой проект (необязательно)"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Краткое описание вашего проекта.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo">Логотип (необязательно)</Label>
                    <div className="mt-2">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                      {form.formState.errors.logo && (
                        <p className="mt-1 text-sm text-destructive">
                          {form.formState.errors.logo?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {logoPreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Превью:</p>
                      <div className="h-32 w-32 relative rounded-md overflow-hidden border">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Upload */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cover">Обложка (необязательно)</Label>
                    <div className="mt-2">
                      <Input
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                      />
                      {form.formState.errors.cover && (
                        <p className="mt-1 text-sm text-destructive">
                          {form.formState.errors.cover?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {coverPreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Превью:</p>
                      <div className="h-32 w-full relative rounded-md overflow-hidden border">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Создаю..." : "Создать проект"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="hidden md:block w-1/3 space-y-1.5">
        <p className={"font-semibold"}>Превью карточки проекта:</p>
        <Card>
          <div className="-my-6">
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="absolute mx-4 mt-4 h-16 w-16 object-cover rounded-md"
              />
            )}
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="h-24 w-full object-cover rounded-t-md"
              />
            ) : (
              <div className="h-24 w-full bg-gray-200 rounded-t-md" />
            )}
          </div>
          <CardHeader className="pt-4">
            <CardTitle>{form.watch("name") || "Название"}</CardTitle>
            <CardDescription>
              {form.watch("description") ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam lectus, dapibus ac dolor ac, rutrum."}
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center justify-end w-full">
              <p>
                Узнать больше <span>→</span>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ProjectCreate;
