import { useAuthUser } from "react-auth-kit";
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import Decadaire from "./Decadaire"
import { useQuery, useQueryClient } from 'react-query';
import Profile from "./Profile"
import { getAuth } from "../services/authservice";
import { FaUserCircle, FaUsers } from 'react-icons/fa';
import { Button } from "primereact/button";
import { useSignOut } from 'react-auth-kit';
import Ticket from "./ticket";
import { ImProfile } from 'react-icons/im';
import { BsFillCalendar2RangeFill } from 'react-icons/bs';
import { IoTicketOutline } from 'react-icons/io5';
import { GiNotebook } from 'react-icons/gi';
import Fiche from "./Fiche";
import Tableau from "./Tableau";
import { AiFillDashboard } from "react-icons/ai";
import { useState } from "react";
import Users from "./Users";


const Dashboard = () => {

  const qc = useQueryClient();
  const [showSidebar,setShowSidebar] = useState(true);
  const auth = useAuthUser()();
  const navigate = useNavigate();

  const signOut = useSignOut()


  const qk = ['auth',auth?.id]
  const {data} = useQuery(qk, () => getAuth(auth?.id), {
    stateTime: 100_000,
    refetchOnWindowFocus:false,
  })

  const logout = () => {
    if(signOut()) {
      qc.clear();
      navigate("/login", {replace: true})
    }
  }

  return (
    <>
      <div className="layout-wrapper layout-content-navbar">
  <div className="layout-container">
    {showSidebar && <aside  className="menu-vertical bg-menu-theme">
      <div className="app-brand">
      <img src="/logo_crousz.png" alt="logo" style={{width: '200px', height: '200px'}} />
      </div>
      <div className="menu-inner-shadow" />
      <ul className="menu-inner py-1">
        {/* Dashboard */}
        <li className="menu-item">
          <Link to="" className="menu-link">
            <ImProfile className="h-5 w-5 mx-1" />
            <div >Mon Profil</div>
          </Link>
        </li>
        {data?.role === 'admin' && <li className="menu-item">
          <Link to="tableau" className="menu-link">
            <AiFillDashboard className="h-5 w-5 mx-1" />
            <div >Tableau de board</div>
          </Link>
        </li>}
       {data?.role === 'admin'&& <li className="menu-item">
          <Link to="users" className="menu-link">
            <FaUsers className="h-5 w-5 mx-1" />
            <div >Gestion des utilisateurs</div>
          </Link>
        </li>}
        {data?.role === 'admin'&& <li className="menu-item">
          <Link to="decadaire" className="menu-link">
            <BsFillCalendar2RangeFill className="h-5 w-5 mx-1" />
            <div >Gestion des décadaires</div>
          </Link>
        </li>}
        {data?.role === 'admin'&& <li className="menu-item">
          <Link to="ticket" className="menu-link">
            <IoTicketOutline className="h-5 w-5 mx-1" />
            <div >Gestion des tickets</div>
          </Link>
        </li>}
        <li className="menu-item">
          <Link to="fiche" className="menu-link">
            <GiNotebook className="h-5 w-5 mx-1" />
            <div >Gestion des fiches</div>
          </Link>
        </li>
      </ul>
    </aside>}   
    {/* / Menu */}
    {/* Layout container */}
    <div className="layout-page">
      {/* Navbar */}
      <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
        <div onClick={(e) => setShowSidebar(v => !v)} className="navbar-nav align-items-xl-center me-3 cursor-pointer">
          <span className="nav-item nav-link px-0 me-xl-4">
            <i className="bx bx-menu bx-sm" />
          </span>
        </div>
        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            {/* User */}
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <a className="nav-link dropdown-toggle hide-arrow" href="!#" data-bs-toggle="dropdown">
                <div className="avatar avatar-online">
                  <span className="w-px-40 h-auto rounded-circle">
                    <FaUserCircle className="h-10 w-10" />
                     </span>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="!#">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar avatar-online">
                          <span className="w-px-40 h-auto rounded-circle">
                          <FaUserCircle className="h-10 w-10" />
                             </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">{data?.prenom} {data?.nom}</span>
                        <small className="text-muted">{data?.role ==='user' ? 'Utilisateur' : 'Administrateur'}</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="">
                    <i className="bx bx-user me-2" />
                    <span className="align-middle">Mon Profil</span>
                  </Link>
                </li>
               
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <Button icon="bx bx-power-off me-2" label="Se Déconnecter" className="dropdown-item" onClick={logout} />
                </li>
              </ul>
            </li>
            {/*/ User */}
          </ul>
        </div>
      </nav>

      {/* content here */}
    {data  &&  <Routes>
       <Route path="" element={<Profile auth={data} />} />
       { data?.role === 'admin'&& <Route path="decadaire" element={<Decadaire auth={data}/>} />}
       {data?.role === 'admin'&& <Route path="ticket" element={<Ticket auth={data}/>} />}
       <Route path="fiche" element={<Fiche auth={data}/>} />
       {data?.role === 'admin'&& <Route path="tableau" element={<Tableau auth={data}/>} />}
      {data?.role === 'admin'&& <Route path="users" element={<Users auth={data}/>} />}
     </Routes>}
     
      </div>
      </div>
      </div>
      <div>
  <div className="content-backdrop fade" />
  {/* Content wrapper */}
  {/* / Layout page */}
  {/* Overlay */}
  <div className="layout-overlay layout-menu-toggle" />
</div>

    </>
  )
}

export default Dashboard