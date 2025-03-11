import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";


// Я скоммуниздил что мог честн
const profileSchema = z.object({
    fullName: z.string().min(3, "ФИО должно содержать минимум 3 символа"),
    username: z.string().min(2, "Юзернейм должен содержать минимум 2 символа"),
    email: z.string().email("Введите корректный email").regex(/[a-z0-9]+@(utmn|study\.utmn)\.ru$/, "Email должен быть в домене utmn.ru или study.utmn.ru"),
    OldPassword: z
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов"),
    password: z
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов")
});



const ProfileEdit = () => {
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
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const onSubmit = (data: z.infer<typeof profileSchema>) => {
        console.log("Форма отправлена:", data);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Редактирование профиля</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Поле "ФИО" */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ФИО</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Введите ФИО"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/*Поле "Юзернейм"*/}
                    <FormField
                        control={form.control}
                        name={"username"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        type="username"
                                        placeholder="Введите новый юзернейм"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Поле "Email" */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Введите email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Поле "Старый пароль" */}
                    <FormField
                        control={form.control}
                        name="OldPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Старый пароль</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showOldPassword ? "text" : "password"} // Переключаем тип поля
                                            placeholder="Введите старый пароль"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setShowOldPassword(!showOldPassword)} // Переключаем видимость пароля
                                        >
                                            {showOldPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-500" /> // Иконка "глазик закрыт"
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-500" /> // Иконка "глазик открыт"
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Поле "Пароль" */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"} // Переключаем тип поля
                                            placeholder="Введите новый пароль"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setShowPassword(!showPassword)} // Переключаем видимость пароля
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-500" /> // Иконка "глазик закрыт"
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-500" /> // Иконка "глазик открыт"
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Кнопка отправки */}
                    <Button type="submit" className="w-full">
                        Сохранить
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ProfileEdit;