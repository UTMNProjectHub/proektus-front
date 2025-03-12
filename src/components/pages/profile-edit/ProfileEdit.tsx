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

const profileSchema = z.object({
    fullName: z.string().min(3, "ФИО должно содержать минимум 3 символа"),
    username: z.string().min(2, "Юзернейм должен содержать минимум 2 символа"),
    email: z.string()
        .email("Введите корректный email")
        .regex(/[a-z0-9]+@(utmn|study\.utmn)\.ru$/, "Email должен быть в домене utmn.ru или study.utmn.ru"),
    OldPassword: passwordSchema,
    password: passwordSchema,
});

const ProfileEdit = () => {
    const { user } = useSanctum();
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            OldPassword: "",
            password: "",
        },
    });

    useEffect(() => {
        if (user?.data) {
            form.reset({
                fullName: `${user.data.surname || ""} ${user.data.firstname || ""} ${user.data.middlename || ""} `.trim(),
                username: user.data.name || "",
                email: user.data.email || "",
            });
        }
    }, [user, form]);


    const onSubmit = (data: z.infer<typeof profileSchema>) => {
        console.log("Форма отправлена:", data);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Редактирование профиля</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ФИО</FormLabel>
                                <FormControl>
                                    <Input placeholder="Введите ФИО" {...field} />
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
                                <FormLabel>Username</FormLabel>
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
                                    Пароль должен содержать минимум 8 символов
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
