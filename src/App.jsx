import { Routes, Route, Link } from 'react-router-dom'
import ClientsPage from './features/clients/pages/ClientsPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                MyImoMate
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Real Estate CRM - Em desenvolvimento
              </p>
              <div className="space-x-4">
                <Link 
                  to="/clientes"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
                >
                  Ver Clientes
                </Link>
                <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        } />
        
        {/* Rota para o módulo de clientes */}
        <Route path="/clientes" element={<ClientsPage />} />
        <Route path="/clientes/*" element={<ClientsPage />} />
      </Routes>
    </div>
  )
}

export default App