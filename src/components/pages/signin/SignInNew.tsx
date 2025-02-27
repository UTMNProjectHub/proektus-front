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
import {Tabs, TabsContent, TabsList} from "@/components/ui/tabs.tsx";
import {TabsTrigger} from "@radix-ui/react-tabs";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean(),
});

function NewSignIn() {
  const {signIn} = useSanctum();
  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    signIn(values.email, values.password, true).then((res) => {
      if (res.signedIn) {
        navigate('/');
      }
    });
  }

  return (
    <div className={'max-w-md mx-auto my-8'}>
      <Tabs>
        <TabsList defaultValue={'login'} className={'grid w-full grid-cols-2'}>
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
                  <FormField name={'email'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>email</FormLabel>
                        <FormControl>
                          <Input placeholder={'example@utmn.ru'}/>
                        </FormControl>
                        <FormDescription>
                          email must be lowercase
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )
                  }}/>
                  <FormField name={'password'} render={({field}) => {
                    return (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input type={'password'} placeholder={'******'}/>
                        </FormControl>
                        <FormDescription>
                          password must be at least 6 characters
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )
                  }}/>
                  <div className={'flex flex-row space-x-4'}>
                    <Button variant={'outline'} onClick={loginForm.handleSubmit(onLoginSubmit)}>Login</Button>
                    <FormField name={'remember'} render={({field}) => {return (
                      <FormItem className={'flex flex-row items-center'}>
                        <FormLabel>
                          remember me
                        </FormLabel>
                        <FormControl>
                          <input type={'checkbox'}/>
                        </FormControl>
                      </FormItem>
                    )}}/>
                  </div>


              </form>
            </Form>
          </CardContent>

        </Card>

      </TabsContent>
      <TabsContent value={'register'}>

      </TabsContent>
    </Tabs>


</div>

)
}

export default NewSignIn;