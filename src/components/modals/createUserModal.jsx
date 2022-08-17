import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';

import { create } from 'react-modal-promise'
import { Dropdown } from 'primereact/dropdown';

const schema = yup.object({
    prenom: yup.string()
    .required(),
    nom: yup.string()
    .required(),
   email: yup.string().email().required(),
   password: yup.string().required(),
   role: yup.string().required()
  }).required();

const CreateUserModal = ({ isOpen, onResolve, onReject }) => {

    const defaultValues = {nom: '', prenom: '',email: '', password: (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).substring(0,9), role: ''};
      const {control,setValue, handleSubmit, formState: { errors } } = useForm({
          resolver: yupResolver(schema),
        defaultValues
      });

      const roles = [
        {label: 'Utilisateur',value: 'user'},
        {label: 'Administrateur',value: 'admin'}
      ];
      const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const generatePassword = (e) =>  {
        e.preventDefault();
        setValue("password",(Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).substring(0,9))
    }
    
    const onCreate = data => {
        onResolve(data);
      };

  return (
    <>
     <Dialog header="Creer un utilisateurs" visible={isOpen} onHide={() => onReject(false)} className="w-1/2">
    <form  className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
    <div className="mb-3">
            <label htmlFor="prenom" className="form-label">Prenom</label>
            <Controller control={control} name="prenom" render={({field}) => (
            <input type="text" {...field} className="form-control focus:border-green-500" id="prenom" placeholder="Entrer le prenom" />
             )}/>
              {getFormErrorMessage('prenom')} 
            </div>
            <div className="mb-3">
            <label htmlFor="nom" className="form-label">Nom</label>
            <Controller control={control} name="nom" render={({field}) => (
            <input type="text" {...field} className="form-control focus:border-green-500" id="nom" placeholder="Entrer le nom" autoFocus />
             )}/>
              {getFormErrorMessage('nom')} 
            </div>
            <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <Controller control={control} name="email" render={({field}) => (
            <input type="email" {...field} className="form-control focus:border-green-500" id="email" placeholder="Entrer l'email" />
             )}/>
              {getFormErrorMessage('email')} 
            </div>
            <div className="mb-3 flex flex-col justify-center">
            <label htmlFor="role" className="form-label">Role</label>
              <Controller control={control} name="role" render={({field}) => (
                   <Dropdown className="w-full" value={field.value} options={roles} onChange={(e) => field.onChange(e.value)} placeholder="Selectionnez le role"/>
              )} />
              {getFormErrorMessage('role')} 
            </div>
            <div className="mb-3 w-full">
            <label htmlFor="password" className="form-label">Mot de passe</label>           
                  <Controller control={control} name="password" render={({field}) => (
                    <div className="flex items-center space-x-4 w-full">
                       <Password {...field}  placeholder="Mot de passe*" toggleMask />
                       <Button label="Générer" icon="pi pi-password" className="w-200 bg-green-600 border-green-600" iconPos="right" onClick={generatePassword} />
                    </div>
                    
                    )} />
                      {getFormErrorMessage('password')}
                  </div>
            
            <Button label="CREER" type="submit" className="bg-green-700 mr-2"/>
    <Button label="Annuler" onClick={() => onReject(false)} className="bg-red-500 hover:bg-red focus:bg-red-500 btn-danger mr-2"/>
          </form>
  </Dialog>
    </>
  )
}

export default create(CreateUserModal);