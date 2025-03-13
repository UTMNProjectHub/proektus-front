import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl, FormDescription,
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
import {useEffect} from "react";
import GenericLoader from "@/components/ui/genericLoader";

const profileSchema = z.object({
    surname: z.string().min(1, 'Поле фамилии не может быть пустым'),
    firstname: z.string().min(1, "Поле фамилии не может быть пустым"),
    middlename: z.string(),
    username: z.string().min(2, "Юзернейм должен содержать минимум 2 символа"),
    email: z.string()
        .email("Введите корректный email")
        .regex(/^[a-z0-9]+@utmn\.ru$/, "Email должен быть в домене utmn.ru"),
    OldPassword: passwordSchema,
    password: passwordSchema,
});

const ProfileEdit = () => {
    const { user, authenticated } = useSanctum();
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            surname: "",
            firstname: "",
            middlename: "",
            username: "",
            email: "",
            OldPassword: "",
            password: "",
        },
    });

    useEffect(() => {
        if (user?.data) {
            form.reset({
                surname: user.data.surname,
                firstname: user.data.firstname,
                middlename: user.data.middlename || "",
                username: user.data.name || "",
                email: user.data.email || "",
            });
        }
    }, [user, form]);


    const onSubmit = (data: z.infer<typeof profileSchema>) => {
        console.log("Форма отправлена:", data);
    };

    if (authenticated === null) {
        return (
          <GenericLoader/>
        )
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
                                    <Input placeholder="Иванов" {...field} />
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
                                    <Input placeholder="Иван" {...field} />
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
                                    <Input placeholder="Иванович" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Никнейм</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Введите новый юзернейм" {...field} />
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
                                    <Input type="email" placeholder="Введите email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="OldPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Старый пароль</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder="Введите старый пароль" {...field} />
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
                                    <PasswordInput placeholder="Введите новый пароль" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Пароль должен содержать минимум 8 символов, хотя бы один специальный символ и заглавную букву
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
