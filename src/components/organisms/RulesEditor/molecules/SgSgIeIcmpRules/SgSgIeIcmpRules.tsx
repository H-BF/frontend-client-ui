import React, { FC, useState } from 'react'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { Button, Popover } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'
import { PlusOutlined } from '@ant-design/icons'
import { TitleWithNoTopMargin } from 'components/atoms'
import { STATUSES } from 'constants/rules'
import { TFormSgSgIeIcmpRule, TTraffic } from 'localTypes/rules'
import { AddSgSgIeIcmpPopover } from '../../atoms'
import { SgSgIeIcmpTable } from '../tables'
import { Styled } from '../styled'

type TSgSgIeIcmpRulesProps = {
  forceArrowsUpdate: () => void
  title: string
  popoverPosition: TooltipPlacement
  rules: TFormSgSgIeIcmpRule[]
  setRules: ActionCreatorWithPayload<TFormSgSgIeIcmpRule[]>
  defaultTraffic: TTraffic
  isDisabled?: boolean
}

export const SgSgIeIcmpRules: FC<TSgSgIeIcmpRulesProps> = ({
  forceArrowsUpdate,
  title,
  popoverPosition,
  rules,
  setRules,
  defaultTraffic,
  isDisabled,
}) => {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<boolean[]>([])

  const toggleAddPopover = () => {
    setAddOpen(!addOpen)
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

  return (
    <>
      <TitleWithNoTopMargin level={4}>{title}</TitleWithNoTopMargin>
      <SgSgIeIcmpTable
        isChangesMode={false}
        popoverPosition={popoverPosition}
        defaultTraffic={defaultTraffic}
        rulesAll={rules}
        rulesData={rules}
        setRules={setRules}
        setEditOpen={setEditOpen}
        editOpen={editOpen}
        isDisabled={isDisabled}
        forceArrowsUpdate={forceArrowsUpdate}
      />
      <Popover
        content={<AddSgSgIeIcmpPopover hide={toggleAddPopover} addNew={addNew} />}
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
