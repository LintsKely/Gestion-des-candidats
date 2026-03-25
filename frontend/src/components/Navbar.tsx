import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-marine text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">Gestion Candidats</Link>
      <div>
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="bg-white text-marine px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Déconnexion
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-white text-marine px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;