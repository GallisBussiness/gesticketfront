import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ModalContainer from 'react-modal-promise'
import { InputText } from 'primereact/inputtext'
import { BsFillPenFill } from 'react-icons/bs'
import createUserModal from './modals/createUserModal'
import updateUserModal from './modals/updateUserModal'
import './datatable.css'
import { createUser, getUsers, removeUser, updateUser } from '../services/userservice'

const Users = ({auth}) => {

  const [selectedUsers, setSelectedUsers] = useState(null);
    const qc = useQueryClient()
    const toast = useRef();
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const qk = ['get_users',auth?._id]

    const {data: users, isLoading } = useQuery(qk, () => getUsers());

    const {mutate: create} = useMutation((data) => createUser(data), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Creation User', detail: 'Création réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Create User', detail: 'Creation échouée !!'});
        }
    })

    const {mutate: deleteD} = useMutation((id) => removeUser(id), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Suppréssion User', detail: 'Suppréssion réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Suppréssion User', detail: 'Suppréssion échouée !!'});
        }
    })

    const {mutate: update} = useMutation((data) => updateUser(data._id, data.data), {
        onSuccess: (_) => {
            toast.current.show({severity: 'success', summary: 'Mise à jour User', detail: 'Mis à jour réussie !!'});
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Mis à jour User', detail: 'Mis à jour échouée !!'});
           }
    })

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Nouveau" className="bg-green-700 mr-2" icon={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateUser()} />
                <Button label="Supprimer" icon={<MdDelete className="h-6 w-6 text-white"/>} className="p-button-danger" onClick={() => handleDelete()} disabled={!selectedUsers || !selectedUsers.length} />
            </>
        )
    }


    const handleUpdateUser = (d) => {
        updateUserModal({user: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateUser = () => {
        createUserModal().then(create);
    }

    const handleDelete = () => {
        for(let i = 0; i < selectedUsers?.length; i++) {
           deleteD(selectedUsers[i]?._id);
        }
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">Liste des Utilisateurs</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher ..." />
                </span>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <Button type="button" onClick={() => handleUpdateUser(rowData)} className="bg-gray-500" icon={<BsFillPenFill className="text-white"/>}></Button>
        </div>;
        
    }

    const header = renderHeader();

  return (
    <>
    <div className="content-wrapper">
       <div className="container-xxl flex-grow-1 container-p-y">
       <div className="datatable-doc">
            <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable value={users} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover selection={selectedUsers} onSelectionChange={e => setSelectedUsers(e.value)}
                    filters={filters} filterDisplay="menu" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['nom', 'prenom']} emptyMessage="Aucun Utilisateur trouvé"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                    <Column field="prenom" header="Prenom" sortable style={{ minWidth: '14rem' }} />
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '14rem' }} />
                    
                    <Column field="email" header="Email" sortable  style={{ minWidth: '8rem' }}/>
                    <Column field="role" header="Role" sortable  style={{ minWidth: '8rem' }}/>
                    <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>
       </div>
   </div>
   <Toast ref={toast} />
    <ModalContainer />
    </>
  )
}

export default Users