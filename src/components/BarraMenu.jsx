import React from 'react'
import { NavLink } from 'react-router-dom'

const BarraMenu = () => {
    return (
        <nav className='navbar navbar-expand navbar-dark bg-info cabecera'>
            <div className='container-fluid' fixed='left'>
                <img src='imagenes/surf.png' width='20px'></img>
                <h2 className="navbar-brand " href="#" style={{
                    margin: 0,
                    top: '50%'
                }}> Mareator (zarza ed.)</h2>
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
                        <li className="navbar-item">
                            <NavLink className="nav-link" aria-current='page' to='/mar'>
                                Mar <span className="sr-only"></span>
                            </NavLink>
                        </li>
                        <li className="navbar-item">
                            <NavLink className="nav-link" aria-current='page' to='/playas'>
                                Playas <span className="sr-only"></span>
                            </NavLink>
                        </li>
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