import Api from './Api'
export const getDecadaires = () => Api.get('/decadaire').then(res => res.data);
export const getDecadairesOuvert = () => Api.get('/decadaire/ouvert').then(res => res.data);
export const createDecadaire = (data) => Api.post('/decadaire', data).then(res => res.data);
export const removeDecadaire = (id) => Api.delete('/decadaire/' + id).then(res => res.data);
export const updateDecadaire = (id,data) => Api.patch('/decadaire/' + id, data ).then(res => res.data);