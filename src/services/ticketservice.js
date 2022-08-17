import Api from "./Api";

export const getTickets = () => Api.get('/ticket').then(res => res.data );
export const createTicket = (data) => Api.post('/ticket', data).then(res => res.data);
export const updateTicket = (id,data) => Api.patch('/ticket/'+ id, data).then(res => res.data);
export const removeTicket = (id) => Api.delete('/ticket/'+ id).then(res => res.data);
export const getFicheByDecadaire = (id) => Api.get('/fiche/findfichebydecadaire/'+ id).then(res => res.data);