import { useState } from "react";
import { Chart } from 'primereact/chart';
import { useMutation, useQuery } from "react-query";
import { Dropdown } from "primereact/dropdown";
import { getDecadaires } from "../services/decadaireservice";
import { getFicheByDecadaire } from "../services/ticketservice";
import { format, parseISO } from "date-fns";

function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

const Tableau = ({auth}) => {
    const [currentDecadaire, setCurrentDecadaire] = useState(null);
 const [basicData,setBasicData] = useState({});

    const qkd = ['get_decadaires',auth?._id]

    const {data: decadaires } = useQuery(qkd, () => getDecadaires());

    const {mutate} = useMutation((id) => getFicheByDecadaire(id), {

        onSuccess: (_) => {
         let  labels = [];
         let datasets = [];
         const grouped = groupBy(_,'date');
         labels = Object.keys(grouped).map(k => format(parseISO(k),'dd/MM/yyyy'));
         const dt = Object.values(grouped)[0];
        datasets = dt.map((d,i) => {
            const somme = d.nombre * d.ticket.valeur;
            return {
                label: d.ticket.nom,
                backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                data: [somme]
            };
        });

        setBasicData({
            labels,
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
       <div className="mb-3 flex flex-col justify-center">
            <label htmlFor="date" className="form-label">Décadaire</label>
                   <Dropdown className="w-full" optionLabel="nom" value={currentDecadaire} options={decadaires} onChange={(e) => handleDecadaireChange(e.value)} placeholder="Selectionnez un décadaire" autoFocus/>
            </div>
       {currentDecadaire && <div className="card">
                <h5>{currentDecadaire.nom}</h5>
                <Chart type="bar" data={basicData} options={basicOptions} />
            </div>}
       </div>
    </div>
    </>
  )
}

export default Tableau