import styles from './CreateCharacterButton.module.css'

export default function CreateCharacterButton({ onClick, children = "Criar Nova Ficha" }) {
  return (
    <button 
      className={styles.createButton} 
      onClick={onClick}
      type="button"
    >
      <span className={styles.buttonIcon}>✨</span>
      {children}
    </button>
  )
}
