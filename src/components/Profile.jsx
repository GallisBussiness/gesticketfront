/* eslint-disable no-script-url */

import { Button } from "primereact/button"
import {Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateUser } from "../services/userservice";
import { useMutation, useQueryClient } from 'react-query';
import { useRef } from "react";
import { Toast } from "primereact/toast";


const schema = yup.object({
  prenom: yup.string()
  .required('prenom est obligatoire !'),
 nom: yup.string().required('nom est obligatoire !'),
 email: yup.string().email('email invalid !!!').required('email est obligatoire !')
}).required();

const Profile = ({auth}) => {
const toast = useRef();
const qc = useQueryClient()
const qk = ['auth',auth?._id]
  const defaultValues = {prenom: auth?.prenom, nom: auth?.nom, email: auth?.email};
  const defaultValuesP = {oldpass: '', newpass: ''};
  const {control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  const {control:controlP, handleSubmit:handleSubmitP, formState: { errors: errorsP } } = useForm({
    defaultValues:defaultValuesP
  });
  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>
};
const getFormErrorMessageP = (name) => {
  return errorsP[name] && <small className="p-error">{errorsP[name].message}</small>
};

const {mutate,isLoading} = useMutation(({id,data}) => updateUser(id, data),{
  onSuccess: (_) => {
      qc.invalidateQueries(qk);
     toast.current.show({severity: 'success', summary: 'Les informations du profil ont été modifiées ', detail: 'Modification profil' })
  },
  onError: (_) => toast.current.show({severity: 'error', summary:'Un problème avec la modification du profil', detail: 'Modification profil'})
})

const onUpdate = (data) => {
  mutate({id: auth?._id, data});
}


  return (
    <>
    {/* Menu */}
    
      {/* / Navbar */}
      {/* Content wrapper */}
      <div className="content-wrapper">
        {/* Content */}
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row">
            <div className="col-md-12">
              <div className="card mb-4">
                <h5 className="card-header">Informations du Profil</h5>
                {/* Account */}
                <hr className="my-0" />
                <div className="card-body">
                  <form  onSubmit={handleSubmit(onUpdate)} method="POST">
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <Controller control={control} name="prenom" render={({field}) => (
                          <>
                          <label htmlFor="firstName" className="form-label">Prenom</label>
                           <input className="form-control" type="text" {...field}  autoFocus />
                          </>
                          
                        )} />
                        {getFormErrorMessage('prenom')}
                      </div>
                      <div className="mb-3 col-md-6">
                        <Controller control={control} name="nom" render={({field}) => (
                          <>
                          <label htmlFor="lastName" className="form-label">Nom</label>
                        <input className="form-control" type="text" {...field} />
                          </>
                        )} />
                        {getFormErrorMessage('nom')}
                      </div>
                      <div className="mb-3 col-md-12">
                        <Controller control={control} name="email" render={({field}) => (
                          <>
                           <label htmlFor="email" className="form-label">E-mail</label>
                        <input className="form-control" type="text" id="email" {...field} />
                          </>
                        )} />
                       {getFormErrorMessage('email')}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button type="submit" label="MODIFIER" loading={isLoading} className="bg-green-700 text-white btn me-2" />
                    </div>
                  </form>
                </div>
                {/* /Account */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card mb-4">
                <h5 className="card-header">GESTION DU MOT DE PASSE</h5>
                {/* Account */}
                <hr className="my-0" />
                <div className="card-body">
                  <form  onSubmit={handleSubmitP(console.log)} method="POST">
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <Controller control={controlP} name="oldpass" render={({field}) => (
                          <>
                          <label  className="form-label">Ancien mot de passe</label>
                           <input className="form-control" type="text" {...field} />
                          </>
                          
                        )} />
                        {getFormErrorMessageP('oldpass')}
                      </div>
                      <div className="mb-3 col-md-6">
                        <Controller control={controlP} name="newpass" render={({field}) => (
                          <>
                          <label htmlFor="newpass" className="form-label">Nouveau Mot de Passe</label>
                        <input className="form-control" type="text" {...field} />
                          </>
                        )} />
                        {getFormErrorMessageP('newpass')}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button type="submit" label="MODIFIER MOT DE PASSE" className="bg-green-700 text-white btn me-2" />
                    </div>
                  </form>
                </div>
                {/* /Account */}
              </div>
            </div>
          </div>
        </div>
        {/* / Content */}
      </div>
      <Toast ref={toast} />
      {/* Content wrapper */}
    </>
  )
}

export default Profile