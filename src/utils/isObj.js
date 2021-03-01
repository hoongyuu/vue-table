import { is } from 'ramda'

export default function isObj (o) {
  if (!Array.isArray(o) && is(Object, o)) {
    return true
  }
  return false
}
