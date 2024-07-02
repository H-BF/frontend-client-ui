import React, { FC } from 'react'
import {
  SgSgIcmpFrom,
  SgSgTcpUdpFrom,
  SgSgIcmpTo,
  SgSgTcpUdpTo,
  SgSgIeIcmpFrom,
  SgSgIeTcpUdpFrom,
  SgSgIeIcmpTo,
  SgSgIeTcpUdpTo,
  SgFqdnTo,
  SgCidrIcmpFrom,
  SgCidrTcpUdpFrom,
  SgCidrIcmpTo,
  SgCidrTcpUdpTo,
} from '../../organisms'
import { Styled } from './styled'

type TRulesByTypeProps = {
  typeId: string
  searchText: string
}

export const RulesByType: FC<TRulesByTypeProps> = ({ typeId, searchText }) => {
  if (typeId === 'sgSg') {
    return (
      <>
        <Styled.Card>
          <SgSgTcpUdpFrom />
        </Styled.Card>
        <Styled.Card>
          <SgSgTcpUdpTo />
        </Styled.Card>
      </>
    )
  }
  if (typeId === 'sgSgIcmp') {
    return (
      <>
        <Styled.Card>
          <SgSgIcmpFrom />
        </Styled.Card>
        <Styled.Card>
          <SgSgIcmpTo />
        </Styled.Card>
      </>
    )
  }
  if (typeId === 'sgSgIe') {
    return (
      <>
        <Styled.Card>
          <SgSgIeTcpUdpFrom />
        </Styled.Card>
        <Styled.Card>
          <SgSgIeTcpUdpTo />
        </Styled.Card>
      </>
    )
  }
  if (typeId === 'sgSgIeIcmp') {
    return (
      <>
        <Styled.Card>
          <SgSgIeIcmpFrom />
        </Styled.Card>
        <Styled.Card>
          <SgSgIeIcmpTo />
        </Styled.Card>
      </>
    )
  }
  if (typeId === 'sgCidr') {
    return (
      <>
        <Styled.Card>
          <SgCidrTcpUdpFrom />
        </Styled.Card>
        <Styled.Card>
          <SgCidrTcpUdpTo />
        </Styled.Card>
      </>
    )
  }
  if (typeId === 'sgCidrIcmp') {
    return (
      <>
        <Styled.Card>
          <SgCidrIcmpFrom />
        </Styled.Card>
        <Styled.Card>
          <SgCidrIcmpTo />
        </Styled.Card>
      </>
    )
  }
  if (typeId === 'sgFqdn') {
    return (
      <Styled.Card>
        <SgFqdnTo />
      </Styled.Card>
    )
  }
  return null
}
