import { useState } from 'react'
import styles from './CharacterCard.module.css'

export default function CharacterCard({ character }) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleCardClick = () => {
    console.log(`Visualizar ficha de ${character.name} - funcionalidade futura`)
    
  }

  return (
    <div 
      className={styles.card} 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      <div className={styles.avatarContainer}>
        {!imageError ? (
          <img
            src={character.avatar}
            alt={`Avatar de ${character.name}`}
            className={styles.avatar}
            onError={handleImageError}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {character.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <h3 className={styles.characterName}>{character.name}</h3>
      
      <div className={styles.cardActions}>
        <button 
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation()
            console.log(`Editar ${character.name} - funcionalidade futura`)
          }}
          title="Editar ficha"
        >
          ✏️
        </button>
        <button 
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation()
            console.log(`Deletar ${character.name} - funcionalidade futura`)
          }}
          title="Excluir ficha"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
