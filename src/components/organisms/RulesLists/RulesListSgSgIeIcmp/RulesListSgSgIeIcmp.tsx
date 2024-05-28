/* eslint-disable max-lines-per-function */
import React, { FC, useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { useHistory } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Card, Table, TableProps, Result, Spin, Empty, Modal, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckOutlined, CloseOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { TitleWithNoTopMargin, Spacer, CustomIcons, TextAlignContainer } from 'components'
import { getSgSgIeIcmpRules, deleteRules } from 'api/rules'
import { DEFAULT_PRIORITIES, ITEMS_PER_PAGE } from 'constants/rules'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { TSgSgIeIcmpRule } from 'localTypes/rules'
import { Styled } from './styled'

type TSgSgIeIcmpRuleWithId = TSgSgIeIcmpRule & { id: string }

type TSgSgIeIcmpRuleColumn = TSgSgIeIcmpRuleWithId & {
  key: string
}

type OnChange = NonNullable<TableProps<TSgSgIeIcmpRuleColumn>['onChange']>

type Filters = Parameters<OnChange>[1]

export const RulesListSgSgIeIcmp: FC = () => {
  const [sgSgIeIcmpRules, setSgSgIeIcmpRules] = useState<TSgSgIeIcmpRuleWithId[]>([])
  const [error, setError] = useState<TRequestError | undefined>()
  const [deleteErrorSgSgIeIcmp, setDeleteErrorSgSgIeIcmp] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isModalOpenSgSgIeIcmp, setIsModalOpenSgSgIeIcmp] = useState<boolean>(false)
  const [pendingToDeleteSgSgIeIcmpRule, setPendingToDeleteSgSgIeIcmpRule] = useState<TSgSgIeIcmpRuleWithId>()
  const [searchText, setSearchText] = useState('')
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const history = useHistory()

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    getSgSgIeIcmpRules()
      .then(({ data }) => {
        setIsLoading(false)
        setSgSgIeIcmpRules(data.rules.map(entry => ({ ...entry, id: nanoid() })))
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

  const removeSgSgIeIcmpRuleFromList = (id: string) => {
    deleteRules(
      [],
      [],
      [],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [...sgSgIeIcmpRules].filter(el => el.id === id).map(({ id, ...entry }) => entry),
      [],
      [],
      [],
    )
      .then(() => {
        setSgSgIeIcmpRules([...sgSgIeIcmpRules].filter(el => el.id !== id))
        setIsModalOpenSgSgIeIcmp(false)
        setPendingToDeleteSgSgIeIcmpRule(undefined)
        setDeleteErrorSgSgIeIcmp(undefined)
      })
      .catch((error: AxiosError<TRequestErrorData>) => {
        setIsLoading(false)
        if (error.response) {
          setDeleteErrorSgSgIeIcmp({ status: error.response.status, data: error.response.data })
        } else if (error.status) {
          setDeleteErrorSgSgIeIcmp({ status: error.status })
        } else {
          setDeleteErrorSgSgIeIcmp({ status: 'Error while fetching' })
        }
      })
  }

  const openRemoveSgSgIeIcmpRuleModal = (record: TSgSgIeIcmpRuleWithId) => {
    setPendingToDeleteSgSgIeIcmpRule(record)
    setIsModalOpenSgSgIeIcmp(true)
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

  const columnsSgSgIeIcmp: ColumnsType<TSgSgIeIcmpRuleColumn> = [
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
      title: 'ICMP',
      dataIndex: 'ICMP',
      key: 'ICMP',
      width: 50,
      render: (_, { ICMP }) => ICMP.IPv,
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
      render: (_, { priority }) => priority?.some || DEFAULT_PRIORITIES.sgToSgIeIcmp,
    },
    {
      title: 'Types',
      dataIndex: 'ICMP',
      key: 'Types',
      width: 50,
      render: (_, { ICMP }) => ICMP.Types.join(','),
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
      align: 'right',
      width: 100,
      render: (_, record: TSgSgIeIcmpRuleWithId) => (
        <TextAlignContainer $align="right">
          <CustomIcons.EditIcon onClick={() => history.push(`/rules-editor/${record.SgLocal}`)} />
          <CustomIcons.DeleteIcon onClick={() => openRemoveSgSgIeIcmpRuleModal(record)} />
        </TextAlignContainer>
      ),
    },
  ]

  return (
    <>
      <Card>
        <TitleWithNoTopMargin level={2}>Rules: SG-SG-IE-ICMP</TitleWithNoTopMargin>
        <Spacer $space={15} $samespace />
        <Styled.FiltersContainer>
          {sgSgIeIcmpRules.length > 0 && (
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
          <div>
            <Styled.ButtonWithMarginLeft type="primary" onClick={() => history.push('/rules-editor')}>
              Add
            </Styled.ButtonWithMarginLeft>
          </div>
        </Styled.FiltersContainer>
        <Spacer $space={15} $samespace />
        {!sgSgIeIcmpRules.length && !error && !isLoading && <Empty />}
        {sgSgIeIcmpRules.length > 0 && (
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
            dataSource={sgSgIeIcmpRules.map(row => ({ ...row, key: `${row.Sg}${row.SgLocal}` }))}
            columns={columnsSgSgIeIcmp}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        )}
      </Card>
      <Modal
        title="Delete sgSgIeIcmp rule"
        open={isModalOpenSgSgIeIcmp}
        onOk={() => pendingToDeleteSgSgIeIcmpRule && removeSgSgIeIcmpRuleFromList(pendingToDeleteSgSgIeIcmpRule.id)}
        confirmLoading={isLoading}
        onCancel={() => {
          setIsModalOpenSgSgIeIcmp(false)
          setDeleteErrorSgSgIeIcmp(undefined)
        }}
      >
        <p>
          Are you sure you want to delete sgSgIeIcmp rule: {pendingToDeleteSgSgIeIcmpRule?.SgLocal} -{' '}
          {pendingToDeleteSgSgIeIcmpRule?.Sg}
        </p>
        {deleteErrorSgSgIeIcmp && (
          <Result status="error" title={deleteErrorSgSgIeIcmp.status} subTitle={deleteErrorSgSgIeIcmp.data?.message} />
        )}
      </Modal>
    </>
  )
}
