import { parseISO } from 'date-fns';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { create } from 'react-modal-promise'

const schema = yup.object({
    nom: yup.string()
    .required(),
   debut: yup.string().required(),
  }).required();

const UpdateDecadaireModal = ({ isOpen, onResolve, onReject,decadaire }) => {
    const defaultValues = {nom: decadaire?.nom, debut: decadaire?.debut,etat: decadaire.etat};
  const {control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });
  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>
};

const onUpdate = data => {
  onResolve({_id:decadaire?._id,...data,});
   };

  return (
    <>
    <Dialog header="Modifier Décadaire" visible={isOpen} onHide={() => onReject(false)}>
    <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit(onUpdate)} method="POST">
            <div className="mb-3">
            <label htmlFor="nom" className="form-label">Nom</label>
            <Controller control={control} name="nom" render={({field}) => (
            <input type="text" {...field} className="form-control focus:border-green-500" id="nom" placeholder="Entrer le nom" autoFocus />
             )}/>
              {getFormErrorMessage('nom')} 
            </div>
            <div className="mb-3">
            <label htmlFor="debut" className="form-label">Debut</label>
              <Controller control={control} name="debut" render={({field}) => (
                <Calendar id="debut" className="w-full" value={parseISO(field.value)} onChange={(e) => field.onChange(e.value.toISOString())} showButtonBar></Calendar>
              )} />
              {getFormErrorMessage('debut')} 
            </div>
            <div className="mb-3 flex items-center space-x-2">
            <label htmlFor="etat" className="form-label">Etat</label>
              <Controller control={control} name="etat" render={({field}) => (
                <InputSwitch checked={field.value === 'ouvert' ? true : false} onChange={(e) => field.onChange(e.value ? 'ouvert' : 'ferme')} />
              )} />
              {getFormErrorMessage('etat')} 
            </div>
            <Button label="Mettre à jour" type="submit" className="bg-green-700 mr-2"/>
    <Button label="Annuler" onClick={() => onReject(false)} className="bg-red-500 hover:bg-red focus:bg-red-500 btn-danger mr-2"/>
          </form>
  </Dialog>
    </>
  )
}

export default create(UpdateDecadaireModal);