/* eslint-disable react/no-unstable-nested-components */
import React, { FC, Key, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { Button, Popover, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { TooltipPlacement } from 'antd/es/tooltip'
import { SearchOutlined } from '@ant-design/icons'
import ipRangeCheck from 'ip-range-check'
import { ShortenedTextWithTooltip, ThWhiteSpaceNoWrap } from 'components/atoms'
import { DEFAULT_PRIORITIES, STATUSES } from 'constants/rules'
import { TFormSgCidrRule, TTraffic } from 'localTypes/rules'
import { EditPopover } from '../../../atoms'
import { getRowSelection, getDefaultTableProps } from '../utils'
import { edit, remove, restore } from '../utilsEditRemoveRestoreRules/SgCidr'
import { FilterDropdown, ActionCell, LogsCell, TraceCell, TransportCell, PortsCell } from '../atoms'
import { Styled } from '../styled'

type TSgCidrTableProps = {
  isChangesMode: boolean
  defaultTraffic: TTraffic
  rulesData: TFormSgCidrRule[]
  rulesAll: TFormSgCidrRule[]
  setRules: ActionCreatorWithPayload<TFormSgCidrRule[]>
  setEditOpen: Dispatch<SetStateAction<boolean[]>>
  editOpen: boolean[]
  popoverPosition: TooltipPlacement
  isDisabled?: boolean
  isRestoreButtonActive?: boolean
  forceArrowsUpdate?: () => void
}

type TColumn = TFormSgCidrRule & { key: string }

export const SgCidrTable: FC<TSgCidrTableProps> = ({
  isChangesMode,
  defaultTraffic,
  rulesData,
  rulesAll,
  setRules,
  setEditOpen,
  editOpen,
  popoverPosition,
  isDisabled,
  isRestoreButtonActive,
  forceArrowsUpdate,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const dispatch = useDispatch()

  useEffect(() => {
    setEditOpen(
      Array(rulesData.filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted).length).fill(false),
    )
  }, [rulesData, setEditOpen])

  const toggleEditPopover = (index: number) => {
    const newEditOpen = [...editOpen]
    newEditOpen[index] = !newEditOpen[index]
    setEditOpen(newEditOpen)
  }

  const editRule = (oldValues: TFormSgCidrRule, values: TFormSgCidrRule) => {
    edit(dispatch, rulesAll, setRules, defaultTraffic, oldValues, values, toggleEditPopover)
  }

  const removeRule = (oldValues: TFormSgCidrRule) => {
    remove(dispatch, rulesAll, setRules, defaultTraffic, oldValues, editOpen, setEditOpen, toggleEditPopover)
  }

  const restoreRule = (oldValues: TFormSgCidrRule) => {
    restore(dispatch, rulesAll, setRules, defaultTraffic, oldValues)
  }

  const columns: ColumnsType<TColumn> = [
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 25,
      render: (_, { action, formChanges }) => <ActionCell action={action} formChanges={formChanges} />,
    },
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      width: 50,
      render: (_, { transport, formChanges }) => <TransportCell transport={transport} formChanges={formChanges} />,
      sorter: (a, b) => {
        if (a.transport === b.transport) {
          return 0
        }
        return a.transport === 'TCP' ? -1 : 1
      },
    },
    {
      title: 'CIDR',
      dataIndex: 'cidr',
      key: 'cidr',
      width: 150,
      render: (_, { cidr, formChanges }) => (
        <Styled.RulesEntrySgs $modified={formChanges?.modifiedFields?.includes('cidr')} className="no-scroll">
          <ShortenedTextWithTooltip text={cidr} />
        </Styled.RulesEntrySgs>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <FilterDropdown
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          close={close}
          setSearchText={setSearchText}
        />
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
      onFilter: (value, { cidr }) => ipRangeCheck(value as string, cidr),
    },

    {
      title: 'Logs',
      dataIndex: 'logs',
      key: 'logs',
      width: 50,
      render: (_, { logs, formChanges }) => <LogsCell logs={logs} formChanges={formChanges} />,
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
      width: 50,
      render: (_, { trace, formChanges }) => <TraceCell trace={trace} formChanges={formChanges} />,
      sorter: (a, b) => {
        if (a.trace === b.trace) {
          return 0
        }
        return a.trace ? -1 : 1
      },
    },
    {
      title: 'Priority',
      key: 'prioritySome',
      dataIndex: 'prioritySome',
      width: 25,
      render: (_, { prioritySome, formChanges }) => (
        <Styled.RulesEntryPorts $modified={formChanges?.modifiedFields?.includes('prioritySome')} className="no-scroll">
          {prioritySome || DEFAULT_PRIORITIES.sgToCidrIe}
        </Styled.RulesEntryPorts>
      ),
    },
    {
      title: 'Ports Src',
      key: 'portsSource',
      dataIndex: 'portsSource',
      width: 50,
      render: (_, { portsSource, formChanges }) => (
        <PortsCell port={portsSource} changesMarker="portsSource" formChanges={formChanges} />
      ),
    },
    {
      title: 'Ports Dst',
      key: 'portsDestination',
      dataIndex: 'portsDestination',
      width: 50,
      render: (_, { portsDestination, formChanges }) => (
        <Styled.RulesEntryPorts
          $modified={formChanges?.modifiedFields?.includes('portsDestination')}
          className="no-scroll"
        >
          {!portsDestination || portsDestination.length === 0 ? (
            'any'
          ) : (
            <ShortenedTextWithTooltip text={portsDestination} />
          )}
        </Styled.RulesEntryPorts>
      ),
    },
    {
      title: 'Controls',
      key: 'controls',
      width: 50,
      render: (_, oldValues, index) => (
        <>
          {isRestoreButtonActive && (
            <Button type="dashed" onClick={() => restoreRule(oldValues)}>
              Restore
            </Button>
          )}
          <Popover
            content={
              <EditSgCidrPopover
                values={oldValues}
                remove={() => removeRule(oldValues)}
                hide={() => toggleEditPopover(index)}
                edit={values => editRule(oldValues, values)}
                isDisabled={isDisabled}
              />
            }
            title="CIDR-SG"
            trigger="click"
            open={editOpen[index]}
            onOpenChange={() => toggleEditPopover(index)}
            placement={popoverPosition}
            className="no-scroll"
          >
            <Button type="primary">Edit</Button>
          </Popover>
        </>
      ),
    },
  ]

  const dataSource = isChangesMode
    ? rulesData.map(row => ({
        ...row,
        key: `${row.cidr.toLocaleString()}-${row.portsSource}-${row.portsDestination}-${row.transport}`,
      }))
    : rulesData
        .filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted)
        .map(row => ({
          ...row,
          key: `${row.cidr.toLocaleString()}-${row.portsSource}-${row.portsDestination}-${row.transport}`,
        }))

  const rowSelection = getRowSelection<TFormSgCidrRule, TColumn>(
    dispatch,
    isChangesMode,
    selectedRowKeys,
    dataSource,
    setRules,
    rulesAll,
    setSelectedRowKeys,
  )

  const defaultTableProps = getDefaultTableProps(forceArrowsUpdate)

  return (
    <ThWhiteSpaceNoWrap>
      <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} {...defaultTableProps} />
    </ThWhiteSpaceNoWrap>
  )
}
