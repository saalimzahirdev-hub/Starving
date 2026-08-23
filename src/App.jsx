import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider }  from './context/AuthContext';
import { CartProvider }  from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AppProvider }   from './context/AppContext';
import ProtectedRoute    from './components/auth/ProtectedRoute';
import Navbar   from './components/layout/Navbar';
import Footer   from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';

// Customer pages
import Home          from './pages/customer/Home';
import MenuPage      from './pages/customer/Menu';
import CartPage      from './pages/customer/Cart';
import Checkout      from './pages/customer/Checkout';
import OrderTracking from './pages/customer/OrderTracking';
import Contact       from './pages/customer/Contact';

// Admin pages
import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminMenu      from './pages/admin/AdminMenu';
import AdminReports   from './pages/admin/AdminReports';
import AdminSettings  from './pages/admin/AdminSettings';

// Wrapper for all customer-facing pages (with navbar/footer)
function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--surface)' }}>
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
      <FloatingWhatsApp />
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#16211a',
                    color: '#e8f0ec',
                    border: '1px solid rgba(201,168,76,0.25)',
                    borderRadius: '12px',
                    fontSize: '13px',
                  },
                }}
              />
              <Routes>
                {/* ─── Customer Routes ─── */}
                <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
                <Route path="/menu" element={<CustomerLayout><MenuPage /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
                <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
                <Route path="/track-order" element={<CustomerLayout><OrderTracking /></CustomerLayout>} />
                <Route path="/track-order/:orderId" element={<CustomerLayout><OrderTracking /></CustomerLayout>} />
                <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />

                {/* ─── Admin Routes ─── */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute><AdminOrders /></ProtectedRoute>
                } />
                <Route path="/admin/menu" element={
                  <ProtectedRoute><AdminMenu /></ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute><AdminReports /></ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute><AdminSettings /></ProtectedRoute>
                } />

                {/* ─── Fallback ─── */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
