/* eslint-disable no-script-url */

import { Button } from "primereact/button"
import {Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const schema = yup.object({
  prenom: yup.string()
  .required('prenom est obligatoire !'),
 nom: yup.string().required('nom est obligatoire !'),
 email: yup.string().email('email invalid !!!').required('email est obligatoire !')
}).required();


/* eslint-disable jsx-a11y/anchor-is-valid */
const Profile = ({auth}) => {

  const defaultValues = {prenom: auth?.prenom, nom: auth?.nom, email: auth?.email};
  const {control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });
  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>
};

const onUpdate = (data) => {
  console.log(data);
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
                  <form id="formAccountSettings" onSubmit={handleSubmit(onUpdate)} method="POST">
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <Controller control={control} name="prenom" render={({field}) => (
                          <>
                          <label htmlFor="firstName" className="form-label">Prenom</label>
                           <input className="form-control" type="text" id="firstName" {...field}  autoFocus />
                          </>
                          
                        )} />
                        {getFormErrorMessage('prenom')}
                      </div>
                      <div className="mb-3 col-md-6">
                        <Controller control={control} name="nom" render={({field}) => (
                          <>
                          <label htmlFor="lastName" className="form-label">Nom</label>
                        <input className="form-control" type="text" id="lastName" {...field} />
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
                      <Button type="submit" label="SAUVEGARDER" className="bg-green-700 text-white btn me-2" />
                      <Button type="reset" label="ANNULER" className="bg-red-500 text-white" />
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
      {/* Content wrapper */}
    </>
  )
}

export default Profile