import { useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import Loader from '../components/Loader';
import { useApi, ErrorBox } from '../components/AsyncContent';
export default function EditProduct() {
  const { id } = useParams();
  const { data, loading, error } = useApi(`/products/${id}`);
  return loading ? (
    <Loader />
  ) : error ? (
    <ErrorBox message={error} />
  ) : (
    <ProductForm product={data} />
  );
}
