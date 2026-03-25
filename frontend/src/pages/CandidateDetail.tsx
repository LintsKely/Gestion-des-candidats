import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCandidateById, validateCandidate, deleteCandidate, updateCandidate } from '../api/candidates';
import type { Candidate } from '../types';
import { ArrowLeft } from 'lucide-react';

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getCandidateById(id)
      .then(setCandidate)
      .catch(() => setError('Candidat non trouvé'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleValidate = async () => {
    if (!id) return;
    setValidating(true);
    try {
      const result = await validateCandidate(id);
      setCandidate(result.candidate);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la validation');
    } finally {
      setValidating(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      const updated = await updateCandidate(id, { status: 'rejected' });
      setCandidate(updated);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du rejet');
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Supprimer ce candidat ?')) return;
    try {
      await deleteCandidate(id);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="bg-marine min-h-screen p-6 flex justify-center items-center">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-marine min-h-screen p-6 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="bg-marine min-h-screen p-6 flex justify-center items-center">
        <p className="text-white">Aucun candidat trouvé</p>
      </div>
    );
  }

  const isPending = candidate.status === 'pending';

  return (
    <div className="bg-marine min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto relative">
        {/* Flèche de retour en haut à droite */}
        <Link to="/" className="absolute top-4 right-4 text-marine hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-1" />
          Retour
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {candidate.firstName} {candidate.lastName}
        </h1>
        <div className="space-y-2 mb-6">
          <p><strong className="text-gray-700">Email :</strong> <span className="text-gray-800">{candidate.email}</span></p>
          <p><strong className="text-gray-700">Téléphone :</strong> <span className="text-gray-800">{candidate.phone || 'Non renseigné'}</span></p>
          <p><strong className="text-gray-700">Poste :</strong> <span className="text-gray-800">{candidate.position}</span></p>
          <p><strong className="text-gray-700">Statut :</strong>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              candidate.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : candidate.status === 'validated'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {candidate.status === 'pending' ? 'En attente' : candidate.status === 'validated' ? 'Validé' : 'Rejeté'}
            </span>
          </p>
          <p><strong className="text-gray-700">Créé le :</strong> <span className="text-gray-800">{new Date(candidate.createdAt).toLocaleString()}</span></p>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          {isPending ? (
            <>
              <button
                onClick={handleValidate}
                disabled={validating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {validating ? 'Validation en cours...' : 'Valider (2s)'}
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Rejeter
              </button>
            </>
          ) : (
            <p className="text-gray-500 italic">Ce candidat a déjà été traité.</p>
          )}
          <button
            onClick={() => navigate(`/candidates/${id}/edit`)}
            className="px-4 py-2 bg-marine text-white rounded hover:bg-opacity-90"
          >
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default CandidateDetail;