import { NavLink, Outlet } from 'react-router-dom';
export default function AdminLayout() {
  return (
    <section className="section page">
      <p className="eyebrow">CARTNOVA WORKSPACE</p>
      <h1>Store management</h1>
      <nav className="admin-nav">
        <NavLink to="/admin" end>
          Overview
        </NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
      </nav>
      <Outlet />
    </section>
  );
}
