import { Divider, Text } from '@mantine/core'
import { addDays, format, getDate, parseISO } from 'date-fns'
import React from 'react'

function DecadPrint({decad, fiches}) {
  const {cles,dic} = fiches;
  console.log(dic)
    const number = decad?.nom.split("-")[1];
    const daysArr = [];
    for(let i = 0;i<= 10; i++) {
      const d = addDays(parseISO(decad?.debut),i);
      daysArr.push(getDate(d));
    }
  return (
    <div className="bg-white m-4">
     <div className="flex items-center justify-between py-2 mx-10 bg-white">
       <div className="flex flex-col items-center space-y-1">
        <div className="flex flex-col items-center">
            <Text fw="bold" size={12}>REPUBLIQUE DU SENEGAL</Text>
            <Text fw="bold" size={10}>un peuple - un But - Une Foi</Text>
            <Text size={8}>------------------</Text>
            <img src="/drapeau.png" alt="logo" className="h-16 w-16 object-cover"/>
        </div>
        <div className="flex flex-col items-center text-center">
            <Text size={12} fw="bold">MINISTERE DE L'ENSEIGNEMENT SUPPERIEUR DE LA RECHERCHE ET DE L'INNOVATION</Text>
            <Text size={8}>------------------</Text>
        </div>
        <div className="flex flex-col items-center text-center">
            <Text size={12} fw="bold">CENTRE REGIONAL DES OEUVRE UNIVERSITAIRES SOCIALES DE ZIGUINCHOR</Text>
                        <img src="/logo_crousz.png" alt="logo" className="h-16 w-16 object-cover"/>
            <Text size={12}  fw="bold">DIVISION DES RESTAURANTS UNIVERSITAIRES</Text>
        </div>
       </div>
       <div className="flex flex-col space-y-1">
       <div className="flex flex-col items-center text-center">
            <Text size={12} fw="bold">N° {number} /MESRI/CROUSZ/DIR/CSA/DRU/o.g.</Text>
            <Text size={10} fw="bold">Ziguinchor, le {format(new Date(),"dd/MM/yyyy")}</Text>
        </div>
       </div>
    </div>
    <div className="my-5">
         <Divider/>
    <div className="flex items-center justify-center py-2 bg-green-500">
    <Text size={20} fw="bold" className="font-roboto text-white uppercase">ETAT DECADAIRE</Text>
    </div>
    <Divider/>
    </div>
    <div>
    <Text size={12} fw='bold' className="text-lg">Periode du {format(parseISO(decad?.debut),"dd//MM//yyyy")} au {format(parseISO(decad?.fin),"dd//MM//yyyy")}</Text>
    </div>
 
    <table className="w-full border-1 table-auto">
      <tbody>
        <tr>
          <td rowSpan={2} className="border-1 text-center py-2 font-bold">REPAS</td>
          <td colSpan={11} className="border-1 text-center px-3 py-2 font-bold">DATES</td>
          <td className="border-1 text-center px-3 py-2 font-bold">NBR TICKETS</td>
          <td className="border-1 text-center px-3 py-2 font-bold">PU</td>
          <td className="border-1 text-center px-3 py-2 font-bold">MONTANT TTC</td>
        </tr>
        <tr>
          {daysArr.map((el) => (
              <td key={el} className="border-1 text-center">{el}</td>
          ))}
          <td className="border-1 text-center">12i</td>
          <td className="border-1 text-center">13i</td>
          <td className="border-1 text-center">13i</td>
        </tr>
        {cles?.map(c => (
          <tr key={c}>
            <td>{c}</td>
            {dic[c].map(d => (
              <td key={d.day} className="border-1 text-center py-2 font-bold">{d.valeur}</td>
            ))}
          </tr>
        ))}
        {/* <tr>
          
          
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>DEJEUNER</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>DINER</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr> */}
        <tr>
          <td colSpan={12} className="border-1 text-center px-3 font-bold">TOTAL</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>

    </div>
  )
}

export default DecadPrint