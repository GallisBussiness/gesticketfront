import { FilterMatchMode, FilterOperator } from "primereact/api"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { useRef, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import { useMutation, useQuery, useQueryClient } from "react-query"
import ModalContainer from 'react-modal-promise'
import { createFiche, getFiches, removeFiche, updateFiche } from "../services/ficheservice"
import { InputText } from "primereact/inputtext"
import { BsFillPenFill } from "react-icons/bs"
import updateFicheModal from "./modals/updateFicheModal"
import createFicheModal from "./modals/createFicheModal"
import './datatable.css';
import { format, parseISO } from "date-fns"

const Fiche = ({auth}) => {

    const [selectedFiches, setSelectedFiches] = useState(null);
    const qc = useQueryClient()
    const toast = useRef();
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const qk = ['get_fiches',auth?._id]

    const {data: fiches, isLoading } = useQuery(qk, () => getFiches(auth.role,auth._id));

    const {mutate: create} = useMutation((data) => createFiche(data), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Creation Fiche', detail: 'Création réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Create Fiche', detail: 'Creation échouée !!'});
        }
    })

    const {mutate: deleteD} = useMutation((id) => removeFiche(id), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Suppréssion Fiche', detail: 'Suppréssion réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Suppréssion Fiche', detail: 'Suppréssion échouée !!'});
        }
    })

    const {mutate: update} = useMutation((data) => updateFiche(data._id, data.data), {
        onSuccess: (_) => {
            toast.current.show({severity: 'success', summary: 'Mise à jour Fiche', detail: 'Mis à jour réussie !!'});
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Mis à jour Fiche', detail: 'Mis à jour échouée !!'});
           }
    })

    const formatDate = (value) => {
        return format(parseISO(value),'dd/MM/yyyy');
    }

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    }

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Nouveau" className="bg-green-700 mr-2" icon={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateFiche()} />
                <Button label="Supprimer" icon={<MdDelete className="h-6 w-6 text-white"/>} className="p-button-danger" onClick={() => handleDelete()} disabled={!selectedFiches || !selectedFiches.length} />
            </>
        )
    }


    const handleUpdateFiche = (d) => {
        updateFicheModal({fiche: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateFiche = () => {
        createFicheModal({auth}).then(create);
    }

    const handleDelete = () => {
        for(let i = 0; i < selectedFiches?.length; i++) {
           deleteD(selectedFiches[i]?._id);
        }
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">Liste des Fiches</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher ..." />
                </span>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <Button type="button" onClick={() => handleUpdateFiche(rowData)} className="bg-gray-500" icon={<BsFillPenFill className="text-white"/>}></Button>
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
                <DataTable value={fiches} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover selection={selectedFiches} onSelectionChange={e => setSelectedFiches(e.value)}
                    filters={filters} filterDisplay="menu" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['nom', 'dedut', 'statut']} emptyMessage="Aucun Fiche trouvé"
                    currentPageReportTemplate="Voir {first} de {last} à {totalRecords} fiches">
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                    <Column field="date" header="Date" body={dateBodyTemplate} sortable filter filterPlaceholder="Rechercher par nom" style={{ minWidth: '14rem' }} />
                    <Column field="nombre" header="Nombre" sortable  style={{ minWidth: '8rem' }}/>
                    <Column field="decadaire.nom" header="Décadaire" sortable  style={{ minWidth: '8rem' }}/>
                    <Column field="ticket.nom" header="Ticket" sortable  style={{ minWidth: '8rem' }}/>
                    <Column field="user.email" header="User" sortable  style={{ minWidth: '8rem' }}/>
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

export default Fiche