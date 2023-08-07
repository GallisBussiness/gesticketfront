import { parseISO } from 'date-fns';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { create } from 'react-modal-promise'
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useQuery } from 'react-query';
import { getDecadairesOuvert } from '../../services/decadaireservice';
import { getTickets } from '../../services/ticketservice';
import { useState } from 'react';

const schema = yup.object({
    date: yup.string()
    .required(),
    nombre: yup.string().required(),
    decadaire: yup.object().nullable().required(),
    ticket: yup.string().required(),
  }).required();
  

const UpdateFicheModal = ({ isOpen, onResolve, onReject,fiche }) => {

    const [currentDecadaire, setCurrentDecadaire] = useState(fiche.decadaire);
    const qkd = ['get_decadaires']

    const {data: decadaires } = useQuery(qkd, () => getDecadairesOuvert());

    const qk = ['get_tickets']

    const {data: tickets} = useQuery(qk, () => getTickets());

    const defaultValues = {date: fiche.date, nombre: fiche.nombre, decadaire: fiche.decadaire, ticket: fiche.ticket._id};
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
  
  const onUpdate = data => {
    onResolve({_id:fiche?._id,...data, decadaire: data.decadaire._id, nombre: parseInt(data.nombre, 10)});
     };

  return (
    <>
     <Dialog header="Mis à jour Fiche" visible={isOpen} onHide={() => onReject(false)}>
    <form  className="mb-3" onSubmit={handleSubmit(onUpdate)} method="POST">
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
            <Button label="Mettre à jour" type="submit" className="bg-green-700 mr-2"/>
            <Button label="Annuler" onClick={() => onReject(false)} className="bg-red-500 hover:bg-red focus:bg-red-500 btn-danger mr-2"/>
          </form>
  </Dialog>
    </>
  )
}

export default create(UpdateFicheModal)