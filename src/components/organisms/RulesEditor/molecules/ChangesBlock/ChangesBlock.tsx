import React, { FC, useState } from 'react'
import { AxiosError } from 'axios'
import { Button, Result, Spin } from 'antd'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { Spacer, TitleWithNoTopMargin } from 'components'
import { TFormSgRule, TFormFqdnRule, TFormCidrSgRule } from 'localTypes/rules'
import { upsertRules, deleteRules } from 'api/rules'
import {
  getChangesSgRules,
  getChangesFqdnRules,
  getChangesCidrSgRules,
  composeAllTypesOfSgRules,
  composeAllTypesOfFqdnRules,
  composeAllTypesOfCidrSgRules,
} from './utils'
import { RulesDiff } from './organisms'
import { Styled } from './styled'

type TChangesBlockProps = {
  centerSg: string
  rulesSgFrom: TFormSgRule[]
  rulesSgTo: TFormSgRule[]
  rulesFqdnTo: TFormFqdnRule[]
  rulesCidrSgFrom: TFormCidrSgRule[]
  rulesCidrSgTo: TFormCidrSgRule[]
  onClose: () => void
  onSubmit: () => void
}

export const ChangesBlock: FC<TChangesBlockProps> = ({
  centerSg,
  rulesSgFrom,
  rulesSgTo,
  rulesFqdnTo,
  rulesCidrSgFrom,
  rulesCidrSgTo,
  onClose,
  onSubmit,
}) => {
  const [error, setError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const changesResultSgFromResult = getChangesSgRules(rulesSgFrom)
  const changesResultSgToResult = getChangesSgRules(rulesSgTo)
  const changesResultFqdnTo = getChangesFqdnRules(rulesFqdnTo)
  const changesResultCidrSgFrom = getChangesCidrSgRules(rulesCidrSgFrom)
  const changesResultCidrSgTo = getChangesCidrSgRules(rulesCidrSgTo)

  const handleOk = () => {
    const sgRules = composeAllTypesOfSgRules(centerSg, rulesSgFrom, rulesSgTo)
    const fqdnRules = composeAllTypesOfFqdnRules(centerSg, rulesFqdnTo)
    const cidrRules = composeAllTypesOfCidrSgRules(centerSg, rulesCidrSgFrom, rulesCidrSgTo)

    deleteRules(sgRules.rulesToDelete, fqdnRules.rulesToDelete, cidrRules.rulesToDelete)
      .then(() => {
        // Do not touch: Seuquence is important. Promise.All wont work properly
        upsertRules(sgRules.rules, fqdnRules.rules, cidrRules.rules)
      })
      .then(() => {
        setIsLoading(false)
        onSubmit()
      })
      .catch((error: AxiosError<TRequestErrorData>) => {
        setIsLoading(false)
        if (error.response) {
          setError({ status: error.response.status, data: error.response.data })
        } else if (error.status) {
          setError({ status: error.status })
        } else {
          setError({ status: 'Error while fetching' })
        }
      })
  }

  return (
    <>
      <TitleWithNoTopMargin level={3}>Changes for: {centerSg}</TitleWithNoTopMargin>
      <Styled.ScrollContainer>
        {changesResultSgFromResult && (
          <RulesDiff title="SG From" compareResult={{ type: 'sg', data: changesResultSgFromResult }} />
        )}
        {changesResultSgToResult && (
          <RulesDiff title="SG To" compareResult={{ type: 'sg', data: changesResultSgToResult }} />
        )}
        {changesResultFqdnTo && (
          <RulesDiff title="FQDN To" compareResult={{ type: 'fqdn', data: changesResultFqdnTo }} />
        )}
        {changesResultCidrSgFrom && (
          <RulesDiff title="CIDR-SG From" compareResult={{ type: 'cidr', data: changesResultCidrSgFrom }} />
        )}
        {changesResultCidrSgTo && (
          <RulesDiff title="CIDR-SG To" compareResult={{ type: 'cidr', data: changesResultCidrSgTo }} />
        )}
        {!changesResultSgFromResult &&
          !changesResultSgToResult &&
          !changesResultFqdnTo &&
          !changesResultCidrSgFrom &&
          !changesResultCidrSgTo && <div>No changes</div>}
      </Styled.ScrollContainer>
      <Spacer />
      <Styled.ButtonsContainer>
        <Button type="default" onClick={onClose}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleOk}>
          Submit
        </Button>
      </Styled.ButtonsContainer>
      {isLoading && <Spin />}
      {error && (
        <Result
          status="error"
          title={error.status}
          subTitle={`Code:${error.data?.code}. Message: ${error.data?.message}`}
        />
      )}
    </>
  )
}
