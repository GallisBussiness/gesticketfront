import { Divider, Text } from '@mantine/core'
import { format, parseISO } from 'date-fns'
import React from 'react'

function DecadPrint({decad}) {
    const number = decad?.nom.split("-")[1];
  return (
    <div className="bg-white m-4">
     <div className="flex items-center justify-between py-2 mx-10 bg-white">
       <div className="flex flex-col items-center space-y-1">
        <div className="flex flex-col items-center">
            <Text fw="bol" size={12}>REPUBLIQUE DU SENEGAL</Text>
            <Text fw="bold" size={10}>un peuple - un But - Une Foi</Text>
            <Text size={8}>------------------</Text>
            <img src="/drapeau.png" alt="logo" className="h-16 w-16 object-cover"/>
        </div>
        <div className="flex flex-col items-center text-center">
            <Text size={12}>MINISTERE DE L'ENSEIGNEMENT SUPPERIEUR DE LA RECHERCHE ET DE L'INNOVATION</Text>
            <Text size={8}>------------------</Text>
        </div>
        <div className="flex flex-col items-center text-center">
            <Text size={12}>CENTRE REGIONAL DES OEUVRE UNIVERSITAIRES SOCIALES DE ZIGUINCHOR</Text>
                        <img src="/logo_crousz.png" alt="logo" className="h-16 w-16 object-cover"/>
            <Text size={12} >DIVISION DES RESTAURANTS UNIVERSITAIRES</Text>
        </div>
       </div>
       <div className="flex flex-col space-y-1">
       <div className="flex flex-col items-center text-center">
            <Text size={12}>N° {number} /MESRI/CROUSZ/DIR/CSA/DRU/o.g.</Text>
            <Text size={10}>Ziguinchor, le {format(new Date(),"dd/MM/yyyy")}</Text>
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
    </div>
  )
}

export default DecadPrint