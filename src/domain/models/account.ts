export interface AccountModel {
  id: string
  email: string
  name: string
  password: string
  accessToken?: string
  role?: string
}