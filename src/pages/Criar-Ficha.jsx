import React, { useState } from 'react'
import { salvarPersonagemCompleto, supabase } from '../services/supabaseClient'
import styles from './Criar-Ficha.module.css'

import DivindadeModal from '../components/DivindadeModal';
import BencaoCarrossel from '../components/BencaoCarrossel';
import CardBencao from '../components/CardBencao';
import { getBencaos } from '../services/supabaseClient';

export default function CriarFicha() {
  // Dados das perícias do banco agrupadas por atributo base
  const periciasBanco = [
    { nome: 'Desarme', atributo_base: 'forca' },
    { nome: 'Luta Corpo a Corpo', atributo_base: 'forca' },
    { nome: 'Arremesso', atributo_base: 'forca' },
    { nome: 'Imobilizacao', atributo_base: 'forca' },
    { nome: 'Potência', atributo_base: 'forca' },
    { nome: 'Maestria com Armas', atributo_base: 'forca' },
    // AGILIDADE
    { nome: 'Pontaria', atributo_base: 'agilidade' },
    { nome: 'Pilotagem', atributo_base: 'agilidade' },
    { nome: 'Culinária', atributo_base: 'agilidade' },
    { nome: 'Furtividade', atributo_base: 'agilidade' },
    { nome: 'Parkour', atributo_base: 'agilidade' },
    { nome: 'Crime', atributo_base: 'agilidade' },
    { nome: 'Acrobacia', atributo_base: 'agilidade' },
    { nome: 'Armas de Fogo', atributo_base: 'agilidade' },
    { nome: 'Reflexo', atributo_base: 'agilidade' },
    // VIGOR
    { nome: 'Resistência a Dano', atributo_base: 'vigor' },
    { nome: 'Fortitude', atributo_base: 'vigor' },
    { nome: 'Tolerância', atributo_base: 'vigor' },
    { nome: 'Recuperação', atributo_base: 'vigor' },
    // INTELIGENCIA
    { nome: 'Mecânica', atributo_base: 'inteligencia' },
    { nome: 'Herborismo', atributo_base: 'inteligencia' },
    { nome: 'Investigação', atributo_base: 'inteligencia' },
    { nome: 'Sobrevivência', atributo_base: 'inteligencia' },
    { nome: 'Magia', atributo_base: 'inteligencia' },
    { nome: 'Atualidades', atributo_base: 'inteligencia' },
    { nome: 'Medicina', atributo_base: 'inteligencia' },
    { nome: 'Ciência', atributo_base: 'inteligencia' },
    { nome: 'Tática', atributo_base: 'inteligencia' },
    { nome: 'Agnição', atributo_base: 'inteligencia' },
    { nome: 'Tecnologia', atributo_base: 'inteligencia' },
    // PRESENCA
    { nome: 'Carisma', atributo_base: 'presenca' },
    { nome: 'Religião', atributo_base: 'presenca' },
    { nome: 'Psicologia', atributo_base: 'presenca' },
    { nome: 'Enganação', atributo_base: 'presenca' },
    { nome: 'Percepção', atributo_base: 'presenca' },
    { nome: 'Adestramento', atributo_base: 'presenca' },
    { nome: 'Sedução', atributo_base: 'presenca' },
    { nome: 'Diplomacia', atributo_base: 'presenca' },
    { nome: 'Intimidação', atributo_base: 'presenca' },
    // SORTE
    { nome: 'Intuição', atributo_base: 'sorte' },
  ];
  const atributosPericia = [
    { key: 'forca', nome: 'Força', icon: 'fas fa-fist-raised' },
    { key: 'agilidade', nome: 'Agilidade', icon: 'fas fa-running' },
    { key: 'vigor', nome: 'Vigor', icon: 'fas fa-heart' },
    { key: 'inteligencia', nome: 'Inteligência', icon: 'fas fa-brain' },
    { key: 'presenca', nome: 'Presença', icon: 'fas fa-star' },
    { key: 'sorte', nome: 'Sorte', icon: 'fas fa-clover' },
  ];
  const [foto, setFoto] = useState(null)
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [gloria, setGloria] = useState('')
  const [nivel, setNivel] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Obtenha o userId do usuário autenticado
  const [userId, setUserId] = useState(null)

  React.useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) setUserId(data.user.id)
    }
    fetchUser()
  }, [])

  const [origemDivina, setOrigemDivina] = useState('Humano')
  const [progenitorPai, setProgenitorPai] = useState(false)
  const [progenitorMae, setProgenitorMae] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipo, setModalTipo] = useState(null)
  // Cada bênção tem: niveis, deus, nivelSelecionado
  const [bencaos, setBencaos] = useState([]);
  const [divindadePai, setDivindadePai] = useState(null)
  const [divindadeMae, setDivindadeMae] = useState(null)

  const [atributos, setAtributos] = useState({
    forca: 1,
    agilidade: 1,
    vigor: 1,
    inteligencia: 1,
    presenca: 1,
    sorte: 1,
  })

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setFoto(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Lógica dos botões de progenitor
  const isHumano = origemDivina === 'Humano'
  const isSemideus = origemDivina === 'Semideus'
  const isHibrido = origemDivina === 'Híbrido'
  const isDeusMenor = origemDivina === 'Deus Menor'

  // Para Semideus e Híbrido, só pode um progenitor
  const paiDisabled =
    isHumano ||
    ((isSemideus || isHibrido) && progenitorMae)
  const maeDisabled =
    isHumano ||
    ((isSemideus || isHibrido) && progenitorPai)

  const handleOrigemClick = (tipo) => {
  setOrigemDivina(tipo)
  // Reset progenitores ao trocar de raça
  setProgenitorPai(false)
  setProgenitorMae(false)
  setDivindadePai(null)
  setDivindadeMae(null)
  // Remove todas bênçãos automáticas ao trocar de raça
  setBencaos(prev => prev.filter(b => !b.automatica));
  }

  const handleProgenitorPai = () => {
    if (!paiDisabled) {
      setModalTipo('pai')
      setModalOpen(true)
    }
  }
  const handleProgenitorMae = () => {
    if (!maeDisabled) {
      setModalTipo('mae')
      setModalOpen(true)
    }
  }

  const handleSelectDivindade = (deus) => {
    if (modalTipo === 'pai') {
      setProgenitorPai(true)
      setDivindadePai(deus)
      // Para Deus Menor, não remove bênçãos automáticas do outro progenitor
      setBencaos(prev => {
        if (isDeusMenor) {
          // Remove apenas bênçãos automáticas do mesmo deus
          return prev.filter(b => !(b.automatica && b.deus.nome === deus.nome));
        } else {
          // Remove todas automáticas exceto do novo deus
          return prev.filter(b => !b.automatica);
        }
      });
      // Adiciona bênção automática do novo pai
      getBencaos().then(bencaosDb => {
        const bencaosDoDeus = bencaosDb.filter(b => b.deus_id === deus.id);
        if (bencaosDoDeus.length === 0) return;
        const agrupadas = {};
        bencaosDoDeus.forEach(b => {
          if (!agrupadas[b.nome]) agrupadas[b.nome] = [];
          agrupadas[b.nome].push(b);
        });
        Object.values(agrupadas).forEach(niveisArr => {
          const niveisOrdenados = niveisArr.sort((a, b) => a.nivel - b.nivel);
          setBencaos(prev => {
            // Evita duplicidade
            const jaTem = prev.some(b => b.deus.nome === deus.nome && b.automatica);
            if (jaTem) return prev;
            return [
              ...prev,
              {
                niveis: niveisOrdenados.map(b => ({
                  nome: b.nome,
                  descricao: b.descricao,
                  nivel: b.nivel,
                  bonusAtributo: b.bonus_atributo,
                  bonusPericia: b.bonus_pericia,
                  valorAtributo: b.valor_atributo,
                  valorPericia: b.valor_pericia
                })),
                deus: {
                  nome: deus.nome,
                  foto: deus.foto
                },
                nivelSelecionado: 1,
                automatica: true
              }
            ];
          });
        });
      });
    }
    if (modalTipo === 'mae') {
      setProgenitorMae(true)
      setDivindadeMae(deus)
      // Para Deus Menor, não remove bênçãos automáticas do outro progenitor
      setBencaos(prev => {
        if (isDeusMenor) {
          // Remove apenas bênçãos automáticas do mesmo deus
          return prev.filter(b => !(b.automatica && b.deus.nome === deus.nome));
        } else {
          // Remove todas automáticas exceto do novo deus
          return prev.filter(b => !b.automatica);
        }
      });
      // Adiciona bênção automática da nova mãe
      getBencaos().then(bencaosDb => {
        const bencaosDoDeus = bencaosDb.filter(b => b.deus_id === deus.id);
        if (bencaosDoDeus.length === 0) return;
        const agrupadas = {};
        bencaosDoDeus.forEach(b => {
          if (!agrupadas[b.nome]) agrupadas[b.nome] = [];
          agrupadas[b.nome].push(b);
        });
        Object.values(agrupadas).forEach(niveisArr => {
          const niveisOrdenados = niveisArr.sort((a, b) => a.nivel - b.nivel);
          setBencaos(prev => {
            // Evita duplicidade
            const jaTem = prev.some(b => b.deus.nome === deus.nome && b.automatica);
            if (jaTem) return prev;
            return [
              ...prev,
              {
                niveis: niveisOrdenados.map(b => ({
                  nome: b.nome,
                  descricao: b.descricao,
                  nivel: b.nivel,
                  bonusAtributo: b.bonus_atributo,
                  bonusPericia: b.bonus_pericia,
                  valorAtributo: b.valor_atributo,
                  valorPericia: b.valor_pericia
                })),
                deus: {
                  nome: deus.nome,
                  foto: deus.foto
                },
                nivelSelecionado: 1,
                automatica: true
              }
            ];
          });
        });
      });
    }
    if (modalTipo === 'bencao') {
      getBencaos().then(bencaosDb => {
        const bencaosDoDeus = bencaosDb.filter(b => b.deus_id === deus.id);
        if (bencaosDoDeus.length === 0) return;
        const agrupadas = {};
        bencaosDoDeus.forEach(b => {
          if (!agrupadas[b.nome]) agrupadas[b.nome] = [];
          agrupadas[b.nome].push(b);
        });
        Object.values(agrupadas).forEach(niveisArr => {
          const niveisOrdenados = niveisArr.sort((a, b) => a.nivel - b.nivel);
          setBencaos(prev => [
            ...prev,
            {
              niveis: niveisOrdenados.map(b => ({
                nome: b.nome,
                descricao: b.descricao,
                nivel: b.nivel,
                bonusAtributo: b.bonus_atributo,
                bonusPericia: b.bonus_pericia,
                valorAtributo: b.valor_atributo,
                valorPericia: b.valor_pericia
              })),
              deus: {
                nome: deus.nome,
                foto: deus.foto
              },
              nivelSelecionado: 1
            }
          ]);
        });
      });
    }
  }

  const handleSalvar = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Dados mínimos para o banco
    // Busca ids das perícias do banco
    let periciasDb = [];
    let periciaNomeToId = {};
    if (supabase && supabase.from) {
      const { data } = await supabase.from('pericia').select('id,nome');
      periciasDb = data || [];
      periciasDb.forEach(p => { periciaNomeToId[p.nome] = p.id });
    }

    const characterData = {
      nome,
      idade: Number(idade),
      gloria: Number(gloria),
      nivel,
      raca: origemDivina,
      avatar_url: foto,
      user_id: userId,
      pai_id: divindadePai ? divindadePai.id : null,
      mae_id: divindadeMae ? divindadeMae.id : null,
      forca: atributos.forca,
      agilidade: atributos.agilidade,
      vigor: atributos.vigor,
      inteligencia: atributos.inteligencia,
      presenca: atributos.presenca,
      sorte: atributos.sorte,
      vida: getVida(nivel),
      vida_atual: getVida(nivel),
      mental: getMental(nivel),
      mental_atual: getMental(nivel),
      inventario: '',
      lore: '',
      pericias: periciasValores,
      periciasBanco: periciasDb,
      bencaos: []
    };
    // Salva personagem
    const result = await salvarPersonagemCompleto(characterData, userId);
    // Aceita tanto result.personagem quanto result.data
    const personagemId = result.personagem?.id || result.data?.id || result.id;
    if (result.error || !personagemId) {
      console.log('Erro ao salvar personagem:', result.error, result);
      setError('Erro ao salvar personagem.');
      setLoading(false);
      return;
    }
    // Busca ids das perícias do banco
    // (ideal: buscar do banco, mas aqui vamos usar o nome como chave)
    const periciasInsert = periciasBanco.map(p => ({
      personagem_id: personagemId,
      pericia_nome: p.nome,
      valor: Number(periciasValores[p.nome]) || 0
    }));
    // Supondo que existe uma função para salvar as perícias
    if (supabase && supabase.from) {
      // Busca os ids das perícias pelo nome
      const { data: periciasDb } = await supabase.from('pericia').select('id,nome');
      const periciaNomeToId = {};
      if (periciasDb) periciasDb.forEach(p => { periciaNomeToId[p.nome] = p.id });
      // Monta os dados para inserir
      const rows = periciasInsert.map(p => ({
        personagem_id: personagemId,
        pericia_id: periciaNomeToId[p.pericia_nome],
        valor: p.valor
      }));
      // Insere todas as perícias do personagem
      await supabase.from('personagem_pericia').upsert(rows);
    }
    setSuccess(true);
    setLoading(false);
  }

  // Função para calcular vida e mental conforme o nível
  const getVida = (nivel) => {
    if (nivel === 1) return 20
    if (nivel === 2) return 30
    if (nivel === 3) return 40
    return 20
  }
  const getMental = (nivel) => {
    if (nivel === 1) return 10
    if (nivel === 2) return 15
    if (nivel === 3) return 20
    return 10
  }

  // Pontos de atributo por nível
  const pontosPorNivel = { 1: 2, 2: 3, 3: 5 }

  // Soma dos pontos distribuídos além do mínimo
  const pontosDistribuidos = Object.values(atributos).reduce((acc, val) => acc + (val - 1), 0)
  const pontosDisponiveis = pontosPorNivel[nivel] - pontosDistribuidos

  // Função para alterar atributo com limitador
  const handleAtributoChange = (key, delta) => {
    setAtributos(prev => {
      const novoValor = prev[key] + delta
      // Não permite menos que 1
      if (novoValor < 1) return prev
      // Não permite passar do limite de pontos disponíveis
      if (delta > 0 && pontosDisponiveis <= 0) return prev
      return { ...prev, [key]: novoValor }
    })
  }

  const [periciasValores, setPericiasValores] = useState(() => {
    const obj = {};
    periciasBanco.forEach(p => { obj[p.nome] = 0 });
    return obj;
  });

  return (
    <div className={styles.container}>
      <section className={styles.personagemSection}>
        <div className="w-100">
          <h1 className={styles.personagemTitle}>Personagem</h1>
          <div className="row w-100 mt-4">
            <div className="col-md-6 d-flex flex-column align-items-center">
              <div className={styles.imgInputWrapper}>
                <label htmlFor="fotoPersonagem" className={styles.imgLabel}>
                  {foto ? (
                    <img
                      src={foto}
                      alt="Foto do personagem"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  ) : (
                    <i className="fas fa-user-circle fa-5x" style={{ color: "#3d0066" }}></i>
                  )}
                </label>
                <input
                  type="file"
                  id="fotoPersonagem"
                  accept="image/*"
                  className={styles.imgInput}
                  onChange={handleFotoChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="nomePersonagem" className={styles.inputLabel}>Nome do Personagem</label>
                <input
                  type="text"
                  id="nomePersonagem"
                  className={`form-control ${styles.inputCustom}`}
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="idadePersonagem" className={styles.inputLabel}>Idade</label>
                  <input
                    type="number"
                    id="idadePersonagem"
                    className={`form-control ${styles.inputCustom} ${styles.noSpin}`}
                    value={idade}
                    onChange={e => setIdade(e.target.value)}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="gloriaPersonagem" className={styles.inputLabel}>Glória</label>
                  <input
                    type="number"
                    id="gloriaPersonagem"
                    className={`form-control ${styles.inputCustom} ${styles.noSpin}`}
                    value={gloria}
                    onChange={e => setGloria(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <br />

          <div className="row">
            {/* Raça à esquerda, Progenitor à direita */}
            <div className="col-md-6">
              <h2 className={styles.raçaTitle}>
                <i className="fas fa-users"></i> Raça
              </h2>
              <div className={styles.racaGrid}>
                <button
                  type="button"
                  className={`${styles.btnRaca} ${origemDivina === 'Humano' ? styles.selected : ''} ${styles.btnRacaTopLeft}`}
                  onClick={() => handleOrigemClick('Humano')}
                >
                  <span className="icon"><i className="fas fa-user"></i></span>
                  Humano
                </button>
                <button
                  type="button"
                  className={`${styles.btnRaca} ${origemDivina === 'Semideus' ? styles.selected : ''} ${styles.btnRacaTopRight}`}
                  onClick={() => handleOrigemClick('Semideus')}
                >
                  <span className="icon"><i className="fas fa-bolt"></i></span>
                  Semideus
                </button>
                <button
                  type="button"
                  className={`${styles.btnRaca} ${origemDivina === 'Híbrido' ? styles.selected : ''} ${styles.btnRacaBottomLeft}`}
                  onClick={() => handleOrigemClick('Híbrido')}
                >
                  <span className="icon"><i className="fas fa-dna"></i></span>
                  Híbrido
                </button>
                <button
                  type="button"
                  className={`${styles.btnRaca} ${origemDivina === 'Deus Menor' ? styles.selected : ''} ${styles.btnRacaBottomRight}`}
                  onClick={() => handleOrigemClick('Deus Menor')}
                >
                  <span className="icon"><i className="fas fa-crown"></i></span>
                  Deus Menor
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <h2 className={styles.progenitorTitle}>
                <i className="fas fa-user-shield"></i> Progenitor
              </h2>
              <div className={styles.dFlexGap}>
                <button
                  type="button"
                  className={`${styles.btnProgenitor} ${progenitorPai ? styles.selected : ''}`}
                  onClick={handleProgenitorPai}
                  disabled={paiDisabled}
                  title={paiDisabled ? "Seleção indisponível" : "Selecionar divindade"}
                >
                  <span className="icon">
                    {paiDisabled
                      ? <i className="fas fa-lock"></i>
                      : <i className="fas fa-mars"></i>
                    }
                  </span>
                  {divindadePai ? divindadePai.nome : 'Pai'}
                </button>
                <button
                  type="button"
                  className={`${styles.btnProgenitor} ${styles.btnProgenitorMae} ${progenitorMae ? styles.selected : ''}`}
                  onClick={handleProgenitorMae}
                  disabled={maeDisabled}
                  title={maeDisabled ? "Seleção indisponível" : "Selecionar divindade"}
                >
                  <span className="icon">
                    {maeDisabled
                      ? <i className="fas fa-lock"></i>
                      : <i className="fas fa-venus"></i>
                    }
                  </span>
                  {divindadeMae ? divindadeMae.nome : 'Mãe'}
                </button>
              </div>
            </div>
          </div>

          <br />

          <div className="row">
            {/* Nível à esquerda, outputs à direita */}
            <div className="col-md-6">
              <h2 className={styles.nivelTitle}>
                <i className="fas fa-layer-group"></i> Nível
              </h2>
              <div className={styles.btnGroupNivel} role="group" aria-label="Nível">
                {[1, 2, 3].map((n, idx, arr) => (
                  <button
                    key={n}
                    type="button"
                    className={
                      `${styles.btnNivel} ${nivel === n ? styles.selected : ''} ` +
                      (idx === 0 ? styles.btnNivelLeft : '') +
                      (idx === arr.length - 1 ? styles.btnNivelRight : '')
                    }
                    onClick={() => setNivel(n)}
                  >
                    {`Nível ${n}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
              <h2 className={styles.statusTitle}>
                <i className="fas fa-heart"></i> Status
              </h2>
              <div className={styles.statusOutputs}>
                <div className={styles.statusOutput}>
                  <span className={styles.statusLabel}><i className="fas fa-heartbeat"></i> Vida:</span>
                  <span className={styles.statusValue}>{getVida(nivel)}</span>
                </div>
                <div className={styles.statusOutput}>
                  <span className={styles.statusLabel}><i className="fas fa-brain"></i> Mental:</span>
                  <span className={styles.statusValue}>{getMental(nivel)}</span>
                </div>
              </div>
            </div>
          </div>
          <br />

          {/* Espaçamento reduzido entre seções */}
          <div className="row mt-3">
            <div className="col-md-12">
              <div className={styles.atributosHeaderRow}>
                <h2 className={styles.nivelTitle}>
                  <i className="fas fa-dumbbell"></i> Atributos
                </h2>
              </div>
              <div className={styles.pontosAtributoLinha}>
                <span
                  className={`${styles.pontosAtributoLabel} ${pontosDisponiveis === 0 ? styles.pontosAtributoZero : ''}`}
                >
                  Pontos: <span className={styles.pontosAtributoValor}>{pontosDisponiveis}</span>
                </span>
              </div>
              <div className={styles.atributosGrid}>
                {[
                  { nome: 'Força', key: 'forca', icon: 'fas fa-fist-raised' },
                  { nome: 'Agilidade', key: 'agilidade', icon: 'fas fa-running' },
                  { nome: 'Vigor', key: 'vigor', icon: 'fas fa-heart' },
                  { nome: 'Inteligência', key: 'inteligencia', icon: 'fas fa-brain' },
                  { nome: 'Presença', key: 'presenca', icon: 'fas fa-star' },
                  { nome: 'Sorte', key: 'sorte', icon: 'fas fa-clover' }
                ].map(attr => (
                  <div key={attr.key} className={styles.atributoCard}>
                    <div className={styles.atributoHeader}>
                      <span className={styles.atributoIcon}><i className={attr.icon}></i></span>
                      <span className={styles.atributoNome}>{attr.nome}</span>
                    </div>
                    <div className={styles.atributoValueGroup}>
                      <button
                        type="button"
                        className={styles.atributoBtn}
                        onClick={() => handleAtributoChange(attr.key, -1)}
                        aria-label={`Diminuir ${attr.nome}`}
                        disabled={atributos[attr.key] <= 1}
                      >-</button>
                      <span className={styles.atributoValue}>{atributos[attr.key]}</span>
                      <button
                        type="button"
                        className={styles.atributoBtn}
                        onClick={() => handleAtributoChange(attr.key, 1)}
                        aria-label={`Aumentar ${attr.nome}`}
                        disabled={pontosDisponiveis <= 0}
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nova seção de Perícias */}
          <div className="row mt-3">
            <div className="col-md-12">
              <div className={styles.atributosHeaderRow}>
                <h2 className={styles.nivelTitle}>
                  <i className="fas fa-book"></i> Perícias
                </h2>
              </div>
              <div className={styles.periciasGrid}>
                {atributosPericia.map(attr => (
                  <div key={attr.key} className={styles.periciaCard}>
                    <div className={styles.periciaHeader}>
                      <span className={styles.periciaIcon}><i className={attr.icon}></i></span>
                      <span className={styles.periciaAtributo}>{attr.nome}</span>
                    </div>
                    {periciasBanco.filter(p => p.atributo_base === attr.key).map(pericia => {
                      // Limite manual por nível
                      const limiteManual = nivel === 1 ? 10 : nivel === 2 ? 15 : 20;
                      // Soma dos bônus das bênçãos ativas para esta perícia
                      let bonus = 0;
                      bencaos.forEach(b => {
                        if (!b.niveis || !b.nivelSelecionado) return;
                        // Acumula bônus de todos os níveis até o selecionado
                        b.niveis.filter(n => n.nivel <= b.nivelSelecionado).forEach(n => {
                          if (n.bonusPericia === pericia.nome) {
                            bonus += Number(n.valorPericia) || 0;
                          }
                        });
                      });
                      const valorManual = periciasValores[pericia.nome] || 0;
                      const valorFinal = valorManual + bonus;
                      return (
                        <div key={pericia.nome} className={styles.periciaItem}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                            <input
                              type="number"
                              className={styles.periciaInput}
                              min={0}
                              max={limiteManual}
                              value={valorManual}
                              onChange={e => {
                                let val = Number(e.target.value);
                                if (val > limiteManual) val = limiteManual;
                                if (val < 0) val = 0;
                                setPericiasValores(prev => ({ ...prev, [pericia.nome]: val }));
                              }}
                            />
                            <span className={bonus > 0 ? styles.periciaBonusNome : ''}>{pericia.nome}</span>
                          </div>
                          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <input
                              type="text"
                              readOnly
                              value={valorFinal}
                              className={
                                bonus > 0
                                  ? `${styles.periciaInput} ${styles.periciaBonusInput}`
                                  : styles.periciaInput
                              }
                              style={{
                                fontWeight: 'bold',
                                color: bonus > 0 ? '#149ea3' : '#b39ddb',
                                background: bonus > 0 ? 'rgba(20,158,163,0.12)' : '',
                                borderColor: bonus > 0 ? '#149ea3' : '',
                                boxShadow: bonus > 0 ? '0 0 8px #149ea3' : '',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carrossel de bênçãos atribuídas - movido para dentro da section personagem */}
          <div className="row mt-3">
            <div className="col-md-12">
              <h2 className={styles.nivelTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-hands-helping"></i> Bênçãos
              </h2>
              <BencaoCarrossel
                bencaos={bencaos}
                onAdd={() => {
                  setModalTipo('bencao');
                  setModalOpen(true);
                }}
                CardBencao={CardBencao}
                onNivelChange={(idx, nivel) => {
                  setBencaos(prev => prev.map((b, i) => i === idx ? { ...b, nivelSelecionado: nivel } : b));
                }}
                onRemove={idx => {
                  setBencaos(prev => prev.filter((_, i) => i !== idx));
                }}
              />
            </div>
          </div>

        </div>
      </section>

      <div className="d-flex justify-content-end mt-3">
        <button
          className={styles.btnSalvar}
          onClick={handleSalvar}
          disabled={loading || !nome || !idade}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>

      </div>
      {success && (
        <div className="alert alert-success mt-3">Personagem salvo com sucesso!</div>
      )}
      {error && (
        <div className="alert alert-danger mt-3">{error}</div>
      )}
      <DivindadeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectDivindade}
      />
    </div>
  )
}