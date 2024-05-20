/* eslint-disable max-lines-per-function */
/* eslint-disable react/no-unstable-nested-components */
import React, { FC, Key, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { Button, Popover, Tooltip, Table, Input, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import { TooltipPlacement } from 'antd/es/tooltip'
import { CheckOutlined, CloseOutlined, SearchOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { ShortenedTextWithTooltip, ThWhiteSpaceNoWrap } from 'components/atoms'
import { DEFAULT_PRIORITIES, STATUSES } from 'constants/rules'
import { TFormSgSgIcmpRule } from 'localTypes/rules'
import { EditSgSgIcmpPopover } from '../../../atoms'
import { getRowSelection, getDefaultTableProps, getModifiedFieldsInSgSgIcmpRule } from '../utils'
import { Styled } from '../styled'
import { findSgSgIcmpPair } from '../utils/legacyFindPair'

type TSgSgIcmpTableProps = {
  isChangesMode: boolean
  popoverPosition: TooltipPlacement
  rulesData: TFormSgSgIcmpRule[]
  rulesAll: TFormSgSgIcmpRule[]
  setRules: ActionCreatorWithPayload<TFormSgSgIcmpRule[]>
  rulesOtherside: TFormSgSgIcmpRule[]
  setRulesOtherside: ActionCreatorWithPayload<TFormSgSgIcmpRule[]>
  editOpen: boolean[]
  setEditOpen: Dispatch<SetStateAction<boolean[]>>
  centerSg?: string
  isDisabled?: boolean
  isRestoreButtonActive?: boolean
  forceArrowsUpdate?: () => void
}

export const SgSgIcmpTable: FC<TSgSgIcmpTableProps> = ({
  isChangesMode,
  popoverPosition,
  rulesData,
  rulesAll,
  setRules,
  rulesOtherside,
  setRulesOtherside,
  editOpen,
  setEditOpen,
  centerSg,
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

  /* remove newSgRulesOtherside as legacy after only ie-sg-sg will remain */
  const editRule = (oldValues: TFormSgSgIcmpRule, values: TFormSgSgIcmpRule) => {
    const newSgSgIcmpRules = [...rulesAll]
    const index = newSgSgIcmpRules.findIndex(({ id }) => id === oldValues.id)
    const newSgSgIcmpRulesOtherside = [...rulesOtherside]
    /* legacy */
    const newSgSgSgIcmpRulesOthersideIndex = findSgSgIcmpPair(centerSg, newSgSgIcmpRules[index], rulesOtherside)
    if (newSgSgIcmpRules[index].formChanges?.status === STATUSES.new) {
      newSgSgIcmpRules[index] = {
        ...values,
        formChanges: { status: STATUSES.new },
      }
      newSgSgIcmpRulesOtherside[newSgSgSgIcmpRulesOthersideIndex] = {
        ...values,
        formChanges: { status: STATUSES.new },
      }
    } else {
      const modifiedFields = getModifiedFieldsInSgSgIcmpRule(newSgSgIcmpRules[index], values)
      if (modifiedFields.length === 0) {
        newSgSgIcmpRules[index] = { ...values }
        newSgSgIcmpRulesOtherside[newSgSgSgIcmpRulesOthersideIndex] = {
          ...values,
        }
      } else {
        newSgSgIcmpRules[index] = {
          ...values,
          formChanges: { status: STATUSES.modified, modifiedFields },
        }
        newSgSgIcmpRulesOtherside[newSgSgSgIcmpRulesOthersideIndex] = {
          ...values,
          formChanges: { status: STATUSES.modified, modifiedFields },
        }
      }
    }
    dispatch(setRules(newSgSgIcmpRules))
    dispatch(setRulesOtherside(newSgSgIcmpRulesOtherside))
    toggleEditPopover(index)
  }

  /* remove newSgRulesOtherside as legacy after only ie-sg-sg will remain */
  const removeRule = (oldValues: TFormSgSgIcmpRule) => {
    const newSgSgIcmpRules = [...rulesAll]
    const index = newSgSgIcmpRules.findIndex(({ id }) => id === oldValues.id)
    const newSgSgIcmpRulesOtherside = [...rulesOtherside]
    /* legacy */
    const newSgSgSgIcmpRulesOthersideIndex = rulesOtherside.findIndex(
      ({ sg, IPv, types, logs, trace, action, prioritySome }) =>
        sg === centerSg &&
        IPv === newSgSgIcmpRules[index].IPv &&
        JSON.stringify(types.sort()) === JSON.stringify(newSgSgIcmpRules[index].types.sort()) &&
        logs === newSgSgIcmpRules[index].logs &&
        trace === newSgSgIcmpRules[index].trace &&
        action === newSgSgIcmpRules[index].action &&
        prioritySome === newSgSgIcmpRules[index].prioritySome,
    )
    const newEditOpenRules = [...editOpen]
    if (newSgSgIcmpRules[index].formChanges?.status === STATUSES.new) {
      dispatch(setRules([...newSgSgIcmpRules.slice(0, index), ...newSgSgIcmpRules.slice(index + 1)]))
      dispatch(
        setRulesOtherside([
          ...newSgSgIcmpRulesOtherside.slice(0, newSgSgSgIcmpRulesOthersideIndex),
          ...newSgSgIcmpRulesOtherside.slice(newSgSgSgIcmpRulesOthersideIndex + 1),
        ]),
      )
      toggleEditPopover(index)
      setEditOpen([...newEditOpenRules.slice(0, index), ...newEditOpenRules.slice(index + 1)])
    } else {
      newSgSgIcmpRules[index] = { ...newSgSgIcmpRules[index], formChanges: { status: STATUSES.deleted } }
      newSgSgIcmpRulesOtherside[newSgSgSgIcmpRulesOthersideIndex] = {
        ...newSgSgIcmpRulesOtherside[newSgSgSgIcmpRulesOthersideIndex],
        formChanges: { status: STATUSES.deleted },
      }
      dispatch(setRules(newSgSgIcmpRules))
      dispatch(setRulesOtherside(newSgSgIcmpRulesOtherside))
      toggleEditPopover(index)
    }
  }

  /* remove newSgRulesOtherside as legacy after only ie-sg-sg will remain */
  const restoreRule = (oldValues: TFormSgSgIcmpRule) => {
    const newSgSgIcmpRules = [...rulesAll]
    const index = newSgSgIcmpRules.findIndex(({ id }) => id === oldValues.id)
    const newSgSgIcmpRulesOtherside = [...rulesOtherside]
    /* legacy */
    const newSgSgSgIcmpRulesOthersideIndex = rulesOtherside.findIndex(
      ({ sg, IPv, types, logs, trace, action, prioritySome }) =>
        sg === centerSg &&
        IPv === newSgSgIcmpRules[index].IPv &&
        JSON.stringify(types.sort()) === JSON.stringify(newSgSgIcmpRules[index].types.sort()) &&
        logs === newSgSgIcmpRules[index].logs &&
        trace === newSgSgIcmpRules[index].trace &&
        action === newSgSgIcmpRules[index].action &&
        prioritySome === newSgSgIcmpRules[index].prioritySome,
    )
    newSgSgIcmpRules[index] = { ...newSgSgIcmpRules[index], formChanges: { status: STATUSES.modified }, checked: false }
    newSgSgIcmpRulesOtherside[newSgSgSgIcmpRulesOthersideIndex] = {
      ...newSgSgIcmpRulesOtherside[newSgSgSgIcmpRulesOthersideIndex],
      formChanges: { status: STATUSES.modified },
      checked: false,
    }
    dispatch(setRules(newSgSgIcmpRules))
    dispatch(setRulesOtherside(newSgSgIcmpRulesOtherside))
  }

  const handleSearch = (searchText: string[], confirm: FilterDropdownProps['confirm']) => {
    confirm()
    setSearchText(searchText[0])
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  type TColumn = TFormSgSgIcmpRule & { key: string }

  const columns: ColumnsType<TColumn> = [
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 25,
      render: (_, { action, formChanges }) => (
        <Styled.RulesEntryPorts $modified={formChanges?.modifiedFields?.includes('action')} className="no-scroll">
          {action === 'ACCEPT' ? (
            <LikeOutlined style={{ color: 'green' }} />
          ) : (
            <DislikeOutlined style={{ color: 'red' }} />
          )}
        </Styled.RulesEntryPorts>
      ),
    },
    {
      title: 'ICMP',
      dataIndex: 'IPv',
      key: 'IPv',
      width: 50,
      render: (_, { IPv, formChanges }) => (
        <Styled.RulesEntrySgs $modified={formChanges?.modifiedFields?.includes('ipv')} className="no-scroll">
          {IPv}
        </Styled.RulesEntrySgs>
      ),
      sorter: (a, b) => {
        if (a.IPv === b.IPv) {
          return 0
        }
        return a.IPv === 'IPv6' ? -1 : 1
      },
    },
    {
      title: 'SG Name',
      dataIndex: 'sg',
      key: 'sg',
      width: 150,
      render: (_, { sg, formChanges }) => (
        <Styled.RulesEntrySgs $modified={formChanges?.modifiedFields?.includes('sg')} className="no-scroll">
          <ShortenedTextWithTooltip text={sg} />
        </Styled.RulesEntrySgs>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
          <Input
            placeholder="search"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close()
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
      onFilter: (value, { sg }) =>
        sg
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: 'Types',
      dataIndex: 'types',
      key: 'types',
      width: 50,
      render: (_, { types, formChanges }) => (
        <Styled.RulesEntrySgs $modified={formChanges?.modifiedFields?.includes('types')} className="no-scroll">
          <ShortenedTextWithTooltip text={types.join(',')} />
        </Styled.RulesEntrySgs>
      ),
      sorter: (a, b) => {
        if (a.types.length === b.types.length) {
          return 0
        }
        return a.types.length > b.types.length ? -1 : 1
      },
    },
    {
      title: 'Logs',
      dataIndex: 'logs',
      key: 'logs',
      width: 50,
      render: (_, { logs, formChanges }) => (
        <Styled.RulesEntryMarks $modified={formChanges?.modifiedFields?.includes('logs')} className="no-scroll">
          <Tooltip title="Logs">
            {logs ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />}
          </Tooltip>
        </Styled.RulesEntryMarks>
      ),
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
      render: (_, { trace, formChanges }) => (
        <Styled.RulesEntryMarks $modified={formChanges?.modifiedFields?.includes('trace')} className="no-scroll">
          <Tooltip title="trace">
            {trace ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />}
          </Tooltip>
        </Styled.RulesEntryMarks>
      ),
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
          {prioritySome || DEFAULT_PRIORITIES.sgToSgIcmp}
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
              <EditSgSgIcmpPopover
                values={oldValues}
                remove={() => removeRule(oldValues)}
                hide={() => toggleEditPopover(index)}
                edit={values => editRule(oldValues, values)}
                isDisabled={isDisabled}
              />
            }
            title="SG SG ICMP"
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
        key: `${row.sg}-${row.IPv}`,
      }))
    : rulesData
        .filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted)
        .map(row => ({
          ...row,
          key: `${row.sg}-${row.IPv}`,
        }))

  const rowSelection = getRowSelection<TFormSgSgIcmpRule, TColumn>(
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
