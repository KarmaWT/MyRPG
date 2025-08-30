import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Fichas.module.css'

export default function Fichas() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const characters = [
    {
      id: 1,
      name: 'Josivaldo',
      gloria: 120,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
    },
  ]

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input
          type="text"
          placeholder="Buscar personagem..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />
        <button
          className={styles.createButton}
          onClick={() => navigate('/criar-ficha')}
        >
          Criar Ficha
        </button>
      </div>
      <hr className={styles.hr} />
      <div className={styles.cards}>
        {filteredCharacters.map(character => (
          <div key={character.id} className={styles.card}>
            <img src={character.avatar} alt={character.name} className={styles.avatar} />
            <div className={styles.info}>
              <h3 className={styles.name}>{character.name}</h3>
              <p className={styles.gloria}>Glória: {character.gloria}</p>
              <button
                className={styles.viewButton}
                onClick={() => navigate(`/ficha/${character.id}`)}
              >
                Ver Ficha
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}