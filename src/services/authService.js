

// Mock user data
const users = [
  {
    id: 1,
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    name: 'Srivatsav Admin'
  },
];

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
  }

  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = users.find(u => u.email === email && u.password === password);

    if (user && typeof window !== 'undefined') {
      const token = Math.random().toString(36).substring(7);
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      return true;
    }

    return false;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  isAuthenticated() {
    return typeof window !== 'undefined' && !!localStorage.getItem(this.tokenKey);
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Optional alias if you're calling getCurrentUser()
  getCurrentUser() {
    return this.getUser();
  }

  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }

  getUserName() {
    const user = this.getUser();
    return user ? user.name : null;
  }

  canAccessRoute(path) {
    const role = this.getUserRole();

    const routeAccess = {
      '/': ['admin', 'inspector', 'engineer'],
      '/ships': ['admin', 'inspector', 'engineer'],
      '/components': ['admin', 'inspector', 'engineer'],
      '/maintenance': ['engineer'],
      '/calendar': ['inspector', 'engineer'],
      '/kpis': ['inspector']
    };

    if (!routeAccess[path]) return true;
    return routeAccess[path].includes(role);
  }
}

export const authService = new AuthService();