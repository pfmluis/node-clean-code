export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authenticator {
  authenticate(auth: AuthenticationModel): Promise<string>    
}