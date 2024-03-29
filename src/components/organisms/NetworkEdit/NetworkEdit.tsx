import React, { FC, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Card, Button, Form, Input, Breadcrumb, Result, Spin, Alert } from 'antd'
import { TitleWithNoTopMargin, Spacer } from 'components'
import { getNetworkByName, editNetwork } from 'api/networks'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { TNetwork } from 'localTypes/networks'
import { Styled } from './styled'

type TNetworkEditProps = {
  id: string
}

export const NetworkEdit: FC<TNetworkEditProps> = ({ id }) => {
  const [form] = Form.useForm()
  const history = useHistory()
  const [network, setNetwork] = useState<TNetwork>()
  const [error, setError] = useState<TRequestError | undefined>()
  const [editError, setEditError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [success, setSuccess] = useState<boolean>()

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    getNetworkByName(id)
      .then(({ data }) => {
        setNetwork(data.networks[0])
        form.setFieldsValue({
          cidr: data.networks[0].network.CIDR,
        })
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
  }, [id, form])

  const onFinish = ({ cidr }: { cidr: string }) => {
    setIsLoading(true)
    setError(undefined)
    editNetwork(id, cidr)
      .then(() => {
        setIsLoading(false)
        setSuccess(true)
      })
      .catch((error: AxiosError<TRequestErrorData>) => {
        setIsLoading(false)
        if (error.response) {
          setEditError({ status: error.response.status, data: error.response.data })
        } else if (error.status) {
          setEditError({ status: error.status })
        } else {
          setEditError({ status: 'Error while fetching' })
        }
      })
  }

  if (success) {
    history.push('/networks')
  }

  if (error) {
    return <Result status="error" title={error.status} subTitle={error.data?.message} />
  }

  if (isLoading) {
    return <Spin />
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: '/networks',
            title: 'Networks',
          },
          {
            title: 'Edit',
          },
        ]}
      />
      <Spacer $space={15} $samespace />
      {network && (
        <Card>
          <TitleWithNoTopMargin level={2}>Edit the network</TitleWithNoTopMargin>
          <Spacer $space={15} $samespace />
          <Form form={form} name="control-hooks" onFinish={onFinish}>
            <Styled.Container>
              <Styled.FormItem name="cidr" label="CIDR">
                <Input allowClear />
              </Styled.FormItem>
              <Styled.ButtonFormItem>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Styled.ButtonFormItem>
            </Styled.Container>
          </Form>
          {editError && (
            <Alert
              message={editError.status}
              description={`Code:${editError.data?.code}. Message: ${editError.data?.message}`}
              type="error"
            />
          )}
        </Card>
      )}
    </>
  )
}
