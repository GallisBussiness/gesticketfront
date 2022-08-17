import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';

import { create } from 'react-modal-promise'

const schema = yup.object({
    nom: yup.string()
    .required(),
   debut: yup.string().required(),
  }).required();
  

const CreateDecadaireModal = ({ isOpen, onResolve, onReject }) => {

      const defaultValues = {nom: '', debut: ''};
      const {control, handleSubmit, formState: { errors } } = useForm({
          resolver: yupResolver(schema),
        defaultValues
      });
      const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    
    const onCreate = data => {
        console.log(data);
        onResolve(data);
      };
  

  return (
    <>
    <Dialog header="Creer Décadaire" visible={isOpen} onHide={() => onReject(false)}>
    <form  className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
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
                <Calendar id="debut" className="w-full" minDate={new Date()} value={field.value} onChange={(e) => field.onChange(e.value.toISOString())} showButtonBar></Calendar>
              )} />
              {getFormErrorMessage('debut')} 
            </div>
            <Button label="CREER" type="submit" className="bg-green-700 mr-2"/>
    <Button label="Annuler" onClick={() => onReject(false)} className="bg-red-500 hover:bg-red focus:bg-red-500 btn-danger mr-2"/>
          </form>
  </Dialog>
    </>
  )
}

export default create(CreateDecadaireModal);