import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { getCandidates } from '../api/candidates';
import type { Candidate, CandidateFilters } from '../types';
import { Loader2 } from 'lucide-react';

const CandidateList = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { register, handleSubmit, watch, reset } = useForm<CandidateFilters>({
    defaultValues: {
      search: '',
      position: '',
      status: '',
    },
  });

  const filtersRef = useRef<CandidateFilters>({});

  const fetchCandidates = async (filters: CandidateFilters = {}, currentPage: number = page) => {
    setLoading(true);
    setError(null);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
      );
      const data = await getCandidates(currentPage, 10, cleanFilters);
      setCandidates(data.candidates);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger la liste des candidats.');
    } finally {
      setLoading(false);
    }
  };

  // Surveiller les changements de filtres
  useEffect(() => {
    const subscription = watch((value) => {
      setPage(1);
      filtersRef.current = value;
      fetchCandidates(value, 1);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Charger lorsque la page change
  useEffect(() => {
    fetchCandidates(filtersRef.current, page);
  }, [page]);

  // Premier chargement
  useEffect(() => {
    fetchCandidates({}, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    reset({ search: '', position: '', status: '' });
    setPage(1);
    filtersRef.current = {};
    fetchCandidates({}, 1);
  };

  return (
    <div className="bg-marine min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Liste des candidats</h1>

        <form onSubmit={handleSubmit(() => {})} className="mb-6 flex flex-wrap gap-4 items-end">
          <input
            placeholder="Rechercher (nom ou prénom)"
            {...register('search')}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marine w-64"
          />
          <input
            placeholder="Poste"
            {...register('position')}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marine w-48"
          />
          <select
            {...register('status')}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marine"
          >
            <option value="">Tous statuts</option>
            <option value="pending">En attente</option>
            <option value="validated">Validé</option>
            <option value="rejected">Rejeté</option>
          </select>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Réinitialiser
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin text-marine" size={32} />
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : (
          <>
            {candidates.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun candidat trouvé.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((c) => (
                      <tr key={c._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.firstName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            c.status === 'validated' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {c.status === 'pending' ? 'En attente' : c.status === 'validated' ? 'Validé' : 'Rejeté'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/candidates/${c._id}`}
                            className="text-marine hover:underline"
                          >
                            Détail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Précédent
                </button>
                <span className="text-gray-700">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/candidates/new"
            className="inline-block bg-marine text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            + Nouveau candidat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;