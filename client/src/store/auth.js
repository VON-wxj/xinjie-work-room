import { create } from 'zustand';

const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
const storedToken = localStorage.getItem('token') || null;
const isAdminRole = storedUser?.role === 'admin' || storedUser?.role === 'super_admin';

const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken,
  isAdmin: isAdminRole,
  isSuperAdmin: storedUser?.role === 'super_admin',
  initialized: !!storedToken,

  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      token,
      user,
      isAdmin: user.role === 'admin' || user.role === 'super_admin',
      isSuperAdmin: user.role === 'super_admin',
      initialized: true,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAdmin: false, isSuperAdmin: false, initialized: true });
  },

  init: () => {
    set({ initialized: true });
  },
}));

export default useAuthStore;
