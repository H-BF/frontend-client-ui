import React, { FC, Dispatch, SetStateAction, useState, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Spacer } from 'components'
import {
  TFormSgRule,
  TFormFqdnRule,
  TFormCidrSgRule,
  TFormSgSgIcmpRule,
  TFormSgSgIeRule,
  TFormSgSgIeIcmpRule,
} from 'localTypes/rules'
import { FQDNRules, SelectMainSG, CidrSGRules, SgAndSgSgIcmpRules, SgSgIeAndSgSgIeIcmpRules } from '../../molecules'
import { Arrows } from './molecules'
import {
  CARDS_CONTAINER,
  SG_AND_SG_SG_ICMP_FROM_ID,
  CIDR_FROM_ID,
  SG_SG_IE_AND_SG_SG_IE_ICMP_FROM_ID,
  CENTRAL_ID,
  SG_AND_SG_SG_ICMP_TO_ID,
  CIDR_TO_ID,
  SG_SG_IE_AND_SG_SG_IE_ICMP_TO_ID,
  FQDN_TO_ID,
} from './constants'
import { Styled } from './styled'

type TTransformBlockProps = {
  sgNames: string[]
  rulesSgFrom: TFormSgRule[]
  setRulesSgFrom: Dispatch<SetStateAction<TFormSgRule[]>>
  rulesSgTo: TFormSgRule[]
  setRulesSgTo: Dispatch<SetStateAction<TFormSgRule[]>>
  rulesFqdnTo: TFormFqdnRule[]
  setRulesFqdnTo: Dispatch<SetStateAction<TFormFqdnRule[]>>
  rulesCidrSgFrom: TFormCidrSgRule[]
  setRulesCidrSgFrom: Dispatch<SetStateAction<TFormCidrSgRule[]>>
  rulesCidrSgTo: TFormCidrSgRule[]
  setRulesCidrSgTo: Dispatch<SetStateAction<TFormCidrSgRule[]>>
  rulesSgSgIcmpFrom: TFormSgSgIcmpRule[]
  setRulesSgSgIcmpFrom: Dispatch<SetStateAction<TFormSgSgIcmpRule[]>>
  rulesSgSgIcmpTo: TFormSgSgIcmpRule[]
  setRulesSgSgIcmpTo: Dispatch<SetStateAction<TFormSgSgIcmpRule[]>>
  rulesSgSgIeFrom: TFormSgSgIeRule[]
  setRulesSgSgIeFrom: Dispatch<SetStateAction<TFormSgSgIeRule[]>>
  rulesSgSgIeTo: TFormSgSgIeRule[]
  setRulesSgSgIeTo: Dispatch<SetStateAction<TFormSgSgIeRule[]>>
  rulesSgSgIeIcmpFrom: TFormSgSgIeIcmpRule[]
  setRulesSgSgIeIcmpFrom: Dispatch<SetStateAction<TFormSgSgIeIcmpRule[]>>
  rulesSgSgIeIcmpTo: TFormSgSgIeIcmpRule[]
  setRulesSgSgIeIcmpTo: Dispatch<SetStateAction<TFormSgSgIeIcmpRule[]>>
  setCenterSg: Dispatch<SetStateAction<string | undefined>>
  centerSg?: string
}

export const TransformBlock: FC<TTransformBlockProps> = ({
  sgNames,
  setCenterSg,
  rulesSgFrom,
  setRulesSgFrom,
  rulesSgTo,
  setRulesSgTo,
  rulesFqdnTo,
  setRulesFqdnTo,
  rulesCidrSgFrom,
  setRulesCidrSgFrom,
  rulesCidrSgTo,
  setRulesCidrSgTo,
  rulesSgSgIcmpFrom,
  setRulesSgSgIcmpFrom,
  rulesSgSgIcmpTo,
  setRulesSgSgIcmpTo,
  rulesSgSgIeFrom,
  setRulesSgSgIeFrom,
  rulesSgSgIeTo,
  setRulesSgSgIeTo,
  rulesSgSgIeIcmpFrom,
  setRulesSgSgIeIcmpFrom,
  rulesSgSgIeIcmpTo,
  setRulesSgSgIeIcmpTo,
  centerSg,
}) => {
  const [arrowsKey, setArrowsKey] = useState(0)

  useEffect(() => {
    setArrowsKey(Math.random())
  }, [
    rulesSgFrom.length,
    rulesSgTo.length,
    rulesFqdnTo.length,
    rulesCidrSgFrom.length,
    rulesCidrSgTo.length,
    rulesSgSgIeFrom.length,
    rulesSgSgIeTo.length,
    rulesSgSgIeIcmpFrom.length,
    rulesSgSgIeIcmpTo.length,
  ])

  const forceArrowsUpdate = () => {
    setArrowsKey(Math.random())
  }

  return (
    <TransformWrapper
      minScale={0.05}
      initialScale={0.5}
      doubleClick={{ disabled: true }}
      alignmentAnimation={{ disabled: true }}
      centerOnInit
      wheel={{ excluded: ['no-scroll'] }}
    >
      <TransformComponent wrapperStyle={{ width: '100%', height: '100vh' }}>
        <Styled.CardsContainer id={CARDS_CONTAINER}>
          <Styled.CardsCol>
            <div id={SG_AND_SG_SG_ICMP_FROM_ID}>
              <SgAndSgSgIcmpRules
                forceArrowsUpdate={forceArrowsUpdate}
                sgNames={sgNames}
                title={`SG From - ${centerSg || ''}`}
                popoverPosition="left"
                rules={rulesSgFrom}
                setRules={setRulesSgFrom}
                rulesOtherside={rulesSgTo}
                setRulesOtherside={setRulesSgTo}
                rulesIcmp={rulesSgSgIcmpFrom}
                setRulesIcmp={setRulesSgSgIcmpFrom}
                rulesOthersideIcmp={rulesSgSgIcmpTo}
                setRulesOthersideIcmp={setRulesSgSgIcmpTo}
                centerSg={centerSg}
                isDisabled
              />
            </div>
            <Spacer $space={100} $samespace />
            <div id={SG_SG_IE_AND_SG_SG_IE_ICMP_FROM_ID}>
              <SgSgIeAndSgSgIeIcmpRules
                forceArrowsUpdate={forceArrowsUpdate}
                sgNames={sgNames}
                title={`SG-SG-IE From - ${centerSg || ''}`}
                popoverPosition="left"
                rules={rulesSgSgIeFrom}
                setRules={setRulesSgSgIeFrom}
                rulesIcmp={rulesSgSgIeIcmpFrom}
                setRulesIcmp={setRulesSgSgIeIcmpFrom}
                defaultTraffic="Ingress"
                isDisabled={!centerSg}
              />
            </div>
            <Spacer $space={100} $samespace />
            <div id={CIDR_FROM_ID}>
              <CidrSGRules
                forceArrowsUpdate={forceArrowsUpdate}
                title={`CIDR From - ${centerSg || ''}`}
                popoverPosition="left"
                rules={rulesCidrSgFrom}
                setRules={setRulesCidrSgFrom}
                defaultTraffic="Ingress"
                isDisabled={!centerSg}
              />
            </div>
          </Styled.CardsCol>
          <Styled.CardsCol>
            <Styled.CenterColWithMarginAuto id={CENTRAL_ID}>
              <SelectMainSG sgNames={sgNames} centerSg={centerSg} onSelectMainSg={setCenterSg} />
            </Styled.CenterColWithMarginAuto>
          </Styled.CardsCol>
          <Styled.CardsCol>
            <div id={SG_AND_SG_SG_ICMP_TO_ID}>
              <SgAndSgSgIcmpRules
                forceArrowsUpdate={forceArrowsUpdate}
                sgNames={sgNames}
                title={`${centerSg || ''} - SG To`}
                popoverPosition="right"
                rules={rulesSgTo}
                setRules={setRulesSgTo}
                rulesOtherside={rulesSgFrom}
                setRulesOtherside={setRulesSgFrom}
                rulesIcmp={rulesSgSgIcmpTo}
                setRulesIcmp={setRulesSgSgIcmpTo}
                rulesOthersideIcmp={rulesSgSgIcmpFrom}
                setRulesOthersideIcmp={setRulesSgSgIcmpFrom}
                centerSg={centerSg}
                isDisabled={!centerSg}
              />
            </div>
            <Spacer $space={100} $samespace />
            <div id={SG_SG_IE_AND_SG_SG_IE_ICMP_TO_ID}>
              <SgSgIeAndSgSgIeIcmpRules
                forceArrowsUpdate={forceArrowsUpdate}
                sgNames={sgNames}
                title={`${centerSg || ''} - SG-SG-IE To`}
                popoverPosition="right"
                rules={rulesSgSgIeTo}
                setRules={setRulesSgSgIeTo}
                rulesIcmp={rulesSgSgIeIcmpTo}
                setRulesIcmp={setRulesSgSgIeIcmpTo}
                defaultTraffic="Egress"
                isDisabled={!centerSg}
              />
            </div>
            <Spacer $space={100} $samespace />
            <div id={CIDR_TO_ID}>
              <CidrSGRules
                forceArrowsUpdate={forceArrowsUpdate}
                title={`${centerSg || ''} - CIDR To`}
                popoverPosition="right"
                rules={rulesCidrSgTo}
                setRules={setRulesCidrSgTo}
                defaultTraffic="Egress"
                isDisabled={!centerSg}
              />
            </div>
            <Spacer $space={100} $samespace />
            <div id={FQDN_TO_ID}>
              <FQDNRules
                forceArrowsUpdate={forceArrowsUpdate}
                title={`${centerSg || ''} - FQDN To`}
                popoverPosition="right"
                rules={rulesFqdnTo}
                setRules={setRulesFqdnTo}
                isDisabled={!centerSg}
              />
            </div>
          </Styled.CardsCol>
          <Arrows key={arrowsKey} />
        </Styled.CardsContainer>
      </TransformComponent>
    </TransformWrapper>
  )
}
