import { configureStore } from '@reduxjs/toolkit'
import { sgNamesSlice } from './editor/sgNames/sgNames'
import { rulesSgSgSlice } from './editor/rulesSgSg/rulesSgSg'
import { rulesSgSgIcmpSlice } from './editor/rulesSgSgIcmp/rulesSgSgIcmp'
import { rulesSgSgIeSlice } from './editor/rulesSgSgIe/rulesSgSgIe'
import { rulesSgSgIeIcmpSlice } from './editor/rulesSgSgIeIcmp/rulesSgSgIeIcmp'
import { rulesSgFqdnSlice } from './editor/rulesSgFqdn/rulesSgFqdn'
import { rulesSgCidrSlice } from './editor/rulesSgCidr/rulesSgCidr'
import { rulesSgCidrIcmpSlice } from './editor/rulesSgCidrIcmp/rulesSgCidrIcmp'

export const store = configureStore({
  reducer: {
    sgNames: sgNamesSlice.reducer,
    rulesSgSg: rulesSgSgSlice.reducer,
    rulesSgSgIcmp: rulesSgSgIcmpSlice.reducer,
    rulesSgSgIe: rulesSgSgIeSlice.reducer,
    rulesSgSgIeIcmp: rulesSgSgIeIcmpSlice.reducer,
    rulesSgFqdn: rulesSgFqdnSlice.reducer,
    rulesSgCidr: rulesSgCidrSlice.reducer,
    rulesSgCidrIcmp: rulesSgCidrIcmpSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
