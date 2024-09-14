/* eslint-disable react/no-unstable-nested-components */
import React, { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { Table, TableProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ipRangeCheck from 'ip-range-check'
import { DEFAULT_PRIORITIES, STATUSES } from 'constants/rules'
import { TFormSgCidrRule } from 'localTypes/rules'
import { CustomMiddleSwitch, TableComponents, ShortenedTextWithTooltip, ThWhiteSpaceNoWrap } from 'components'
import { getDefaultTableProps } from '../utils'
import { ActionCell, PortsCell } from '../atoms'
import { Styled } from '../styled'

type TSgCidrTableProps = {
  rulesData: TFormSgCidrRule[]
}

type TColumn = TFormSgCidrRule & { key: string }

type OnChange = NonNullable<TableProps<TColumn>['onChange']>

type Filters = Parameters<OnChange>[1]

export const SgCidrTable: FC<TSgCidrTableProps> = ({ rulesData }) => {
  const theme = useSelector((state: RootState) => state.theme.theme)
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})

  const searchText = useSelector((state: RootState) => state.searchText.searchText)

  useEffect(() => {
    setFilteredInfo({ name: searchText ? [searchText] : null })
  }, [searchText])

  const columns: ColumnsType<TColumn> = [
    {
      title: 'CIDR',
      dataIndex: 'cidr',
      key: 'cidr',
      render: (_, { cidr }) => (
        <Styled.RulesEntrySg className="no-scroll">
          <ShortenedTextWithTooltip text={cidr} />
        </Styled.RulesEntrySg>
      ),
      filteredValue: filteredInfo.name || null,
      onFilter: (value, { cidr }) =>
        ipRangeCheck(value as string, cidr) || cidr.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Priority',
      key: 'prioritySome',
      dataIndex: 'prioritySome',
      render: (_, { prioritySome }) => {
        if (!!prioritySome || prioritySome === 0) {
          return prioritySome
        }
        return DEFAULT_PRIORITIES.sgToSg
      },
    },
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      sorter: (a, b) => {
        if (a.transport === b.transport) {
          return 0
        }
        return a.transport === 'TCP' ? -1 : 1
      },
    },
    {
      title: 'Ports Source/Destination',
      key: 'ports',
      dataIndex: 'ports',
      render: (_, { ports }) => <PortsCell ports={ports} />,
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, { action }) => <ActionCell action={action} />,
    },
    {
      title: 'Logs',
      dataIndex: 'logs',
      key: 'logs',
      render: (_, record) => <CustomMiddleSwitch value={record.logs} disabled />,
      sorter: (a, b) => {
        if (a.logs === b.logs) {
          return 0
        }
        return a.logs ? -1 : 1
      },
    },
    {
      title: 'Trace',
      dataIndex: 'trace',
      key: 'trace',
      render: (_, record) => <CustomMiddleSwitch value={record.trace} disabled />,
      sorter: (a, b) => {
        if (a.trace === b.trace) {
          return 0
        }
        return a.trace ? -1 : 1
      },
    },
  ]

  const dataSource = rulesData
    .filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted)
    .map(row => ({
      ...row,
      key: `${row.cidr.toLocaleString()}-${row.transport}`,
    }))

  const defaultTableProps = getDefaultTableProps()

  return (
    <ThWhiteSpaceNoWrap>
      <TableComponents.TableContainerRules $isDark={theme === 'dark'}>
        <TableComponents.HideableControls>
          <Table dataSource={dataSource} columns={columns} {...defaultTableProps} />
        </TableComponents.HideableControls>
      </TableComponents.TableContainerRules>
    </ThWhiteSpaceNoWrap>
  )
}