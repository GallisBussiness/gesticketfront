import { useState } from "react";
// import ReactToPrint from 'react-to-print';
// import { Chart } from 'primereact/chart';
import { useMutation, useQuery } from "react-query";
import { Dropdown } from "primereact/dropdown";
import { getDecadairesOuvert } from "../services/decadaireservice";
import { getFicheByDecadaire } from "../services/ticketservice";
// import { format, isBefore, parseISO } from "date-fns";
// import { Button } from 'primereact/button';
// import { AiFillPrinter } from 'react-icons/ai';
import { getUsers } from "../services/userservice";
import { getFiches } from "../services/ficheservice";
import { FaUsers } from 'react-icons/fa';
import { BsBook, BsCalendarRange } from 'react-icons/bs';
import DecadPrint from "./DecadPrint";

const Tableau = ({auth}) => {
    const [currentDecadaire, setCurrentDecadaire] = useState(null);

    const qkd = ['get_decadaires',auth?._id];
    const quk = ['get_users',auth?._id];
    const qfk = ['get_fiches',auth?._id];

    const {data: decadaires } = useQuery(qkd, () => getDecadairesOuvert());
    const {data: fiches } = useQuery(qfk, () => getFiches(auth?.role,auth._id));
    const {data: users } = useQuery(quk, () => getUsers());

    const {mutate} = useMutation((id) => getFicheByDecadaire(id), {

        onSuccess: (_) => {
           console.log(_); 
      }
  }) 

   

    const handleDecadaireChange = (v) => {
        setCurrentDecadaire(v);
        mutate(v._id);
    }


  return (
    <>
    <div className="content-wrapper">
       <div className="container-xxl flex-grow-1 container-p-y">
     <div className="row">
  <div className="col-lg-4 col-md-12 col-4 mb-4">
    <div className="card">
      <div className="card-body">
        <div className="card-title d-flex align-items-start justify-content-between">
          <div className="avatar flex-shrink-0">
           <BsBook className="h-10 w-10 text-amber-500" />
          </div>
        </div>
        <span className="fw-semibold d-block mb-1">Fiches</span>
        <h3 className="card-title mb-2">{fiches?.length }</h3>
      </div>
    </div>
  </div>
  <div className="col-lg-4 col-md-12 col-4 mb-4">
    <div className="card">
      <div className="card-body">
        <div className="card-title d-flex align-items-start justify-content-between">
          <div className="avatar flex-shrink-0">
          <FaUsers className="h-10 w-10 text-blue-700" />
          </div>
        </div>
        <span>Utilisateurs</span>
        <h3 className="card-title text-nowrap mb-1">{users?.length}</h3>
      </div>
    </div>
  </div>
  <div className="col-lg-4 col-md-12 col-4 mb-4">
    <div className="card">
      <div className="card-body">
        <div className="card-title d-flex align-items-start justify-content-between">
          <div className="avatar flex-shrink-0">
         <BsCalendarRange className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <span>Décadaires</span>
        <h3 className="card-title text-nowrap mb-1">{decadaires?.length}</h3>
      </div>
    </div>
  </div>
</div>

        <div className="flex items-center justify-between">
            <div className="mb-3 flex flex-col justify-center w-1/2">
            <label htmlFor="date" className="form-label">Décadaire</label>
                   <Dropdown className="w-full" optionLabel="nom" value={currentDecadaire} options={decadaires} onChange={(e) => handleDecadaireChange(e.value)} placeholder="Selectionnez un décadaire" autoFocus/>
            </div>
            {/* {currentDecadaire &&  <ReactToPrint
        trigger={() => <Button label=" IMPRIMER" icon={<AiFillPrinter className="w-6 h-6" />} className="bg-green-700 mr-2"></Button>}
        content={() => printref.current}
      />} */}
           
        </div>
       <div>
          {currentDecadaire && <div className="card">
                
                <div className="flex items-center justify-center">
                    <h5 className="text-3xl  font-semibold my-2">{currentDecadaire.nom}</h5>
                </div>
                <DecadPrint decad={currentDecadaire} />
            </div>}
       </div>
      
       </div>
    </div>
    </>
  )
}

export default Tableau