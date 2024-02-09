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
import { TFormSgRule } from 'localTypes/rules'
import { AddSGPopover, EditSGPopover } from '../../atoms'
import { Styled } from '../styled'

type TSGRulesProps = {
  sgNames: string[]
  title: string
  popoverPosition: TooltipPlacement
  rules: TFormSgRule[]
  setRules: Dispatch<SetStateAction<TFormSgRule[]>>
  isDisabled?: boolean
}

export const SGRules: FC<TSGRulesProps> = ({ sgNames, title, popoverPosition, rules, setRules, isDisabled }) => {
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

  const addNew = (values: TFormSgRule) => {
    setRules([
      ...rules,
      {
        ...values,
        formChanges: {
          status: STATUSES.new,
        },
      },
    ])
    setEditOpen([...editOpen, false])
    toggleAddPopover()
  }

  const editRule = (index: number, values: TFormSgRule) => {
    const newSgRules = [...rules]
    if (newSgRules[index].formChanges?.status === STATUSES.new) {
      newSgRules[index] = { ...values, formChanges: { status: STATUSES.new } }
    } else {
      const modifiedFields = []
      if (JSON.stringify(newSgRules[index].sgs.sort()) !== JSON.stringify(values.sgs.sort())) {
        modifiedFields.push('sgs')
      }
      if (newSgRules[index].portsSource !== values.portsSource) {
        modifiedFields.push('portsSource')
      }
      if (newSgRules[index].portsDestination !== values.portsDestination) {
        modifiedFields.push('portsDestination')
      }
      if (newSgRules[index].transport !== values.transport) {
        modifiedFields.push('transport')
      }
      if (newSgRules[index].logs !== values.logs) {
        modifiedFields.push('logs')
      }
      if (modifiedFields.length === 0) {
        newSgRules[index] = { ...values }
      } else {
        newSgRules[index] = { ...values, formChanges: { status: STATUSES.modified, modifiedFields } }
      }
    }
    setRules(newSgRules)
    toggleEditPopover(index)
  }

  const removeRule = (index: number) => {
    const newSgRules = [...rules]
    const newEditOpenRules = [...editOpen]
    if (newSgRules[index].formChanges?.status === STATUSES.new) {
      setRules([...newSgRules.slice(0, index), ...newSgRules.slice(index + 1)])
      toggleEditPopover(index)
      setEditOpen([...newEditOpenRules.slice(0, index), ...newEditOpenRules.slice(index + 1)])
    } else {
      newSgRules[index] = { ...newSgRules[index], formChanges: { status: STATUSES.deleted } }
      setRules(newSgRules)
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

  type TColumn = TFormSgRule & { key: string }

  const columns: ColumnsType<TColumn> = [
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      width: 50,
      render: (_, { transport }) => (
        <Styled.RulesEntryTransport $transport={transport} className="no-scroll">
          {transport}
        </Styled.RulesEntryTransport>
      ),
      sorter: (a, b) => {
        if (a.transport === b.transport) {
          return 0
        }
        return a.transport === 'TCP' ? -1 : 1
      },
    },
    {
      title: 'SG Names',
      dataIndex: 'sgs',
      key: 'sgs',
      width: 150,
      render: (_, { sgs }) => <Styled.RulesEntrySgs className="no-scroll">{sgs.join(', ')}</Styled.RulesEntrySgs>,
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
      onFilter: (value, { sgs }) =>
        sgs
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
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
      title: 'Ports Source',
      key: 'portsSource',
      dataIndex: 'portsSource',
      width: 50,
      render: (_, { portsSource }) => (
        <Styled.RulesEntryPorts className="no-scroll">
          {portsSource.length === 0 ? 'any' : portsSource}
        </Styled.RulesEntryPorts>
      ),
    },
    {
      title: 'Ports Destination',
      key: 'portsDestination',
      dataIndex: 'portsDestination',
      width: 50,
      render: (_, { portsDestination }) => (
        <Styled.RulesEntryPorts className="no-scroll">
          {portsDestination.length === 0 ? 'any' : portsDestination}
        </Styled.RulesEntryPorts>
      ),
    },
    {
      title: 'Edit',
      key: 'edit',
      width: 50,
      render: (_, __, index) => (
        <Popover
          content={
            <EditSGPopover
              sgNames={sgNames}
              values={rules[index]}
              remove={() => removeRule(index)}
              hide={() => toggleEditPopover(index)}
              edit={values => editRule(index, values)}
              isDisabled={isDisabled}
            />
          }
          title="SG"
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
    <Styled.GroupRulesNode>
      <TitleWithNoTopMargin level={4}>{title}</TitleWithNoTopMargin>
      <Table
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          showSizeChanger: false,
          defaultPageSize: ITEMS_PER_PAGE_EDITOR,
        }}
        dataSource={rules
          .filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted)
          .map(row => ({
            ...row,
            key: `${row.sgs.toLocaleString()}-${row.portsSource}-${row.portsDestination}-${row.transport}`,
          }))}
        columns={columns}
        virtual
        scroll={{ x: 'max-content' }}
        size="small"
      />
      <Popover
        content={<AddSGPopover sgNames={sgNames} hide={toggleAddPopover} addNew={addNew} />}
        title="SG"
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
    </Styled.GroupRulesNode>
  )
}
