import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useSanctum} from "react-sanctum";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";

export interface registerData {
  email: string,
  name: string,
  password: string,
  password_confirmation: string,
  surname: string,
  firstname: string,
  middlename: string | undefined,
}

export interface loginData {
  email: string,
  password: string,
  remember: boolean,
}

export function SignIn() {
  const {signIn, checkAuthentication} = useSanctum();
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState({email: '', password: '', remember: true} as loginData);
  const [registerInput, setRegisterInput] = useState({
    email: '',
    name: '',
    surname: '',
    firstname: '',
    middlename: '',
    password: '',
    password_confirmation: ''
  } as registerData);

  const handleLogin = () => {
    signIn(loginInput.email, loginInput.password, false).then((res) => {
      if (res.signedIn) {
        navigate('/');
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name} = event.target;
    let value: string | boolean;
    if (name == 'remember') {
      value = !(loginInput.remember);
    } else {
      value = event.target.value;
    }
    setLoginInput(prevState => ({...prevState, [name]: value}));
  }

  const handleRegisterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setRegisterInput(prevState => ({...prevState, [name]: value}));
  }

  function handleRegister() { // untested, but works fine?
    axios.post('/register', {
      email: registerInput.email,
      name: registerInput.name,
      password: registerInput.password,
      password_confirmation: registerInput.password_confirmation,
      surname: registerInput.surname,
      firstname: registerInput.firstname,
      middlename: registerInput.middlename
    }).then(() => {
      checkAuthentication().then(r => {if (r) { // doesn't work sadly
        navigate('/')
      }}).catch(e => console.log(e))
    }).catch(e => console.log(e))
  }

  return (
    <div className={'max-w-md mx-auto my-8'}>
      <div className={'mb-4'}>
        <a className={'text-3xl tracking-tighter'}>Proektus</a>
      </div>
      <Tabs defaultValue={'login'} className={'font-inter lowercase'}>
        <TabsList className={'grid w-full grid-cols-2'}>
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
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'emailLogin'} name={'email'}
                         type={'text'} value={loginInput.email} onChange={handleLoginChange}
                         placeholder={'user@example.com'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  email must be lowercase
                </span>
                </div>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'} htmlFor={'passwordLogin'}>password</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'passwordLogin'}
                         name={'password'} value={loginInput.password} onChange={handleLoginChange} type={'password'}
                         placeholder={'pwd'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  password should be atleast 6 characters long
                </span>
                </div>
                <div className={'flex flex-row gap-4 items-center justify-start'}>
                  <Button variant={'outline'} className={'w-24'} onClick={handleLogin}>Login</Button>
                  <a className={'flex gap-1'}><input type={'checkbox'} name={'remember'} checked={loginInput.remember}
                                                     onChange={handleLoginChange}/>Remember me</a>
                </div>
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
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'emailRegister'} name={'email'}
                         type={'text'} value={registerInput.email} onChange={handleRegisterChange}
                         placeholder={'user@utmn.ru'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  email must be lowercase
                </span>
                </div>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'} htmlFor={'nameRegister'}>username</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'nameRegister'} name={'name'}
                         type={'text'} value={registerInput.name} onChange={handleRegisterChange}
                         placeholder={'username'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  username will be visible to others
                </span>
                </div>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'}>fullname</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'surnameRegister'}
                         name={'surname'} value={registerInput.surname} onChange={handleRegisterChange} type={'text'}
                         placeholder={'Ivanov'}/>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'firstnameRegister'}
                         name={'firstname'} value={registerInput.firstname} onChange={handleRegisterChange}
                         type={'text'}
                         placeholder={'Ivan'}/>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'middlenameRegister'}
                         name={'middlename'} value={registerInput.middlename} onChange={handleRegisterChange}
                         type={'text'} placeholder={'Ivanovich'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  your fullname will be visible to others only when its necessary
                </span>
                </div>
                <div className={'space-y-2'}>
                  <label className={'block font-medium tracking-tight'} htmlFor={'passwordRegister'}>password</label>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'passwordRegister'}
                         name={'password'} value={registerInput.password} onChange={handleRegisterChange}
                         type={'password'}
                         placeholder={'pwd'}/>
                  <input className={'block outline-1 rounded-sm py-1 px-2 w-full'} id={'passwordConfirmationRegister'}
                         name={'password_confirmation'} value={registerInput.password_confirmation}
                         onChange={handleRegisterChange} type={'password'} placeholder={'confirm pwd'}/>
                  <span className={'block text-sm text-muted-foreground'}>
                  password should be atleast 6 characters long
                </span>
                </div>
                <Button variant={'outline'} onClick={handleRegister}>Register</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SignIn;