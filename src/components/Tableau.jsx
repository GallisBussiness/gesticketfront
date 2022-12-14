import { useState, useRef } from "react";
import ReactToPrint from 'react-to-print';
import { Chart } from 'primereact/chart';
import { useMutation, useQuery } from "react-query";
import { Dropdown } from "primereact/dropdown";
import { getDecadairesOuvert } from "../services/decadaireservice";
import { getFicheByDecadaire } from "../services/ticketservice";
import { format, isBefore, parseISO } from "date-fns";
import { Button } from 'primereact/button';
import { AiFillPrinter } from 'react-icons/ai';
import { getUsers } from "../services/userservice";
import { getFiches } from "../services/ficheservice";
import { FaUsers } from 'react-icons/fa';
import { BsBook, BsCalendarRange } from 'react-icons/bs';

// function groupBy(objectArray, property) {
//     return objectArray.reduce(function (acc, obj) {
//       var key = obj[property];
//       if (!acc[key]) {
//         acc[key] = [];
//       }
//       acc[key].push(obj);
//       return acc;
//     }, {});
//   }

const Tableau = ({auth}) => {
    const [currentDecadaire, setCurrentDecadaire] = useState(null);
 const [basicData,setBasicData] = useState({});
 const [ln,setLn] = useState([]);
 const [tds,setTds] = useState([]);
 const printref = useRef();

    const qkd = ['get_decadaires',auth?._id];
    const quk = ['get_users',auth?._id];
    const qfk = ['get_fiches',auth?._id];

    const {data: decadaires } = useQuery(qkd, () => getDecadairesOuvert());
    const {data: fiches } = useQuery(qfk, () => getFiches(auth?.role,auth._id));
    const {data: users } = useQuery(quk, () => getUsers());

    const {mutate} = useMutation((id) => getFicheByDecadaire(id), {

        onSuccess: (_) => {
           console.log(_);
            const labels = Array.from(new Set(_.map(f => f.date))).sort((a,b) => isBefore(parseISO(a),parseISO(b)) ? -1 : isBefore(parseISO(b),parseISO(a)) ? 1 : 0);
            const labelnames = labels.map(l => format(parseISO(l),'dd/MM/yyyy'));
           
            const tiketnames = Array.from(new Set(_.map(f => f.ticket.nom)));
            setLn(tiketnames);
            
            const datasets = tiketnames.map(t => {
                let somme = [];
                labels.forEach(l => {
                    const fichebydate = _.filter(f => f.date === l);
                    const s = fichebydate.map(f => f.ticket.nom === t ? f.nombre * f.ticket.valeur : 0).reduce((acc,cur) => acc + cur,0)
                    somme =  somme.concat(s);
                } )
                return {
                    label:t,
                    backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                    data:somme
                }
            });
            const td = labelnames.map((l,i) => {
                return datasets.reduce((acc,dts) => ({...acc,date: l,[dts.label.toLowerCase()]: dts.data[i]}),{})
            });
            setTds(td);
        //  let  labels = [];
        //  let datasets = [];
        //  const grouped = groupBy(_,'date');
        //  labels = Object.keys(grouped).map(k => format(parseISO(k),'dd/MM/yyyy'));
        //  const dt = Object.values(grouped);
        // datasets = dt.map((d,i) => {
        //     const somme = dt[i][0].nombre * dt[i][0].ticket.valeur;
        //     return {
        //         label:dt[i][0].ticket.nom ,
        //         
        //         data: [somme]
        //     };
        // });

        setBasicData({
            labels:labelnames,
            datasets
        })
        },
    })

   

    const  basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: .8,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };

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
        <span>D??cadaires</span>
        <h3 className="card-title text-nowrap mb-1">{decadaires?.length}</h3>
      </div>
    </div>
  </div>
</div>

        <div className="flex items-center justify-between">
            <div className="mb-3 flex flex-col justify-center w-1/2">
            <label htmlFor="date" className="form-label">D??cadaire</label>
                   <Dropdown className="w-full" optionLabel="nom" value={currentDecadaire} options={decadaires} onChange={(e) => handleDecadaireChange(e.value)} placeholder="Selectionnez un d??cadaire" autoFocus/>
            </div>
            {currentDecadaire &&  <ReactToPrint
        trigger={() => <Button label=" IMPRIMER" icon={<AiFillPrinter className="w-6 h-6" />} className="bg-green-700 mr-2"></Button>}
        content={() => printref.current}
      />}
           
        </div>
       <div ref={printref}>
          {currentDecadaire && <div className="card">
                
                <div className="flex items-center justify-center">
                    <h5 className="text-3xl  font-semibold my-2">{currentDecadaire.nom}</h5>
                </div>
                <div className="my-5 flex flex-col justify-center space-x-1">
                    <Chart type="bar" data={basicData} options={basicOptions} />
                    <Chart type="line" data={basicData} options={basicOptions} />
                </div>

                        <div className="card">
            <h5 className="card-header">Somme des tickets par Jours</h5>
            <div className="card-body">
                <div className="table-responsive text-nowrap">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Date</th>
                        {ln.map((l,i) => (
                            <th key={i}>{l}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                       {tds.map((td,i) => (
                        <tr key={i}>
                            <td>{td.date}</td>
                            {ln.map((l,i) => (
                              <td key={i}>{td[l.toLowerCase()]}</td>
                            ))}
                        </tr>
                       ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>

                
            </div>}
       </div>
      
       </div>
    </div>
    </>
  )
}

export default Tableau