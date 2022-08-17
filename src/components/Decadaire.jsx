import { useRef, useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import './datatable.css';
import { getDecadaires,createDecadaire,updateDecadaire, removeDecadaire } from '../services/decadaireservice';
import { BsFillPenFill } from 'react-icons/bs';
import { Toolbar } from 'primereact/toolbar';
import { MdDelete } from 'react-icons/md';
import { AiOutlinePlus } from 'react-icons/ai';
import { format, parseISO } from 'date-fns';
import updateDecadaireModal from './modals/updateDecadaireModal';
import ModalContainer from 'react-modal-promise'
import createDecadaireModal from './modals/createDecadaireModal';
import { Toast } from 'primereact/toast';



const Decadaire = ({auth}) => {
    const [selectedDecadaires, setSelectedDecadaires] = useState(null);
    const toast = useRef();
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'debut': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

   const qc = useQueryClient()
    const qk = ['get_decadaires',auth?._id]

    const {data: decadaires, isLoading } = useQuery(qk, () => getDecadaires());

    const {mutate: create} = useMutation((data) => createDecadaire(data), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Creation décadaire', detail: 'Création réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Create décadaire', detail: 'Creation échouée !!'});
        }
    })

    const {mutate: deleteD} = useMutation((id) => removeDecadaire(id), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Suppréssion décadaire', detail: 'Suppréssion réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Suppréssion décadaire', detail: 'Suppréssion échouée !!'});
        }
    })

    const {mutate: update} = useMutation((data) => updateDecadaire(data._id, data.data), {
        onSuccess: (_) => {
            toast.current.show({severity: 'success', summary: 'Mise à jour décadaire', detail: 'Mis à jour réussie !!'});
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Mis à jour décadaire', detail: 'Mis à jour échouée !!'});
           }
    })


    const formatDate = (value) => {
        return format(parseISO(value),'dd/MM/yyyy');
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">Liste de Décadaire</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher ..." />
                </span>
            </div>
        )
    }



    const debutBodyTemplate = (rowData) => {
        return formatDate(rowData.debut);
    }

    const finBodyTemplate = (rowData) => {
        return formatDate(rowData.fin);
    }

    const etatBodyTemplate = ({etat}) => {
        return <span className={`py-1 px-4 flex items-center justify-center text-white ${etat === 'ouvert' ? 'bg-green-700' : 'bg-red-500'}`}>{etat}</span>;
    }

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Nouveau" className="bg-green-700 mr-2" icon={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateDecadaire()} />
                <Button label="Supprimer" icon={<MdDelete className="h-6 w-6 text-white"/>} className="p-button-danger" onClick={() => handleDelete()}disabled={!selectedDecadaires || !selectedDecadaires.length} />
            </>
        )
    }

    const handleDelete = () => {
        for(let i = 0; i < selectedDecadaires?.length; i++) {
           deleteD(selectedDecadaires[i]?._id);
        }
    }

    const handleUpdateDecadaire = (d) => {
        updateDecadaireModal({decadaire: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateDecadaire = () => {
        createDecadaireModal().then(create);
    }

   

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <Button type="button" onClick={() => handleUpdateDecadaire(rowData)} className="bg-green-700" icon={<BsFillPenFill className="text-white"/>}></Button>
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
                <DataTable value={decadaires} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover selection={selectedDecadaires} onSelectionChange={e => setSelectedDecadaires(e.value)}
                    filters={filters} filterDisplay="menu" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['nom', 'dedut', 'statut']} emptyMessage="Aucun décadaire trouvé"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                    <Column field="nom" header="Nom" sortable filter filterPlaceholder="Rechercher par nom" style={{ minWidth: '14rem' }} />
                    
                    <Column field="debut" header="Debut" sortable body={debutBodyTemplate} style={{ minWidth: '8rem' }}/>
                    <Column field="fin" header="Fin" sortable body={finBodyTemplate} style={{ minWidth: '8rem' }}/>
      
                    <Column field="etat" header="Etat" body={etatBodyTemplate} sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '10rem' }} />
                    <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>
        </div>
        </div>
        <Toast ref={toast} />
        <ModalContainer />
      </>
       
    );
}

export default Decadaire;