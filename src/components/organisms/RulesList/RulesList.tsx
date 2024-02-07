/* eslint-disable max-lines-per-function */
import React, { FC, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Card, Table, Button, Result, Spin, Empty, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { TitleWithNoTopMargin, Spacer } from 'components'
import { getRules, removeRule, getFqdnRules, removeFqdnRule } from 'api/rules'
import { ITEMS_PER_PAGE } from 'constants/rules'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { TSgRule, TFqdnRule } from 'localTypes/rules'
import { Styled } from './styled'

export const RulesList: FC = () => {
  const [rules, setRules] = useState<TSgRule[]>([])
  const [fqdnRules, setFqdnRules] = useState<TFqdnRule[]>([])
  const [error, setError] = useState<TRequestError | undefined>()
  const [deleteError, setDeleteError] = useState<TRequestError | undefined>()
  const [deleteErrorFqdn, setDeleteErrorFqdn] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isModalOpenFqdn, setIsModalOpenFqdn] = useState<boolean>(false)
  const [pendingToDeleteRule, setPendingToDeleteRule] = useState<{ sgFrom: string; sgTo: string }>()
  const [pendingToDeleteFqdnRule, setPendingToDeleteFqdnRule] = useState<{ sgFrom: string; fqdn: string }>()
  const history = useHistory()

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    Promise.all([getRules(), getFqdnRules()])
      .then(([value1, value2]) => {
        setIsLoading(false)
        setRules(value1.data.rules)
        setFqdnRules(value2.data.rules)
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
  }, [])

  const removeRuleFromList = (sgFrom: string, sgTo: string) => {
    removeRule(sgFrom, sgTo)
      .then(() => {
        setRules([...rules].filter(el => el.sgFrom !== sgFrom && el.sgTo !== sgTo))
        setIsModalOpen(false)
        setPendingToDeleteRule(undefined)
        setDeleteError(undefined)
      })
      .catch((error: AxiosError<TRequestErrorData>) => {
        setIsLoading(false)
        if (error.response) {
          setDeleteError({ status: error.response.status, data: error.response.data })
        } else if (error.status) {
          setDeleteError({ status: error.status })
        } else {
          setDeleteError({ status: 'Error while fetching' })
        }
      })
  }

  const removeFqdnRuleFromList = (sg: string, fqdn: string) => {
    removeFqdnRule(sg, fqdn)
      .then(() => {
        setFqdnRules([...fqdnRules].filter(el => el.sgFrom !== sg && el.FQDN !== fqdn))
        setIsModalOpenFqdn(false)
        setPendingToDeleteFqdnRule(undefined)
        setDeleteErrorFqdn(undefined)
      })
      .catch((error: AxiosError<TRequestErrorData>) => {
        setIsLoading(false)
        if (error.response) {
          setDeleteErrorFqdn({ status: error.response.status, data: error.response.data })
        } else if (error.status) {
          setDeleteErrorFqdn({ status: error.status })
        } else {
          setDeleteErrorFqdn({ status: 'Error while fetching' })
        }
      })
  }

  const openRemoveRuleModal = (sgFrom: string, sgTo: string) => {
    setPendingToDeleteRule({ sgFrom, sgTo })
    setIsModalOpen(true)
  }

  const openRemoveFqdnRuleModal = (sgFrom: string, fqdn: string) => {
    setPendingToDeleteFqdnRule({ sgFrom, fqdn })
    setIsModalOpenFqdn(true)
  }

  if (error) {
    return <Result status="error" title={error.status} subTitle={error.data?.message} />
  }
  if (isLoading) {
    return <Spin />
  }

  type TSgRuleColumn = TSgRule & {
    key: string
  }

  const columns: ColumnsType<TSgRuleColumn> = [
    {
      title: 'SG From',
      dataIndex: 'sgFrom',
      key: 'sgFrom',
      width: 150,
    },
    {
      title: 'SG To',
      dataIndex: 'sgTo',
      key: 'sgTo',
      width: 150,
    },
    {
      title: 'Ports',
      dataIndex: 'ports',
      key: 'ports',
      width: 70,
      render: (_, { ports }) => <Styled.PortsContainer>{ports.map(({ s, d }) => `${s} : ${d}`)}</Styled.PortsContainer>,
    },
    {
      title: 'Logs',
      dataIndex: 'logs',
      key: 'logs',
      width: 150,
      render: (_, { logs }) => <div>{logs ? 'true' : 'false'}</div>,
    },
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      width: 150,
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record: TSgRule) => (
        <>
          <EditOutlined onClick={() => history.push(`/rules/edit/${record.sgFrom}/${record.sgTo}`)} />{' '}
          <DeleteOutlined onClick={() => openRemoveRuleModal(record.sgFrom, record.sgTo)} />
        </>
      ),
    },
  ]

  type TFqdnRuleColumn = TFqdnRule & {
    key: string
  }

  const columnsFqdn: ColumnsType<TFqdnRuleColumn> = [
    {
      title: 'SG From',
      dataIndex: 'sgFrom',
      key: 'sgFrom',
      width: 150,
    },
    {
      title: 'FQDN',
      dataIndex: 'FQDN',
      key: 'FQDN',
      width: 150,
    },
    {
      title: 'Ports',
      dataIndex: 'ports',
      key: 'ports',
      width: 70,
      render: (_, { ports }) => <div>{ports.map(({ s, d }) => `${s} - ${d}`)}</div>,
    },
    {
      title: 'Logs',
      dataIndex: 'logs',
      key: 'logs',
      width: 150,
      render: (_, { logs }) => <div>{logs ? 'true' : 'false'}</div>,
    },
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      width: 150,
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record: TFqdnRule) => (
        <>
          <EditOutlined onClick={() => history.push(`/rules/edit/${record.sgFrom}/${record.FQDN}`)} />{' '}
          <DeleteOutlined onClick={() => openRemoveFqdnRuleModal(record.sgFrom, record.FQDN)} />
        </>
      ),
    },
  ]

  return (
    <>
      <Card>
        <TitleWithNoTopMargin level={2}>Rules</TitleWithNoTopMargin>
        <Spacer $space={15} $samespace />
        <Button type="primary" onClick={() => history.push('/rules/editor')}>
          Editor
        </Button>
        <Spacer $space={25} $samespace />
        <TitleWithNoTopMargin level={3}>SG-to-SG Rules</TitleWithNoTopMargin>
        {!rules.length && !error && !isLoading && <Empty />}
        <Table
          pagination={{
            position: ['bottomCenter'],
            showQuickJumper: true,
            showSizeChanger: false,
            defaultPageSize: ITEMS_PER_PAGE,
          }}
          dataSource={rules.map(row => ({ ...row, key: `${row.sgFrom}${row.sgTo}` }))}
          columns={columns}
          scroll={{ x: 'max-content' }}
        />
        <Spacer $space={15} $samespace />
        <TitleWithNoTopMargin level={3}>SG-to-FQDN Rules</TitleWithNoTopMargin>
        {!fqdnRules.length && !error && !isLoading && <Empty />}
        <Table
          pagination={{
            position: ['bottomCenter'],
            showQuickJumper: true,
            showSizeChanger: false,
            defaultPageSize: ITEMS_PER_PAGE,
          }}
          dataSource={fqdnRules.map(row => ({ ...row, key: `${row.sgFrom}${row.FQDN}` }))}
          columns={columnsFqdn}
          scroll={{ x: 'max-content' }}
        />
      </Card>
      <Modal
        title="Delete rule"
        open={isModalOpen}
        onOk={() => pendingToDeleteRule && removeRuleFromList(pendingToDeleteRule.sgFrom, pendingToDeleteRule.sgTo)}
        confirmLoading={isLoading}
        onCancel={() => {
          setIsModalOpen(false)
          setDeleteError(undefined)
        }}
      >
        <p>
          Are you sure you want to delete rule: {pendingToDeleteRule?.sgFrom} - {pendingToDeleteRule?.sgTo}
        </p>
        {deleteError && <Result status="error" title={deleteError.status} subTitle={deleteError.data?.message} />}
      </Modal>
      <Modal
        title="Delete fqdn rule"
        open={isModalOpenFqdn}
        onOk={() =>
          pendingToDeleteFqdnRule &&
          removeFqdnRuleFromList(pendingToDeleteFqdnRule.sgFrom, pendingToDeleteFqdnRule.fqdn)
        }
        confirmLoading={isLoading}
        onCancel={() => {
          setIsModalOpenFqdn(false)
          setDeleteErrorFqdn(undefined)
        }}
      >
        <p>
          Are you sure you want to delete fqdn rule: {pendingToDeleteFqdnRule?.sgFrom} - {pendingToDeleteFqdnRule?.fqdn}
        </p>
        {deleteErrorFqdn && (
          <Result status="error" title={deleteErrorFqdn.status} subTitle={deleteErrorFqdn.data?.message} />
        )}
      </Modal>
    </>
  )
}
