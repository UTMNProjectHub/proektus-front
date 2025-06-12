import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { passwordSchema } from "@/utils.ts";
import { PasswordInput } from "@/components/ui/password-input.tsx";
import { useSanctum } from "react-sanctum";
import { useEffect } from "react";
import GenericLoader from "@/components/ui/genericLoader";
import axios from "axios";
import { toast } from "sonner";

const profileSchema = z.object({
  surname: z.string().min(1, "Поле фамилии не может быть пустым"),
  firstname: z.string().min(1, "Поле фамилии не может быть пустым"),
  middlename: z.string().optional(),
  name: z.string().min(2, "Юзернейм должен содержать минимум 2 символа"),
  email: z
    .string()
    .email("Введите корректный email")
    .regex(/^[a-z0-9]+@utmn\.ru$/, "Email должен быть в домене utmn.ru"),
  old_password: passwordSchema,
  password: passwordSchema.optional(),
});

const ProfileEdit = () => {
  const { user, authenticated, setUser } = useSanctum();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      surname: "",
      firstname: "",
      middlename: "",
      name: "",
      email: "",
      old_password: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user?.data) {
      form.reset({
        surname: user.data.surname,
        firstname: user.data.firstname,
        middlename: user.data.middlename || "",
        name: user.data.name || "",
        email: user.data.email || "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    axios
      .put(`/api/profile`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          // window.location.reload(); // Removed page reload
          toast.success("Профиль успешно обновлен");

          if (setUser && res.data.user) {
            // Check if setUser and res.data exist
            setUser({ data: res.data.user });
          }
        }
      })
      .catch((err) => {
        if (err.status === 422) {
          const errors = err.response.data;

          for (const key in errors) {
            form.setError(key as keyof z.infer<typeof profileSchema>, {
              type: "manual",
              message: errors[key][0],
            });
          }
        } else {
          toast.error("Произошла ошибка при обновлении профиля", err.message);
        }

        console.log(err);
      });
  };

  if (authenticated === null) {
    return <GenericLoader />;
  }

  return (
    <div className="max-w-md mx-auto my-2 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Редактирование профиля</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фамилия</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="surname"
                    placeholder="Иванов"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="firstname"
                    placeholder="Иван"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middlename"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Отчество</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="middlename"
                    placeholder="Иванович"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Никнейм</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="username"
                    type="text"
                    placeholder="Введите новый юзернейм"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    type="email"
                    placeholder="Введите email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Старый пароль</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="Введите старый пароль"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder="Введите новый пароль"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Пароль должен содержать минимум 8 символов, хотя бы один
                  специальный символ и заглавную букву
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Сохранить
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEdit;
