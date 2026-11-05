import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieBanner from './components/CookieBanner';
import RouteTracker from './components/RouteTracker';
import NotFound from './pages/NotFound/NotFound';
import RequireAuth from './auth/RequireAuth';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import EmailVerification from './pages/EmailVerification/EmailVerification';
import Contact from './pages/Contact/Contact';
import Blog from './pages/Blog/Blog';
const Users = lazy(() => import('./pages/admin/Users/Users'));
import Account from './pages/Account/Account';
const PostManager = lazy(() => import('./pages/admin/Posts/PostManager'));
const AddPost = lazy(() => import('./pages/admin/Posts/AddPost'));
const Chart = lazy(() => import('./pages/admin/Chart/Chart'));
const ManageComments = lazy(() => import('./pages/admin/Posts/ManageComments'));

const ADMIN_ROLE = 'Administrator';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id/:slug?" element={<Blog />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/EmailVerification" element={<EmailVerification />} />
            <Route path="/AboutUs" element={<About />} />
            <Route path="/ContactUs" element={<Contact />} />
            <Route element={<RequireAuth />}>
              <Route path="/Account" element={<Account />} />
            </Route>
            <Route element={<RequireAuth role={ADMIN_ROLE} />}>
              <Route path="/Admin/Users" element={<Users />} />
              <Route path="/Admin/PostManager" element={<PostManager />} />
              <Route path="/Admin/AddPost" element={<AddPost />} />
              <Route path="/Admin/Chart" element={<Chart />} />
              <Route path="/Admin/ManageComments" element={<ManageComments />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CookieBanner />
      <RouteTracker />
    </div>
  );
}

export default App;
