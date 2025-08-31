
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Fichas.module.css';
import CardBencao from '../components/CardBencao';

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


  // Exemplo de benção acumulada (níveis 1, 2 e 3)
  const exemploBencaoNiveis = [
    {
      nome: 'Benção de Afrodite – Encanto Absoluto',
      descricao: 'Olhar Cativante: Alvo evita te atacar por 2 rodadas (teste de Vontade), caso ataque, dá metade do dano.',
      nivel: 1,
      bonusAtributo: 'Presença',
      bonusPericia: 'Sedução',
      valorAtributo: 1,
      valorPericia: 5
    },
    {
      nome: 'Benção de Afrodite – Encanto Absoluto',
      descricao: 'Beleza Enfeitiçante: Escolhe um inimigo que durante 3 rodas, só pode atacar você e sofre desvantagem.',
      nivel: 2,
      bonusAtributo: 'Carisma',
      bonusPericia: 'Enganação',
      valorAtributo: 1,
      valorPericia: 10
    },
    {
      nome: 'Benção de Afrodite – Encanto Absoluto',
      descricao: 'Desejo Oculto: Pode prever o desejo ou intenção de alguém em uma conversa. (sem teste).',
      nivel: 3,
      bonusAtributo: 'Presença',
      bonusPericia: 'Sedução',
      valorAtributo: 1,
      valorPericia: 15
    }
  ];
  const exemploDeus = {
    nome: 'Afrodite',
    foto: 'https://ocnddiksouezxzcdwnxy.supabase.co/storage/v1/object/sign/deus-images/Afrodite.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YmVlNjQxMy1kM2EwLTQyNjctYTU0My05NTEwNWFhMTJkODIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkZXVzLWltYWdlcy9BZnJvZGl0ZS5qcGciLCJpYXQiOjE3NTYwODQxMTksImV4cCI6MTc4NzYyMDExOX0.xvas2bYK62-MuDVXVKr6-wqJ6nHHxf0elB30NGNMe18'
  };

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

      {/* CardBenção para visualização acumulada */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Visualização do CardBenção (acumulado)</h2>
        <CardBencao niveis={exemploBencaoNiveis} deus={exemploDeus} />
      </div>
    </div>
  );
}