import { Outlet } from 'react-router-dom';
import HeaderPublic from '../common/HeaderPublic.jsx';
import Footer from '../common/Footer.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className='bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white'>
      <HeaderPublic />
      </div>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}