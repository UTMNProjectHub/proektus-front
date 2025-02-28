import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Input} from "@/components/ui/input.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate} from "react-router";
import {useSanctum} from "react-sanctum";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import axios from "axios";
import GenericLoader from "@/components/ui/genericLoader.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  password_confirmation: z.string().min(6),
  name: z.string().min(3),
  firstname: z.string(),
  surname: z.string(),
  middlename: z.string().optional(),
}).superRefine(({password, password_confirmation}, ctx) => {
  if (password !== password_confirmation) {
    ctx.addIssue({
      code: 'custom',
      message: 'passwords do not match',
      path: ['password_confirmation'],
    });
  }
})

function NewSignIn() {
  const {signIn, authenticated, user, signOut} = useSanctum();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<object | null>(null);
  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    signIn(values.email, values.password, true).then((res) => {
      if (res.signedIn) {
        navigate('/');
      }
    }).catch((err) => {
      console.log(err);
      setLoginError(err.response.data.message)
    });
  }

  function onRegisterSubmit(values: z.infer<typeof registerSchema>) { // untested, but works fine?
    axios.post('/register', {
      email: values.email,
      name: values.name,
      password: values.password,
      password_confirmation: values.password_confirmation,
      surname: values.surname,
      firstname: values.firstname,
      middlename: values.middlename
    }).then(() => {
      navigate('/');
    }).catch(e => {
      console.log(e);
      setRegisterError(e.response.data[0])
    });
  }

  if (authenticated === null) {
    return (
      <GenericLoader/>
    )
  }

  if (authenticated) {
    return (
      <div className={''}>
        <Card className={'max-w-md mx-auto my-8'}>
          <CardHeader className={'text-center font-bold'}>
            You are already signed in as
          </CardHeader>
          <CardContent>
            <Avatar className={'size-16 mx-auto mb-2'}>
              <AvatarFallback>
                {user.data.firstname.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className={'flex flex-col text-center'}>
              <span>
                {user.data.surname} {user.data.firstname.slice(0, 1)}. (@{user.data.name})
              </span>
              <Button variant={'link'} onClick={signOut}>Sign out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={'max-w-md mx-auto my-8'}>
      <Tabs defaultValue={'login'}>
        <TabsList className={'grid w-full grid-cols-2'}>
          <TabsTrigger value={'login'}>
            Login
          </TabsTrigger>
          <TabsTrigger value={'register'}>
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value={'login'}>
          <Card>
            <CardHeader>
              Login
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className={'space-y-6'}>
                  {loginError && <Card>
                      <CardHeader className={'font-bold'}>
                          Error!
                      </CardHeader>
                      <CardContent className={'text-destructive-foreground'}>
                        {loginError}
                      </CardContent>
                  </Card>}
                  <FormField control={loginForm.control} name={'email'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>email</FormLabel>
                        <FormControl>
                          <Input placeholder={'example@utmn.ru'} {...field} />
                        </FormControl>
                        <FormDescription>
                          email must be lowercase
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <FormField control={loginForm.control} name={'password'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input type={'password'} placeholder={'******'} {...field} />
                        </FormControl>
                        <FormDescription>
                          password must be at least 6 characters
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <div className={'flex flex-row space-x-4'}>
                    <Button variant={'outline'} className={'w-32'}
                            onClick={loginForm.handleSubmit(onLoginSubmit)}>Login</Button>
                    <FormField control={loginForm.control} name={'remember'} render={({field}) => {
                      return (
                        <FormItem className={'flex flex-row items-center'}>
                          <FormLabel>
                            remember me
                          </FormLabel>
                          <FormControl>
                            <input type={'checkbox'} checked={field.value} onChange={field.onChange}
                                   name={field.name}/>
                          </FormControl>
                        </FormItem>
                      );
                    }}/>
                  </div>
                </form>
              </Form>

            </CardContent>

          </Card>
        </TabsContent>
        <TabsContent value={'register'}>
          <Card>
            <CardHeader>
              Register
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className={'space-y-6'}>
                  {registerError && <Card>
                      <CardHeader className={'font-bold'}>
                          Error!
                      </CardHeader>
                      <CardContent className={'text-destructive-foreground'}>
                        {Object.keys(registerError).map((key) => {
                          return (
                            <div key={key}>
                              <span className={'font-bold'}>{key}</span>
                              <ul>
                                {Object.entries(registerError).map(([k, v]) => {
                                  return (
                                    <li key={k}>{v}</li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}
                      </CardContent>
                  </Card>}
                  <FormField control={registerForm.control} name={'email'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>email</FormLabel>
                        <FormControl>
                          <Input type={'email'} placeholder={'example@utmn.ru'} {...field} />
                        </FormControl>
                        <FormDescription>
                          your email address, lowercase
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <FormField control={registerForm.control} name={'name'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>username</FormLabel>
                        <FormControl>
                          <Input placeholder={'username'} {...field} />
                        </FormControl>
                        <FormDescription>
                          your username, must be unique
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <FormField control={registerForm.control} name={'password'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input type={'password'} placeholder={'******'} {...field} />
                        </FormControl>
                        <FormDescription>
                          password must be at least 6 characters
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <FormField control={registerForm.control} name={'password_confirmation'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>confirm password</FormLabel>
                        <FormControl>
                          <Input type={'password'} placeholder={'******'} {...field} />
                        </FormControl>
                        <FormDescription>
                          confirm your password
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <FormField control={registerForm.control} name={'surname'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>surname</FormLabel>
                        <FormControl>
                          <Input placeholder={'Ivanov'} {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <FormField control={registerForm.control} name={'firstname'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>firstname</FormLabel>
                        <FormControl>
                          <Input placeholder={'Ivan'} {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <FormField control={registerForm.control} name={'middlename'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>middlename</FormLabel>
                        <FormControl>
                          <Input placeholder={'Ivanovich'} {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    );
                  }}/>
                  <div className={'flex justify-center flex-row space-x-4'}>
                    <Button variant={'outline'} className={'w-48'}
                            onClick={registerForm.handleSubmit(onRegisterSubmit)}>Register</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

        </TabsContent>
      </Tabs>
    </div>
  )
}

export default NewSignIn;