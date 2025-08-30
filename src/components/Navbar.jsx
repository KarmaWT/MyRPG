import { Link } from "react-router-dom"
import { useState } from "react"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleNavbar = () => {
    setIsOpen(!isOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    // Add logica de logout dps
    console.log('Fazendo logout...')
    setIsDropdownOpen(false)
    setIsOpen(false)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link className={styles.navbarBrand} to="/">MyRPG</Link>

        <button 
          className={styles.navbarToggler} 
          type="button" 
          onClick={toggleNavbar}
          aria-label="Toggle navigation"
        >
          <span className={styles.navbarTogglerIcon}></span>
        </button>

        <div className={`${styles.navbarCollapse} ${isOpen ? styles.show : ''}`}>
          <ul className={styles.navbarNav}>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/dashboard" onClick={() => setIsOpen(false)}>Início</Link>
            </li>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/fichas" onClick={() => setIsOpen(false)}>Fichas</Link>
            </li>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/mitologia" onClick={() => setIsOpen(false)}>Mitologia</Link>
            </li>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/sobre" onClick={() => setIsOpen(false)}>Sobre Nós</Link>
            </li>
          </ul>
          <ul className={styles.navbarNavRight}>
            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <button 
                className={styles.dropdownToggle}
                onClick={toggleDropdown}
                type="button"
              >
                Perfil ▼
              </button>
              <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
                <Link 
                  to="/perfil" 
                  className={styles.dropdownItem}
                  onClick={() => {
                    setIsDropdownOpen(false)
                    setIsOpen(false)
                  }}
                >
                  Perfil
                </Link>
                <button 
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                  type="button"
                >
                  Sair
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
