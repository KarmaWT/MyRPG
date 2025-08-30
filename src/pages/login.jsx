import { useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) alert("Erro: " + error.message)
    else window.location.href = "/dashboard"
  }

  return (
    <form onSubmit={handleLogin} className="container mt-5">
      <h2>Login</h2>
      <input type="email" className="form-control my-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="form-control my-2" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
      <button type="submit" className="btn btn-primary w-100">Entrar</button>
    </form>
  )
}
