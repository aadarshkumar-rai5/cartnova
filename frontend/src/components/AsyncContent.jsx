import { useEffect, useState } from 'react';
import api, { errorMessage } from '../services/api';
export function useApi(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api
      .get(url)
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [url, revision]);
  return { data, error, loading, reload: () => setRevision((v) => v + 1) };
}
export function ErrorBox({ message }) {
  return message ? (
    <div className="error" role="alert">
      {message}
    </div>
  ) : null;
}
