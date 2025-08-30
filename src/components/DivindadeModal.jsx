import React, { useEffect, useState } from 'react'
import { getDivindades } from '../services/supabaseClient'
import styles from './DivindadeModal.module.css'

// Mapeamento de ícones e classes por deus
const deusVisuals = {
  Apolo: {
    icon: <i className="fas fa-sun"></i>,
    cardClass: styles.deusCardApolo,
    fotoClass: styles.deusFotoApolo,
    iconClass: styles.deusIconApolo,
    nomeClass: styles.deusNomeApolo,
    historiaClass: styles.deusHistoriaApolo,
  },
  Afrodite: {
    icon: <i className="fas fa-heart"></i>,
    cardClass: styles.deusCardAfrodite,
    fotoClass: styles.deusFotoAfrodite,
    iconClass: styles.deusIconAfrodite,
    nomeClass: styles.deusNomeAfrodite,
    historiaClass: styles.deusHistoriaAfrodite,
  },
  Ares: {
    icon: <i className="fas fa-fire"></i>,
    cardClass: styles.deusCardAres,
    fotoClass: styles.deusFotoAres,
    iconClass: styles.deusIconAres,
    nomeClass: styles.deusNomeAres,
    historiaClass: styles.deusHistoriaAres,
  },
  Zeus: {
    icon: <i className="fas fa-bolt"></i>,
    cardClass: styles.deusCardZeus,
    fotoClass: styles.deusFotoZeus,
    iconClass: styles.deusIconZeus,
    nomeClass: styles.deusNomeZeus,
    historiaClass: styles.deusHistoriaZeus,
  },
  Atena: {
    icon: <i className="fas fa-feather-alt"></i>,
    cardClass: styles.deusCardAtena,
    fotoClass: styles.deusFotoAtena,
    iconClass: styles.deusIconAtena,
    nomeClass: styles.deusNomeAtena,
    historiaClass: styles.deusHistoriaAtena,
  },
  Poseidon: {
    icon: <i className="fas fa-water"></i>,
    cardClass: styles.deusCardPoseidon,
    fotoClass: styles.deusFotoPoseidon,
    iconClass: styles.deusIconPoseidon,
    nomeClass: styles.deusNomePoseidon,
    historiaClass: styles.deusHistoriaPoseidon,
  },
  Hades: {
    icon: <i className="fas fa-skull"></i>,
    cardClass: styles.deusCardHades,
    fotoClass: styles.deusFotoHades,
    iconClass: styles.deusIconHades,
    nomeClass: styles.deusNomeHades,
    historiaClass: styles.deusHistoriaHades,
  },
  Hermes: {
    icon: <i className="fas fa-shoe-prints"></i>,
    cardClass: styles.deusCardHermes,
    fotoClass: styles.deusFotoHermes,
    iconClass: styles.deusIconHermes,
    nomeClass: styles.deusNomeHermes,
    historiaClass: styles.deusHistoriaHermes,
  },
  Dionísio: {
    icon: <i className="fas fa-wine-glass"></i>,
    cardClass: styles.deusCardDionisio,
    fotoClass: styles.deusFotoDionisio,
    iconClass: styles.deusIconDionisio,
    nomeClass: styles.deusNomeDionisio,
    historiaClass: styles.deusHistoriaDionisio,
  },
  Ártemis: {
    icon: <i className="fas fa-bow-arrow"></i>,
    cardClass: styles.deusCardArtemis,
    fotoClass: styles.deusFotoArtemis,
    iconClass: styles.deusIconArtemis,
    nomeClass: styles.deusNomeArtemis,
    historiaClass: styles.deusHistoriaArtemis,
  },
  Héstia: {
    icon: <i className="fas fa-fire-alt"></i>,
    cardClass: styles.deusCardHestia,
    fotoClass: styles.deusFotoHestia,
    iconClass: styles.deusIconHestia,
    nomeClass: styles.deusNomeHestia,
    historiaClass: styles.deusHistoriaHestia,
  },
  Hefesto: {
    icon: <i className="fas fa-hammer"></i>,
    cardClass: styles.deusCardHefesto,
    fotoClass: styles.deusFotoHefesto,
    iconClass: styles.deusIconHefesto,
    nomeClass: styles.deusNomeHefesto,
    historiaClass: styles.deusHistoriaHefesto,
  },
  Perséfone: {
    icon: <i className="fas fa-leaf"></i>,
    cardClass: styles.deusCardPersefone,
    fotoClass: styles.deusFotoPersefone,
    iconClass: styles.deusIconPersefone,
    nomeClass: styles.deusNomePersefone,
    historiaClass: styles.deusHistoriaPersefone,
  },
  Hécate: {
    icon: <i className="fas fa-moon"></i>,
    cardClass: styles.deusCardHecate,
    fotoClass: styles.deusFotoHecate,
    iconClass: styles.deusIconHecate,
    nomeClass: styles.deusNomeHecate,
    historiaClass: styles.deusHistoriaHecate,
  },
  Nyx: {
    icon: <i className="fas fa-star"></i>,
    cardClass: styles.deusCardNyx,
    fotoClass: styles.deusFotoNyx,
    iconClass: styles.deusIconNyx,
    nomeClass: styles.deusNomeNyx,
    historiaClass: styles.deusHistoriaNyx,
  },
  Éris: {
    icon: <i className="fas fa-exclamation"></i>,
    cardClass: styles.deusCardEris,
    fotoClass: styles.deusFotoEris,
    iconClass: styles.deusIconEris,
    nomeClass: styles.deusNomeEris,
    historiaClass: styles.deusHistoriaEris,
  },
  Deméter: {
    icon: <i className="fas fa-seedling"></i>,
    cardClass: styles.deusCardDemeter,
    fotoClass: styles.deusFotoDemeter,
    iconClass: styles.deusIconDemeter,
    nomeClass: styles.deusNomeDemeter,
    historiaClass: styles.deusHistoriaDemeter,
  },
  Hipnos: {
    icon: <i className="fas fa-bed"></i>,
    cardClass: styles.deusCardHipnos,
    fotoClass: styles.deusFotoHipnos,
    iconClass: styles.deusIconHipnos,
    nomeClass: styles.deusNomeHipnos,
    historiaClass: styles.deusHistoriaHipnos,
  },
  Chronos: {
    icon: <i className="fas fa-hourglass-half"></i>,
    cardClass: styles.deusCardChronos,
    fotoClass: styles.deusFotoChronos,
    iconClass: styles.deusIconChronos,
    nomeClass: styles.deusNomeChronos,
    historiaClass: styles.deusHistoriaChronos,
  },
  Caos: {
    icon: <i className="fas fa-atom"></i>,
    cardClass: styles.deusCardCaos,
    fotoClass: styles.deusFotoCaos,
    iconClass: styles.deusIconCaos,
    nomeClass: styles.deusNomeCaos,
    historiaClass: styles.deusHistoriaCaos,
  },
  Hera: {
    icon: <i className="fas fa-gem"></i>,
    cardClass: styles.deusCardHera,
    fotoClass: styles.deusFotoHera,
    iconClass: styles.deusIconHera,
    nomeClass: styles.deusNomeHera,
    historiaClass: styles.deusHistoriaHera,
  },
}

export default function DivindadeModal({ open, onClose, onSelect }) {
  const [deuses, setDeuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      setLoading(true)
      getDivindades()
        .then(data => {
          setDeuses(data || [])
          setLoading(false)
        })
        .catch(() => {
          setError('Erro ao carregar divindades.')
          setLoading(false)
        })
    }
  }, [open])

  if (!open) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <i className="fas fa-gopuram"></i> Selecione uma Divindade
          </h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {loading && <div className={styles.loading}>Carregando...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && !error && (
            <ul className={styles.deusList}>
              {deuses.map(deus => {
                const visual = deusVisuals[deus.nome] || {}
                return (
                  <li key={deus.id} className={styles.deusItem}>
                    <button
                      className={`${styles.deusButton} ${visual.cardClass || ''}`}
                      onClick={() => {
                        onSelect(deus)
                        onClose()
                      }}
                    >
                      <div className={styles.deusInfo}>
                        <img
                          src={deus.foto}
                          alt={deus.nome}
                          className={`${styles.deusFoto} ${visual.fotoClass || ''}`}
                        />
                        <div className={styles.deusText}>
                          <div className={styles.deusNomeRow}>
                            <span className={`${styles.deusIcon} ${visual.iconClass || ''}`}>
                              {visual.icon || <i className="fas fa-gopuram"></i>}
                            </span>
                            <span className={`${styles.deusNome} ${visual.nomeClass || ''}`}>{deus.nome}</span>
                          </div>
                          <span className={`${styles.deusHistoria} ${visual.historiaClass || ''}`}>
                            {(() => {
                              if (!deus.historia) return ''
                              const idx = deus.historia.indexOf('.')
                              return idx !== -1 ? deus.historia.slice(0, idx + 1) : deus.historia
                            })()}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}