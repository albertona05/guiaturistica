export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  comunidad: string;
  email: string;
  role: string;
  birthday: Date | null;
  gender: string;
  phone: string;
  password: string;
}
