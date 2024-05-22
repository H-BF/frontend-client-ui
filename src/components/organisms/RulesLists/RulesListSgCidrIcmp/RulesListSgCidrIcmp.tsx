/* eslint-disable max-lines-per-function */
import React, { FC, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Card, Table, TableProps, Button, Result, Spin, Empty, Modal, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined, CheckOutlined, CloseOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { TitleWithNoTopMargin, Spacer, CustomIcons, TextAlignContainer } from 'components'
import { getSgCidrIcmpRules, removeSgCidrIcmpRule } from 'api/rules'
import { DEFAULT_PRIORITIES, ITEMS_PER_PAGE } from 'constants/rules'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { TSgCidrIcmpRule } from 'localTypes/rules'
import { Styled } from './styled'

type TCidrSgIcmpRuleColumn = TSgCidrIcmpRule & {
  key: string
}

type OnChange = NonNullable<TableProps<TCidrSgIcmpRuleColumn>['onChange']>

type Filters = Parameters<OnChange>[1]

export const RulesListSgCidrIcmp: FC = () => {
  const [cidrSgIcmpRules, setCidrSgIcmpRules] = useState<TSgCidrIcmpRule[]>([])
  const [error, setError] = useState<TRequestError | undefined>()
  const [deleteErrorCidrSgIcmp, setDeleteErrorCidrSgIcmp] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isModalOpenCidrSgIcmp, setIsModalOpenCidrSgIcmp] = useState<boolean>(false)
  const [pendingToDeleteCidrSgIcmpRule, setPendingToDeleteCidrSgIcmpRule] = useState<{ sg: string; cidr: string }>()
  const [searchText, setSearchText] = useState('')
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const history = useHistory()

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    getSgCidrIcmpRules()
      .then(({ data }) => {
        setIsLoading(false)
        setCidrSgIcmpRules(data.rules)
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

  const removeCidrSgIcmpRuleFromList = (sg: string, cidr: string) => {
    removeSgCidrIcmpRule(sg, cidr)
      .then(() => {
        setCidrSgIcmpRules([...cidrSgIcmpRules].filter(el => el.SG !== sg || el.CIDR !== cidr))
        setIsModalOpenCidrSgIcmp(false)
        setPendingToDeleteCidrSgIcmpRule(undefined)
        setDeleteErrorCidrSgIcmp(undefined)
      })
      .catch((error: AxiosError<TRequestErrorData>) => {
        setIsLoading(false)
        if (error.response) {
          setDeleteErrorCidrSgIcmp({ status: error.response.status, data: error.response.data })
        } else if (error.status) {
          setDeleteErrorCidrSgIcmp({ status: error.status })
        } else {
          setDeleteErrorCidrSgIcmp({ status: 'Error while fetching' })
        }
      })
  }

  const openRemoveCidrSgIcmpRuleModal = (sg: string, cidr: string) => {
    setPendingToDeleteCidrSgIcmpRule({ sg, cidr })
    setIsModalOpenCidrSgIcmp(true)
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

  const columnsSgSgIeIcmp: ColumnsType<TCidrSgIcmpRuleColumn> = [
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
      dataIndex: 'SG',
      key: 'SG',
      width: 150,
      filteredValue: filteredInfo.name || null,
      onFilter: (value, { SG }) => SG.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'CIDR',
      dataIndex: 'CIDR',
      key: 'CIDR',
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
      render: (_, { priority }) => priority?.some || DEFAULT_PRIORITIES.sgToCidrIeIcmp,
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
      width: 100,
      render: (_, record: TSgCidrIcmpRule) => (
        <TextAlignContainer $align="center">
          <CustomIcons.EditIcon onClick={() => history.push(`/rules/editor/${record.SG}`)} />
          <CustomIcons.DeleteIcon onClick={() => openRemoveCidrSgIcmpRuleModal(record.SG, record.CIDR)} />
        </TextAlignContainer>
      ),
    },
  ]

  return (
    <>
      <Card>
        <TitleWithNoTopMargin level={2}>Rules: CIDR-ICMP</TitleWithNoTopMargin>
        <Spacer $space={15} $samespace />
        <Styled.FiltersContainer>
          <div>
            <Input
              allowClear
              placeholder="Filter by SG name"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onPressEnter={() => handleSearch(searchText)}
            />
          </div>
          <div>
            <Styled.ButtonWithMarginLeft
              onClick={() => handleSearch(searchText)}
              icon={<SearchOutlined />}
              type="primary"
            />
          </div>
        </Styled.FiltersContainer>
        <Spacer $space={15} $samespace />
        {!cidrSgIcmpRules.length && !error && !isLoading && <Empty />}
        {cidrSgIcmpRules.length > 0 && (
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
            dataSource={cidrSgIcmpRules.map(row => ({ ...row, key: `${row.SG}${row.CIDR}` }))}
            columns={columnsSgSgIeIcmp}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        )}
        <Spacer $space={15} $samespace />
        <Button type="primary" onClick={() => history.push('/rules/editor')}>
          Add
        </Button>
      </Card>
      <Modal
        title="Delete sgSgIeIcmp rule"
        open={isModalOpenCidrSgIcmp}
        onOk={() =>
          pendingToDeleteCidrSgIcmpRule &&
          removeCidrSgIcmpRuleFromList(pendingToDeleteCidrSgIcmpRule.sg, pendingToDeleteCidrSgIcmpRule.cidr)
        }
        confirmLoading={isLoading}
        onCancel={() => {
          setIsModalOpenCidrSgIcmp(false)
          setDeleteErrorCidrSgIcmp(undefined)
        }}
      >
        <p>
          Are you sure you want to delete sgSgIeIcmp rule: {pendingToDeleteCidrSgIcmpRule?.sg} -{' '}
          {pendingToDeleteCidrSgIcmpRule?.cidr}
        </p>
        {deleteErrorCidrSgIcmp && (
          <Result status="error" title={deleteErrorCidrSgIcmp.status} subTitle={deleteErrorCidrSgIcmp.data?.message} />
        )}
      </Modal>
    </>
  )
}