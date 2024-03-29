/* eslint-disable max-lines-per-function */
/* eslint-disable react/no-unstable-nested-components */
import React, { FC, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Button, Popover, Tooltip, Table, Input, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import { TooltipPlacement } from 'antd/es/tooltip'
import { PlusOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { TitleWithNoTopMargin } from 'components/atoms'
import { ITEMS_PER_PAGE_EDITOR, STATUSES } from 'constants/rules'
import { TFormSgSgIeIcmpRule, TTraffic } from 'localTypes/rules'
import { AddSgSgIeIcmpPopover, EditSgSgIeIcmpPopover } from '../../atoms'
import { Styled } from '../styled'

type TSgSgIeIcmpRulesProps = {
  forceArrowsUpdate: () => void
  sgNames: string[]
  title: string
  popoverPosition: TooltipPlacement
  rules: TFormSgSgIeIcmpRule[]
  setRules: Dispatch<SetStateAction<TFormSgSgIeIcmpRule[]>>
  defaultTraffic: TTraffic
  isDisabled?: boolean
}

export const SgSgIeIcmpRules: FC<TSgSgIeIcmpRulesProps> = ({
  forceArrowsUpdate,
  sgNames,
  title,
  popoverPosition,
  rules,
  setRules,
  defaultTraffic,
  isDisabled,
}) => {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<boolean[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setEditOpen(Array(rules.filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted).length).fill(false))
  }, [rules])

  const toggleAddPopover = () => {
    setAddOpen(!addOpen)
  }

  const toggleEditPopover = (index: number) => {
    const newEditOpen = [...editOpen]
    newEditOpen[index] = !newEditOpen[index]
    setEditOpen(newEditOpen)
  }

  const addNew = (values: TFormSgSgIeIcmpRule) => {
    setRules([
      ...rules,
      {
        ...values,
        traffic: defaultTraffic,
        formChanges: {
          status: STATUSES.new,
        },
      },
    ])
    setEditOpen([...editOpen, false])
    toggleAddPopover()
  }

  /* remove newSgRulesOtherside as legacy after only ie-sg-sg will remain */
  const editRule = (oldValues: TFormSgSgIeIcmpRule, values: TFormSgSgIeIcmpRule) => {
    const newSgSgIeIcmpRules = [...rules]
    const index = newSgSgIeIcmpRules.findIndex(
      ({ sg, IPv, types, logs, trace, traffic }) =>
        sg === oldValues.sg &&
        IPv === oldValues.IPv &&
        JSON.stringify(types.sort()) === JSON.stringify(oldValues.types.sort()) &&
        logs === oldValues.logs &&
        trace === oldValues.trace &&
        traffic === oldValues.traffic,
    )
    if (newSgSgIeIcmpRules[index].formChanges?.status === STATUSES.new) {
      newSgSgIeIcmpRules[index] = { ...values, traffic: defaultTraffic, formChanges: { status: STATUSES.new } }
    } else {
      const modifiedFields = []
      if (newSgSgIeIcmpRules[index].sg !== values.sg) {
        modifiedFields.push('sg')
      }
      if (newSgSgIeIcmpRules[index].IPv !== values.IPv) {
        modifiedFields.push('ipv')
      }
      if (JSON.stringify(newSgSgIeIcmpRules[index].types.sort()) !== JSON.stringify(values.types.sort())) {
        modifiedFields.push('types')
      }
      if (newSgSgIeIcmpRules[index].logs !== values.logs) {
        modifiedFields.push('logs')
      }
      if (modifiedFields.length === 0) {
        newSgSgIeIcmpRules[index] = { ...values }
      } else {
        newSgSgIeIcmpRules[index] = {
          ...values,
          traffic: defaultTraffic,
          formChanges: { status: STATUSES.modified, modifiedFields },
        }
      }
    }
    setRules(newSgSgIeIcmpRules)
    toggleEditPopover(index)
  }

  /* remove newSgRulesOtherside as legacy after only ie-sg-sg will remain */
  const removeRule = (index: number) => {
    const newSgSgIeIcmpRules = [...rules]
    const newEditOpenRules = [...editOpen]
    if (newSgSgIeIcmpRules[index].formChanges?.status === STATUSES.new) {
      setRules([...newSgSgIeIcmpRules.slice(0, index), ...newSgSgIeIcmpRules.slice(index + 1)])
      toggleEditPopover(index)
      setEditOpen([...newEditOpenRules.slice(0, index), ...newEditOpenRules.slice(index + 1)])
    } else {
      newSgSgIeIcmpRules[index] = {
        ...newSgSgIeIcmpRules[index],
        traffic: defaultTraffic,
        formChanges: { status: STATUSES.deleted },
      }
      setRules(newSgSgIeIcmpRules)
      toggleEditPopover(index)
    }
  }

  const handleSearch = (searchText: string[], confirm: FilterDropdownProps['confirm']) => {
    confirm()
    setSearchText(searchText[0])
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  type TColumn = TFormSgSgIeIcmpRule & { key: string }

  const columns: ColumnsType<TColumn> = [
    {
      title: 'IPv',
      dataIndex: 'IPv',
      key: 'IPv',
      width: 50,
      render: (_, { IPv }) => <Styled.RulesEntrySgs className="no-scroll">{IPv}</Styled.RulesEntrySgs>,
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
      render: (_, { sg }) => <Styled.RulesEntrySgs className="no-scroll">{sg}</Styled.RulesEntrySgs>,
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
      render: (_, { types }) => <Styled.RulesEntrySgs className="no-scroll">{types.join(',')}</Styled.RulesEntrySgs>,
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
      render: (_, { logs }) => (
        <Styled.RulesEntryMarks className="no-scroll">
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
      render: (_, { trace }) => (
        <Styled.RulesEntryMarks className="no-scroll">
          <Tooltip title="Trace">
            {trace ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />}
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
      title: 'Edit',
      key: 'edit',
      width: 50,
      render: (_, oldValues, index) => (
        <Popover
          content={
            <EditSgSgIeIcmpPopover
              sgNames={sgNames}
              values={rules[index]}
              remove={() => removeRule(index)}
              hide={() => toggleEditPopover(index)}
              edit={values => editRule(oldValues, values)}
              isDisabled={isDisabled}
            />
          }
          title="SG-SG-IE-ICMP"
          trigger="click"
          open={editOpen[index]}
          onOpenChange={() => toggleEditPopover(index)}
          placement={popoverPosition}
          className="no-scroll"
        >
          Edit
        </Popover>
      ),
    },
  ]

  return (
    <>
      <TitleWithNoTopMargin level={4}>{title}</TitleWithNoTopMargin>
      <Table
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          showSizeChanger: false,
          defaultPageSize: ITEMS_PER_PAGE_EDITOR,
          onChange: forceArrowsUpdate,
        }}
        dataSource={rules
          .filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted)
          .map(row => ({
            ...row,
            key: `${row.sg}-${row.IPv}`,
          }))}
        columns={columns}
        virtual
        scroll={{ x: 'max-content' }}
        size="small"
      />
      <Popover
        content={<AddSgSgIeIcmpPopover sgNames={sgNames} hide={toggleAddPopover} addNew={addNew} />}
        title="SG-SG-IE"
        trigger="click"
        open={addOpen}
        onOpenChange={toggleAddPopover}
        placement={popoverPosition}
      >
        <Styled.FormItem>
          <Button type="dashed" block icon={<PlusOutlined />} disabled={isDisabled}>
            Add
          </Button>
        </Styled.FormItem>
      </Popover>
    </>
  )
}
