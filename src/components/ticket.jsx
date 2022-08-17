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
import { createTicket, getTickets, removeTicket, updateTicket } from '../services/ticketservice'
import createTicketModal from './modals/createTicketModal'
import updateTicketModal from './modals/updateTicketModal'
import './datatable.css'

const Ticket = ({auth}) => {

    const [selectedTickets, setSelectedTickets] = useState(null);
    const qc = useQueryClient()
    const toast = useRef();
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'valeur': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const qk = ['get_tickets',auth?._id]

    const {data: tickets, isLoading } = useQuery(qk, () => getTickets());

    const {mutate: create} = useMutation((data) => createTicket(data), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Creation ticket', detail: 'Création réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Create ticket', detail: 'Creation échouée !!'});
        }
    })

    const {mutate: deleteD} = useMutation((id) => removeTicket(id), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Suppréssion ticket', detail: 'Suppréssion réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Suppréssion ticket', detail: 'Suppréssion échouée !!'});
        }
    })

    const {mutate: update} = useMutation((data) => updateTicket(data._id, data.data), {
        onSuccess: (_) => {
            toast.current.show({severity: 'success', summary: 'Mise à jour ticket', detail: 'Mis à jour réussie !!'});
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Mis à jour ticket', detail: 'Mis à jour échouée !!'});
           }
    })

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Nouveau" className="bg-green-700 mr-2" icon={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateTicket()} />
                <Button label="Supprimer" icon={<MdDelete className="h-6 w-6 text-white"/>} className="p-button-danger" onClick={() => handleDelete()} disabled={!selectedTickets || !selectedTickets.length} />
            </>
        )
    }


    const handleUpdateTicket = (d) => {
        updateTicketModal({ticket: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateTicket = () => {
        createTicketModal().then(create);
    }

    const handleDelete = () => {
        for(let i = 0; i < selectedTickets?.length; i++) {
           deleteD(selectedTickets[i]?._id);
        }
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">Liste des Tickets</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher ..." />
                </span>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <Button type="button" onClick={() => handleUpdateTicket(rowData)} className="bg-gray-500" icon={<BsFillPenFill className="text-white"/>}></Button>
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
                <DataTable value={tickets} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover selection={selectedTickets} onSelectionChange={e => setSelectedTickets(e.value)}
                    filters={filters} filterDisplay="menu" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['nom','valeur']} emptyMessage="Aucun ticket trouvé"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '14rem' }} />
                    
                    <Column field="valeur" header="Valeur" sortable  style={{ minWidth: '8rem' }}/>
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

export default Ticket