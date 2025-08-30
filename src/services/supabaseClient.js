import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

// Buscar todas as divindades
export async function getDivindades() {
  const { data, error } = await supabase.from('deus').select('*')
  if (error) {
    console.error('Erro ao buscar divindades:', error)
    return []
  }
  return data
}

// Buscar todas as bênçãos
export async function getBencaos() {
  const { data, error } = await supabase.from('bencao').select('*')
  if (error) {
    console.error('Erro ao buscar bênçãos:', error)
    return []
  }
  return data
}

// Buscar todas as perícias
export async function getPericias() {
  const { data, error } = await supabase.from('pericia').select('*')
  if (error) {
    console.error('Erro ao buscar perícias:', error)
    return []
  }
  return data
}

// Função para salvar personagem e relacionamentos
export async function salvarPersonagemCompleto(characterData, userId) {
  // 1. Salvar personagem principal
  const { data: personagem, error: errorPersonagem } = await supabase
    .from('personagem')
    .insert([{
      nome: characterData.nome,
      idade: characterData.idade,
      gloria: characterData.gloria,
      nivel: characterData.nivel,
      raca: characterData.raca, // <-- CORRETO
      avatar_url: characterData.avatar_url, // <-- CORRETO
      user_id: characterData.user_id, // <-- CORRETO
      pai_id: characterData.pai_id, // <-- CORRETO
      mae_id: characterData.mae_id, // <-- CORRETO
      forca: characterData.forca,
      agilidade: characterData.agilidade,
      vigor: characterData.vigor,
      inteligencia: characterData.inteligencia,
      presenca: characterData.presenca,
      sorte: characterData.sorte,
      vida: characterData.vida,
      vida_atual: characterData.vida_atual,
      mental: characterData.mental,
      mental_atual: characterData.mental_atual,
      inventario: characterData.inventario,
      lore: characterData.lore
    }])
    .select()
    .single()

  if (errorPersonagem) {
    console.error('Erro ao salvar personagem:', errorPersonagem)
    return { error: errorPersonagem }
  }

  // 2. Salvar perícias
  const periciaRows = Object.entries(characterData.pericias).map(([periciaNome, valor]) => {
    // Encontre o id da perícia pelo nome
    const periciaObj = characterData.periciasBanco?.find(p => p.nome.toLowerCase() === periciaNome.toLowerCase())
    if (!periciaObj) return null
    return {
      personagem_id: personagem.id,
      pericia_id: periciaObj.id,
      valor
    }
  }).filter(Boolean)

  if (periciaRows.length > 0) {
    const { error: errorPericia } = await supabase
      .from('personagem_pericia')
      .insert(periciaRows)
    if (errorPericia) {
      console.error('Erro ao salvar perícias:', errorPericia)
    }
  }

  // 3. Salvar bênçãos
  const bencaoRows = characterData.bencaos.map(bencao => ({
    personagem_id: personagem.id,
    bencao_id: bencao.id,
    nivel: bencao.nivel,
    tipo: bencao.automatica ? 'automatica' : 'manual'
  }))

  if (bencaoRows.length > 0) {
    const { error: errorBencao } = await supabase
      .from('personagem_bencao')
      .insert(bencaoRows)
    if (errorBencao) {
      console.error('Erro ao salvar bênçãos:', errorBencao)
    }
  }

  return { personagem }
}

// Exporte o cliente para outras operações (salvar personagem, etc)
export { supabase }