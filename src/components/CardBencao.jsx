import React from 'react';
import styles from './CardBencao.module.css';

/**
 * CardBenção - Exibe informações de uma benção
 * Props:
 *  - nome: string
 *  - descricao: string
 *  - nivel: number
 *  - bonusAtributo: string
 *  - bonusPericia: string
 *  - valorAtributo: number
 *  - valorPericia: number
 *  - deus: { nome: string, foto: string }
 *  - onRemove?: () => void
 */

/**
 * CardBenção - Exibe informações acumuladas de uma benção por níveis
 * Props:
 *  - niveis: array de objetos [{ nome, descricao, nivel, bonusAtributo, bonusPericia, valorAtributo, valorPericia }]
 *  - deus: { nome: string, foto: string }
 *  - onRemove?: () => void
 */

function CardBencao({ niveis, deus, onRemove, nivelSelecionado, onNivelChange }) {
  let niveisArray = [];
  if (Array.isArray(niveis)) {
    niveisArray = niveis;
  } else if (niveis && typeof niveis === 'object') {
    niveisArray = [niveis];
  } else {
    niveisArray = [];
  }
  if (niveisArray.length === 0) {
    return null;
  }
  const niveisOrdenados = [...niveisArray].sort((a, b) => a.nivel - b.nivel);
  // Filtra os níveis até o selecionado (acumulado)
  const nivelAtual = nivelSelecionado || 1;
  const niveisExibir = niveisOrdenados.filter(n => n.nivel <= nivelAtual);
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={deus.foto} alt={deus.nome} className={styles.deusImg} />
        <div>
          <h3>{niveisExibir[niveisExibir.length - 1].nome}</h3>
          <span className={styles.nivel}>
            Nível
            <select
              value={nivelAtual}
              onChange={e => onNivelChange && onNivelChange(Number(e.target.value))}
              style={{ marginLeft: 8, padding: '2px 6px', borderRadius: 6, border: '1px solid #149ea3', background: '#21213e', color: '#a7ffeb', fontWeight: 'bold' }}
            >
              {niveisOrdenados.map(n => (
                <option key={n.nivel} value={n.nivel}> {n.nivel} </option>
              ))}
            </select>
          </span>
        </div>
      </div>
      {onRemove && (
        <button
          className={styles.removeBtn}
          onClick={onRemove}
          title="Remover bênção"
          style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', padding: 0 }}
        >
          <span aria-label="Remover" style={{ pointerEvents: 'none' }}>✖</span>
        </button>
      )}
      {niveisExibir.map(n => (
        <div key={n.nivel} style={{ marginBottom: '1rem', borderLeft: '3px solid var(--color-ciano-escuro)', paddingLeft: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span className={styles.nivel} style={{ fontWeight: 'bold', color: 'var(--color-roxo-claro)' }}>Nível {n.nivel}</span>
          </div>
          <p className={styles.descricao}>{n.descricao}</p>
          <div className={styles.bonusSection}>
            <div>
              <strong>Atributo:</strong> {n.bonusAtributo} (+{n.valorAtributo})
            </div>
            <div>
              <strong>Perícia:</strong> {n.bonusPericia} (+{n.valorPericia})
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardBencao;
