import React, { useState } from 'react';
import styles from './BencaoCarrossel.module.css';

/**
 * Carrossel de bênçãos atribuídas ao personagem
 * Props:
 *  - bencaos: array de objetos [{ niveis, deus }]
 *  - onAdd: função chamada ao clicar no botão [+]
 */
import CardBencao from './CardBencao';

function BencaoCarrossel({ bencaos = [], onAdd, onNivelChange, onRemove }) {
    const [index, setIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState('');
    const total = bencaos.length;

    const handlePrev = () => {
        if (total === 0) return;
        setDirection('left');
        setAnimating(true);
        setTimeout(() => {
            setIndex(prev => (prev === 0 ? total - 1 : prev - 1));
            setAnimating(false);
        }, 400);
    };
    const handleNext = () => {
        if (total === 0) return;
        setDirection('right');
        setAnimating(true);
        setTimeout(() => {
            setIndex(prev => (prev === total - 1 ? 0 : prev + 1));
            setAnimating(false);
        }, 400);
    };

    return (
        <div className={styles.carrosselWrapper}>
            <div className={styles.carrosselHeader} style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ marginRight: 12 }}>
                        Bênçãos
                    </h3>
                </div>

                <div className={styles.carrosselNavGroup}>
                    <button onClick={handlePrev} className={styles.navBtn} aria-label="Anterior" disabled={total === 0}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </span>
                    </button>
                    {total > 0 && (
                        <span className={styles.carrosselIndex} style={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}>{index + 1} / {total}</span>
                    )}
                    <button onClick={handleNext} className={styles.navBtn} aria-label="Próxima" disabled={total === 0}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <i className="fa-solid fa-arrow-right"></i>
                        </span>
                    </button>
                </div>

                <div>
                    <button className={styles.addBtn} onClick={onAdd} title="Adicionar benção" style={{ marginLeft: 12 }}>
                        <span style={{ fontSize: '1.5rem', lineHeight: 0 }}>✚</span>
                    </button>
                </div>
            </div>
            <div className={styles.cardsContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                {total > 0 && bencaos[index] ? (
                    <div
                        className={styles.cardItem + ' ' + (animating ? (direction === 'left' ? styles.slideOutLeft : styles.slideOutRight) : styles.slideIn)}
                        style={{
                            opacity: animating ? 0 : 1,
                            transform: animating
                                ? direction === 'left'
                                    ? 'translateX(-60px) scale(0.96)'
                                    : 'translateX(60px) scale(0.96)'
                                : 'translateX(0) scale(1)',
                            transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)'
                        }}
                    >
                        <CardBencao
                            niveis={bencaos[index].niveis}
                            deus={bencaos[index].deus}
                            nivelSelecionado={bencaos[index].nivelSelecionado}
                            onNivelChange={nivel => onNivelChange && onNivelChange(index, nivel)}
                            onRemove={bencaos[index].automatica ? undefined : (() => {
                                onRemove && onRemove(index);
                                setTimeout(() => {
                                    setIndex(prevIdx => {
                                        const novoTotal = bencaos.length - 1;
                                        if (novoTotal <= 0) return 0;
                                        if (prevIdx >= novoTotal) return novoTotal - 1;
                                        return prevIdx;
                                    });
                                }, 0);
                            })}
                        />
                    </div>
                ) : (
                    <div className={styles.emptyMsg}>Nenhuma benção atribuída ainda.</div>
                )}
            </div>
        </div>
    );
}

export default BencaoCarrossel;

