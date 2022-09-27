import { DbLoadAccountByToken } from '../../../../data/use-cases/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '../../../../domain/use-cases/load-account-by-token'
import { AccountMongoRepository } from '../../../../infrastructure/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from '../../../../infrastructure/jwt-adapter/jwt-adapter'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}