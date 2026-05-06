import { Routes, Route, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { RequireAuth } from '@/components/RequireAuth';
import Home from '@/pages/Home';
import Session from '@/pages/Session';
import Schema from '@/pages/Schema';
import Archive from '@/pages/Archive';
import Login, { Register } from '@/pages/Login';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/session"
            element={
              <RequireAuth>
                <Session />
              </RequireAuth>
            }
          />
          <Route
            path="/schema"
            element={
              <RequireAuth>
                <Schema />
              </RequireAuth>
            }
          />
          <Route
            path="/archive"
            element={
              <RequireAuth>
                <Archive />
              </RequireAuth>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Layout>
      <AnimatedRoutes />
    </Layout>
  );
}
