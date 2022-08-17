import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from "primereact/inputtext";
import { create } from 'react-modal-promise'


const schema = yup.object({
    nom: yup.string().required('nom est obligatoire !'),
    valeur: yup.number().required('la valeur est obligatoire !')
   }).required();
   

const UpdateTicketModal = ({ isOpen, onResolve, onReject,ticket }) => {
    
    
    const defaultValues = {nom: ticket?.nom, valeur: ticket?.valeur};
    const {control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      defaultValues
    });
    const getFormErrorMessage = (name) => {
      return errors[name] && <small className="p-error">{errors[name].message}</small>
  };
  
  const onUpdate = data => {
      console.log(data);
      onResolve(data);
     };

  return (
    <>
      <Dialog header="Modifier Ticket" visible={isOpen} onHide={() => onReject(false)}>
      <form  className="mb-3" onSubmit={handleSubmit(onUpdate)} method="POST">
            <div className="mb-3">
            <label htmlFor="nom" className="form-label">Nom</label>
            <Controller control={control} name="nom" render={({field}) => (
            <input type="text" {...field} className="form-control focus:border-green-500" id="nom" placeholder="Entrer le nom" autoFocus />
             )}/>
              {getFormErrorMessage('nom')} 
            </div>
            <div className="mb-3 flex flex-col justify-center">
                <label htmlFor="valeur" className="form-label">Valeur</label>
              <Controller control={control} name="valeur" render={({field}) => (
               <InputText id="valeur" keyfilter="int" value={field.value} onChange={(e) => field.onChange(e.target.value)} />
              )} />
              {getFormErrorMessage('valeur')} 
            </div>
            <Button label="Mettre à jour" type="submit" className="bg-green-700 mr-2"/>
            <Button label="Annuler" onClick={() => onReject(false)} className="bg-red-500 hover:bg-red focus:bg-red-500 btn-danger mr-2"/>
          </form>
  </Dialog>
    </>
  )
}

export default create(UpdateTicketModal);