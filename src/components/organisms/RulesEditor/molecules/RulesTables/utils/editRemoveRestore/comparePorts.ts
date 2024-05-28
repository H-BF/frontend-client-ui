import { TPortGroup } from 'localTypes/rules'

export const comparePorts = (portsOne?: TPortGroup[], portsTwo?: TPortGroup[]): boolean => {
  if (portsOne && portsTwo) {
    if (portsOne.length !== portsTwo.length) {
      return false
    }
    return portsOne.some(({ s, d }, index) => {
      if (s !== portsTwo[index].s || d !== portsTwo[index].d) {
        return false
      }
      return true
    })
  }
  if ((portsOne && portsOne.length === 0 && !portsTwo) || (portsTwo && portsTwo.length === 0 && !portsOne)) {
    return false
  }
  if ((portsOne && !portsTwo) || (!portsOne && portsTwo)) {
    return true
  }
  return false
}
