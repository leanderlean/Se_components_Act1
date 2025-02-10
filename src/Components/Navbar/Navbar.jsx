import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search from '../../assets/search.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="Logo" className='logo'/>

      <ul>
        <li><Link to="/" className='link'>Home</Link></li>
        <li><Link to="/projects" className='link'>Projects</Link></li>
        <li><Link to="/about" className='link'>About</Link></li>
        <li><Link to="/contact" className='link'>Contact</Link></li>
      </ul>

      <div className='search-box'>
        <input type="text" placeholder='Search'/>
        <img src={search} alt="Search"/>
      </div>
    </div>
  )
}

export default Navbar
