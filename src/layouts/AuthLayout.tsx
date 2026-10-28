import { Outlet } from 'react-router-dom';

/** Centers login and registration cards. Rendered inside MainLayout. */
export function AuthLayout() {
  return (
    <div className="auth-layout container">
      <Outlet />
    </div>
  );
}
