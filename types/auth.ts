export interface User {
  id: string;
  name: string;
  email: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}
