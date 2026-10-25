
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute, GuestRoute } from './components/RouteGuards';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Details from './pages/Details';
import RepairForm from './pages/RepairForm';
import AuthPage from './pages/AuthPage';
import MyRepairs from './pages/MyRepairs';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app-shell">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repairs" element={<Catalog />} />
        <Route path="/repairs/:repairId" element={<Details />} />
        <Route element={<PrivateRoute />}>
          <Route path="/repairs/create" element={<RepairForm />} />
          <Route path="/repairs/:repairId/edit" element={<RepairForm mode="edit" />} />
          <Route path="/my-repairs" element={<MyRepairs />} />
          <Route path="/users/:userId" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}
