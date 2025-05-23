import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Enquiries from './pages/Enquiries'
import Quotations from './pages/Quotations'
import SalesOrder from './pages/SalesOrder'
import MeasurementSummaries from './pages/MeasurementSummaries'
import MeasurementSummariesList from './pages/MeasurementSummariesList'
import BillOfMaterials from './pages/BillOfMaterials'
import BillOfMaterialsList from './pages/BillOfMaterialsList'
import InventoryDashboard from './pages/Inventory/InventoryDashboard'
import InventoryItems from './pages/Inventory/InventoryItems'
import Profile from './pages/Profile'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/quotation" element={<Quotations />} />
            <Route path="/sales-order" element={<SalesOrder />} />
            
            {/* Measurement Summaries Routes */}
            <Route path="/measurement-summaries" element={<MeasurementSummariesList />} />
            <Route path="/measurement-summaries/new" element={<MeasurementSummaries />} />
            <Route path="/measurement-summaries/:id/edit" element={<MeasurementSummaries />} />
            <Route path="/measurement-summaries/:id" element={<MeasurementSummaries />} />
            
            {/* Bill of Materials Routes */}
            <Route path="/bill-of-materials" element={<BillOfMaterialsList />} />
            <Route path="/bill-of-materials/new" element={<BillOfMaterials />} />
            <Route path="/bill-of-materials/:id/edit" element={<BillOfMaterials />} />
            <Route path="/bill-of-materials/:id" element={<BillOfMaterials />} />
            
            <Route path="/job-order" element={<div className="p-4">Job Order Page</div>} />
            <Route path="/material-requisition" element={<div className="p-4">Material Requisition Page</div>} />
            
            {/* Inventory Routes */}
            <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
            <Route path="/inventory/items" element={<InventoryItems />} />
            <Route path="/inventory/movements" element={<div className="p-4">Stock Movements Page</div>} />
            <Route path="/inventory/count" element={<div className="p-4">Stock Count Page</div>} />
            
            <Route path="/settings" element={<div className="p-4">Settings Page</div>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
