import { AccountModel } from '../../../../domain/models/account';

export const map = (account: any): AccountModel => {
  if (!account) {
    return null
  }

  const { _id, ...accountWithoutId } = account 
  return Object.assign({}, accountWithoutId, { id: _id })
}