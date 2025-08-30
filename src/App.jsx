import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import Fichas from './pages/Fichas'
import CriarFicha from './pages/Criar-Ficha'
import AuthLayout from './layouts/auth'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Sem Navbar */}
        <Route path="/" element={<Login />} />

        {/* Com Navbar */}
        <Route
          path="/dashboard"
          element={
            <AuthLayout>
              <Dashboard />
            </AuthLayout>
          }
        />
        <Route
          path="/fichas"
          element={
            <AuthLayout>
              <Fichas />
            </AuthLayout>
          }
        />
        <Route
          path="/criar-ficha"
          element={
            <AuthLayout>
              <CriarFicha />
            </AuthLayout>
          }
        />
        {/* Outras rotas */}
      </Routes>
    </Router>
  )
}
