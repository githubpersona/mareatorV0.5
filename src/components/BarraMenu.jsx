import React from 'react'
import { NavLink } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../Contexts/UserContext';
import { useState } from 'react';


const BarraMenu = () => {

   
    const { configuracion_estado } = useContext(UserContext);

    const [configuracion, setConfiguracion] = configuracion_estado;
    
        function restringir(restringir_a) {
            let configuracion_temp = configuracion;
            configuracion_temp.periodo = restringir_a;
                setConfiguracion(configuracion_temp);
            localStorage.setItem(
                "configuracion_local",
                JSON.stringify(configuracion_temp)
            );
        }

    return (
        <nav className='navbar navbar-expand navbar-dark bg-info cabecera'>
            <div className='container-fluid' fixed='left'>
                <img src='imagenes/surf.png' width='20px'></img>
                <h2 className="navbar-brand " href="#" style={{
                    margin: 0,
                    top: '50%'
                }}> Mareator</h2>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarSupportedContent'
                    aria-controls='#navbarSupportedContent'
                    aria-expanded='false'
                    aria-label="Toggle navigation"
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div id='navbarSupportedContent'>
                <ul className='navbar-nav mb-0 py-0'>
                        <li className="navbar-item" onClick={() => restringir(3)}>
                            <NavLink className="nav-link">
                            3d
                            </NavLink>
                        </li>
                        <li className="navbar-item" onClick={() => restringir(7)}>
                        <NavLink className="nav-link">
                            7d
                            </NavLink>
                        </li>
                        <li className="navbar-item">
                        <NavLink className="nav-link">
                        |
                            </NavLink>
                        </li>
                        
                        <li className="navbar-item">
                            <NavLink className="nav-link" aria-current='page' to='/mar'>
                                Mar <span className="sr-only"></span>
                            </NavLink>
                        </li>
                        {/* <li className="navbar-item">
                            <NavLink className="nav-link" aria-current='page' to='/playas'>
                                Playas <span className="sr-only"></span>
                            </NavLink>
                        </li> */}
                        <li className="navbar-item">
                            <NavLink className="nav-link" aria-current='page' to='/el_tiempo'>
                                El tiempo <span className="sr-only"></span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}

export default BarraMenu