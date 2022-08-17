import { useEffect, useRef, useState } from 'react';
import { useAuthUser, useIsAuthenticated, useSignIn } from 'react-auth-kit';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from 'react-query'
import './login.css';
import {Controller, useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { login } from '../services/authservice';
import { Button } from 'primereact/button';

const schema = yup.object({
  username: yup.string()
  .email()
  .required(),
 password: yup.string().required(),
}).required();

function Login() {

  const toast = useRef();
  const isAuth = useIsAuthenticated();
  const auth = useAuthUser()()
  const signIn = useSignIn();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if(isAuth()) {
      const targetDashboard = '/dashboard';
      navigate(targetDashboard, { replace: true });
    }
    return;
  }, [isAuth,navigate,auth])

  const defaultValues = {username:'',password:''};
  const { control, handleSubmit, register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });
  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>
};


  const {isLoading, mutate} = useMutation((data) => login(data), {
    onSuccess(data) { 
      console.log(data);
      toast.current.show({severity: 'success', summary: 'Bienvenu !!!', detail: 'Connexion réussi'});
      if(signIn({token: data?.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: {id:data?.id},
           })){ 
            const targetDashboard = '/dashboard';
            navigate(targetDashboard, { replace: true });
            }else {
              toast.current.show({severity: 'error', summary: 'Une erreur s\'est produite !! ', detail: 'Connexion Echoué'});
         }
    },
    onError:(_) => {
      toast.current.show({severity: 'error', summary: 'username et/ou mot de passe incorrect !!!', detail: 'Connexion Echoué'});
    }
  })

  const onConnect = data => {
     mutate(data);
    };

  return (
    <>
      <div className="container">
  <div className="authentication-wrapper authentication-basic container-p-y">
    <div className="authentication-inner">
      {/* Register */}
      <div className="card">
        <div className="card-body">
          {/* Logo */}
          <div className="app-brand justify-content-center">
            <Link to="/" className="app-brand-link gap-2">
               <img src="/logo_crousz.png" alt="logo" style={{width: '200px', height: '200px'}} />
            </Link>
          </div>
          {/* /Logo */}
          <h4 className="mb-2">GESTION TICKET CROUSZ</h4>
          <p className="mb-4">Veuillez-vous authentifier svp!</p>
          <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit(onConnect)} method="POST">
            <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <Controller control={control} name="username" render={({field}) => (
            <input type="email" {...field} className="form-control" id="email" placeholder="Entrer votre email" autoFocus />
             )}/>
              {getFormErrorMessage('username')} 
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label" htmlFor="password">Mot de Passe</label>
              </div>
              <div className="input-group input-group-merge">
                <input type={showPassword ? 'text' : 'password'} id="password" className="form-control" {...register('password', {required: true})} placeholder="mot de passe" aria-describedby="password" />
                <span onClick={() => setShowPassword(v => !v)} className="input-group-text cursor-pointer"><i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`} /></span>
              </div>
              {getFormErrorMessage('password')} 
            </div>
            <div className="mb-3">
              <Button className="bg-green-700 d-grid w-100" loading={isLoading} type="submit">Se Connecter</Button>
            </div>
          </form>
        </div>
      </div>
      {/* /Register */}
    </div>
  </div>
</div>
<Toast ref={toast} />
    </>
  )
}

export default Login