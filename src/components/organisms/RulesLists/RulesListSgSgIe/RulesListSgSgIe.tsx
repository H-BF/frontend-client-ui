/* eslint-disable max-lines-per-function */
import React, { FC, useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { useHistory } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Card, Table, TableProps, Button, Result, Spin, Empty, Modal, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckOutlined, CloseOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { TitleWithNoTopMargin, Spacer, CustomIcons, TextAlignContainer } from 'components'
import { getSgSgIeRules, deleteRules } from 'api/rules'
import { DEFAULT_PRIORITIES, ITEMS_PER_PAGE } from 'constants/rules'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { TSgSgIeRule } from 'localTypes/rules'
import { Styled } from './styled'

type TSgSgIeRuleWithId = TSgSgIeRule & { id: string }

type TSgSgIeRuleColumn = TSgSgIeRuleWithId & {
  key: string
}

type OnChange = NonNullable<TableProps<TSgSgIeRuleColumn>['onChange']>

type Filters = Parameters<OnChange>[1]

export const RulesListSgSgIe: FC = () => {
  const [sgSgIeRules, setSgSgIeRules] = useState<TSgSgIeRuleWithId[]>([])
  const [error, setError] = useState<TRequestError | undefined>()
  const [deleteErrorSgSgIe, setDeleteErrorSgSgIe] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isModalOpenSgSgIe, setIsModalOpenSgSgIe] = useState<boolean>(false)
  const [pendingToDeleteSgSgIeRule, setPendingToDeleteSgSgIeRule] = useState<TSgSgIeRuleWithId>()
  const [searchText, setSearchText] = useState('')
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const history = useHistory()

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    getSgSgIeRules()
      .then(({ data }) => {
        setIsLoading(false)
        setSgSgIeRules(data.rules.map(entry => ({ ...entry, id: nanoid() })))
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

  const removeSgSgIeRuleFromList = (id: string) => {
    deleteRules(
      [],
      [],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [...sgSgIeRules].filter(el => el.id === id).map(({ id, ...entry }) => entry),
      [],
      [],
      [],
      [],
    )
      .then(() => {
        setSgSgIeRules([...sgSgIeRules].filter(el => el.id !== id))
        setIsModalOpenSgSgIe(false)
        setPendingToDeleteSgSgIeRule(undefined)
        setDeleteErrorSgSgIe(undefined)
      })
      .catch((error: AxiosError<TRequestErrorData>) => {
        setIsLoading(false)
        if (error.response) {
          setDeleteErrorSgSgIe({ status: error.response.status, data: error.response.data })
        } else if (error.status) {
          setDeleteErrorSgSgIe({ status: error.status })
        } else {
          setDeleteErrorSgSgIe({ status: 'Error while fetching' })
        }
      })
  }

  const openRemoveSgSgIeRuleModal = (record: TSgSgIeRuleWithId) => {
    setPendingToDeleteSgSgIeRule(record)
    setIsModalOpenSgSgIe(true)
  }

  if (error) {
    return <Result status="error" title={error.status} subTitle={error.data?.message} />
  }

  if (isLoading) {
    return <Spin />
  }

  const handleSearch = (searchText: string) => {
    setFilteredInfo({ name: searchText ? [searchText] : null })
  }

  const columnsSgSgIe: ColumnsType<TSgSgIeRuleColumn> = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 50,
      render: (_, { action }) => {
        return action === 'ACCEPT' ? (
          <LikeOutlined style={{ color: 'green' }} />
        ) : (
          <DislikeOutlined style={{ color: 'red' }} />
        )
      },
    },
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      width: 50,
    },
    {
      title: 'SG',
      dataIndex: 'Sg',
      key: 'Sg',
      width: 150,
      filteredValue: filteredInfo.name || null,
      onFilter: (value, { Sg }) => Sg.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'SG Local',
      dataIndex: 'SgLocal',
      key: 'SgLocal',
      width: 150,
    },
    {
      title: 'Logs',
      dataIndex: 'logs',
      key: 'logs',
      width: 50,
      render: (_, { logs }) => {
        return logs ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />
      },
    },
    {
      title: 'Trace',
      dataIndex: 'trace',
      key: 'trace',
      width: 50,
      render: (_, { trace }) => {
        return trace ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 50,
      render: (_, { priority }) => priority?.some || DEFAULT_PRIORITIES.sgToSgIe,
    },
    {
      title: 'Ports',
      dataIndex: 'ports',
      key: 'ports',
      width: 50,
      render: (_, { ports }) => (
        <Styled.PortsContainer>
          {ports?.length === 0 ? (
            <div>any : any</div>
          ) : (
            ports?.map(({ s, d }) => <div key={`${s}-${d}`}>{`${s || 'any'} : ${d || 'any'}`}</div>)
          )}
        </Styled.PortsContainer>
      ),
    },
    {
      title: 'Traffic',
      dataIndex: 'traffic',
      key: 'traffic',
      width: 100,
    },
    {
      title: 'Controls',
      key: 'controls',
      width: 100,
      render: (_, record: TSgSgIeRuleWithId) => (
        <TextAlignContainer $align="center">
          <CustomIcons.EditIcon onClick={() => history.push(`/rules-editor/${record.SgLocal}`)} />
          <CustomIcons.DeleteIcon onClick={() => openRemoveSgSgIeRuleModal(record)} />
        </TextAlignContainer>
      ),
    },
  ]

  return (
    <>
      <Card>
        <TitleWithNoTopMargin level={2}>Rules: SG-SG-IE</TitleWithNoTopMargin>
        <Spacer $space={15} $samespace />
        <Styled.FiltersContainer>
          {sgSgIeRules.length > 0 && (
            <div>
              <Input
                allowClear
                placeholder="Filter by SG name"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onBlur={() => handleSearch(searchText)}
                onPressEnter={() => handleSearch(searchText)}
              />
            </div>
          )}
        </Styled.FiltersContainer>
        <Spacer $space={15} $samespace />
        {!sgSgIeRules.length && !error && !isLoading && <Empty />}
        {sgSgIeRules.length > 0 && (
          <Table
            pagination={{
              position: ['bottomCenter'],
              showQuickJumper: {
                goButton: <Styled.ButtonWithMarginLeft size="small">Go</Styled.ButtonWithMarginLeft>,
              },
              showSizeChanger: false,
              defaultPageSize: ITEMS_PER_PAGE,
              hideOnSinglePage: true,
            }}
            dataSource={sgSgIeRules.map(row => ({ ...row, key: `${row.Sg}${row.SgLocal}` }))}
            columns={columnsSgSgIe}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        )}
        <Spacer $space={15} $samespace />
        <Button type="primary" onClick={() => history.push('/rules-editor')}>
          Add
        </Button>
      </Card>
      <Modal
        title="Delete sgSgIe rule"
        open={isModalOpenSgSgIe}
        onOk={() => pendingToDeleteSgSgIeRule && removeSgSgIeRuleFromList(pendingToDeleteSgSgIeRule.id)}
        confirmLoading={isLoading}
        onCancel={() => {
          setIsModalOpenSgSgIe(false)
          setDeleteErrorSgSgIe(undefined)
        }}
      >
        <p>
          Are you sure you want to delete sgSgIe rule: {pendingToDeleteSgSgIeRule?.SgLocal} -{' '}
          {pendingToDeleteSgSgIeRule?.Sg}
        </p>
        {deleteErrorSgSgIe && (
          <Result status="error" title={deleteErrorSgSgIe.status} subTitle={deleteErrorSgSgIe.data?.message} />
        )}
      </Modal>
    </>
  )
}
