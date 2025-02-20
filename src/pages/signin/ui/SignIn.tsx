import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

export function SignIn() {
  return (
    <div className={'max-w-md mx-auto my-8'}>
      <div className={'mb-4'}>
        <a className={'text-3xl tracking-tighter'}>Proektus</a>
      </div>
      <Tabs className={'font-inter lowercase'}>
        <TabsList defaultValue={'login'} className={'grid w-full grid-cols-2'}>
          <TabsTrigger value={'login'}>Login</TabsTrigger>
          <TabsTrigger value={'register'}>Register</TabsTrigger>
        </TabsList>
        <TabsContent value={'login'}>
          <Card>
            <CardHeader>
              <CardTitle>
                Login
              </CardTitle>
              <CardDescription>
                Login with your credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={'grid gap-2'}>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'} htmlFor={'emailLogin'}>email</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'emailLogin'} name={'email'} type={'text'} placeholder={'user@example.com'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  email must be lowercase
                </span>
                </div>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'} htmlFor={'passwordLogin'}>password</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'passwordLogin'} name={'password'} type={'text'} placeholder={'pwd'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  password should be atleast 6 characters long
                </span>
                </div>
                <Button variant={'outline'}>Login</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={'register'}>
          <Card>
            <CardHeader>
              <CardTitle>
                Register
              </CardTitle>
              <CardDescription>
                Register as a new user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={'grid gap-2'}>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'} htmlFor={'emailRegister'}>email</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'emailRegister'} name={'email'} type={'text'} placeholder={'user@utmn.ru'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  email must be lowercase
                </span>
                </div>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'} htmlFor={'nameRegister'}>username</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'nameRegister'} name={'name'} type={'text'} placeholder={'username'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  username will be visible to others
                </span>
                </div>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'}>fullname</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'surnameRegister'} name={'surname'} type={'text'} placeholder={'Ivanov'}/>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'firstnameRegister'} name={'firstname'} type={'text'} placeholder={'Ivan'}/>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'middlenameRegister'} name={'middlename'} type={'text'} placeholder={'Ivanovich'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  your fullname will be visible to others only when its necessary
                </span>
                </div>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'} htmlFor={'passwordRegister'}>password</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'passwordRegister'} name={'password'} type={'text'} placeholder={'pwd'}/>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'passwordConfirmationRegister'} name={'password_confirmation'} type={'text'} placeholder={'confirm pwd'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  password should be atleast 6 characters long
                </span>
                </div>
                <Button variant={'outline'}>Register</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SignIn;