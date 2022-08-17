import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';

import { create } from 'react-modal-promise'
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useQuery } from 'react-query';
import { getDecadaires } from '../../services/decadaireservice';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { getTickets } from '../../services/ticketservice';

const schema = yup.object({
    date: yup.string()
    .required(),
    nombre: yup.string().required(),
    decadaire: yup.object().nullable().required(),
    ticket: yup.string().required(),
    user: yup.string().required(),
  }).required();
  

const CreateFicheModal = ({ isOpen, onResolve, onReject,auth }) => {
 
    const [currentDecadaire, setCurrentDecadaire] = useState(null);

    const qkd = ['get_decadaires',auth?._id]

    const {data: decadaires } = useQuery(qkd, () => getDecadaires());

    const qk = ['get_tickets',auth?._id]

    const {data: tickets} = useQuery(qk, () => getTickets());

    const defaultValues = {date: '', nombre: '', decadaire: null, ticket: '', user: auth?._id};
    const {control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      defaultValues
    });
    const getFormErrorMessage = (name) => {
      return errors[name] && <small className="p-error">{errors[name].message}</small>
  };

  const handleDecadaireChange = (e,field) => {
    field.onChange(e.value);
    setCurrentDecadaire(e.value);
  }
  
  const onCreate = data => {
      onResolve({...data, decadaire: data.decadaire._id, nombre: parseInt(data.nombre, 10)});
    };
  return (
    <>
     <Dialog header="Creer Fiche" className="w-1/2" visible={isOpen} onHide={() => onReject(false)}>
    <form  className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
    <div className="mb-3 flex flex-col justify-center">
            <label htmlFor="date" className="form-label">Décadaire</label>
              <Controller control={control} name="decadaire" render={({field}) => (
                   <Dropdown className="w-full" optionLabel="nom" value={field.value} options={decadaires} onChange={(e) => handleDecadaireChange(e,field)} placeholder="Selectionnez un décadaire" autoFocus/>
              )} />
              {getFormErrorMessage('decadaire')} 
            </div>
            {currentDecadaire && <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
              <Controller control={control} name="date" render={({field}) => (
                <Calendar dateFormat="dd/MM/yy" id="date" className="w-full" minDate={parseISO(currentDecadaire.debut)} maxDate={parseISO(currentDecadaire.fin)} value={parseISO(field.value)} onChange={(e) => field.onChange(e.value.toISOString())}></Calendar>
              )} />
              {getFormErrorMessage('date')} 
            </div>}
            <div className="mb-3 flex flex-col justify-center">
            <label htmlFor="ticket" className="form-label">Ticket</label>
              <Controller control={control} name="ticket" render={({field}) => (
                   <Dropdown className="w-full" optionLabel="nom" optionValue="_id" value={field.value} options={tickets} onChange={(e) => field.onChange(e.value)} placeholder="Selectionnez un ticket"/>
              )} />
              {getFormErrorMessage('ticket')} 
            </div>
            <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre de tickets</label>
            <Controller control={control} name="nombre" render={({field}) => (
            <InputText keyfilter="int" {...field} className="form-control focus:border-green-500" id="nombre" placeholder="Entrer la valeur" />
             )}/>
              {getFormErrorMessage('nombre')} 
            </div>
            <Button label="CREER" type="submit" className="bg-green-700 mr-2"/>
    <Button label="Annuler" onClick={() => onReject(false)} className="bg-red-500 hover:bg-red focus:bg-red-500 btn-danger mr-2"/>
          </form>
  </Dialog>
    </>
  )
}

export default create(CreateFicheModal)