import React, { FC, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { AxiosError } from 'axios'
import { Typography, Form, Select, Result, Spin } from 'antd'
import { Spacer, TitleWithNoTopMargin } from 'components'
import { getSecurityGroupByName } from 'api/securityGroups'
import { TSecurityGroup } from 'localTypes/securityGroups'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { filterSgName } from 'utils/filterSgName'
import { TFieldData } from './types'
import { Styled } from './styled'

type TSelectMainSGProps = {
  sgNames: string[]
  onSelectMainSg: Dispatch<SetStateAction<string | undefined>>
  centerSg?: string
}

export const SelectMainSG: FC<TSelectMainSGProps> = ({ sgNames, onSelectMainSg, centerSg }) => {
  const [curValues, setCurValues] = useState<TFieldData[]>([{ name: 'name', value: undefined }])
  const [securityGroup, setSecurityGroup] = useState<TSecurityGroup>()
  const [error, setError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!centerSg) {
      setCurValues([{ name: 'name', value: undefined }])
      setSecurityGroup(undefined)
      setIsLoading(false)
      setError(undefined)
    } else {
      setIsLoading(true)
      getSecurityGroupByName(centerSg)
        .then(({ data }) => {
          setSecurityGroup(data.groups[0])
          setIsLoading(false)
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
  }, [centerSg])

  return (
    <Styled.GroupRulesNode>
      <TitleWithNoTopMargin level={4}>Main SG</TitleWithNoTopMargin>
      <Styled.Directions>
        <Typography.Text type="secondary">Ingress</Typography.Text>
        <Typography.Text type="secondary">Egress</Typography.Text>
      </Styled.Directions>
      <Spacer $space={10} $samespace />
      <Form
        fields={curValues}
        onFieldsChange={(_, allFields) => {
          setCurValues(allFields)
        }}
      >
        <Styled.FormItem name="name">
          <Select
            showSearch
            allowClear
            onSelect={onSelectMainSg}
            onClear={() => onSelectMainSg(undefined)}
            placeholder="Select sg"
            optionFilterProp="children"
            filterOption={filterSgName}
            options={sgNames.map(el => ({
              value: el,
              label: el,
            }))}
            autoFocus
          />
        </Styled.FormItem>
      </Form>
      <Spacer $space={10} $samespace />
      {error && <Result status="error" title={error.status} subTitle={error.data?.message} />}
      {isLoading && <Spin />}
      {securityGroup && (
        <Typography.Text type="secondary">Default Action: {securityGroup.defaultAction}</Typography.Text>
      )}
    </Styled.GroupRulesNode>
  )
}
