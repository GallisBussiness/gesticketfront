import Api from "./Api";

export const getFiches = (role,id) => Api.get('/fiche/byrole/'+role+'/'+id).then(res => res.data);
export const createFiche = (data) => Api.post('/fiche', data).then(res => res.data);
export const updateFiche = (id, data) => Api.patch('/fiche/'+ id, data ).then(res => res.data);
export const removeFiche = (id) => Api.delete('/fiche/'+ id).then(res => res.data);