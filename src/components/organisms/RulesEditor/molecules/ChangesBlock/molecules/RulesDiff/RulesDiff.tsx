/* eslint-disable max-lines-per-function */
import React, { FC, Dispatch, SetStateAction, useState } from 'react'
import { Typography } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'
import { TitleWithNoTopMargin } from 'components'
import {
  TFormSgRule,
  TFormFqdnRule,
  TFormCidrSgRule,
  TFormSgSgIcmpRule,
  TFormSgSgIeRule,
  TFormSgSgIeIcmpRule,
  TTraffic,
} from 'localTypes/rules'
import { SGTable, FQDNTable, CidrSgTable, SgSgIcmpTable, SgSgIeTable, SgSgIeIcmpTable } from '../../../tables'
import {
  TFormSgRuleChangesResult,
  TFormFqdnRuleChangesResult,
  TFormCidrSgRuleChangesResult,
  TFormSgSgIcmpRuleChangesResult,
  TFormSgSgIeRuleChangesResult,
  TFormSgSgIeIcmpRuleChangesResult,
} from '../../types'

type TRulesDiffProps = {
  title: string
  compareResult:
    | {
        type: 'sg'
        data: TFormSgRuleChangesResult
        sgNames: string[]
        setRules: Dispatch<SetStateAction<TFormSgRule[]>>
        rulesOtherside: TFormSgRule[]
        setRulesOtherside: Dispatch<SetStateAction<TFormSgRule[]>>
        popoverPosition: TooltipPlacement
        centerSg?: string
      }
    | {
        type: 'fqdn'
        data: TFormFqdnRuleChangesResult
        setRules: Dispatch<SetStateAction<TFormFqdnRule[]>>
        popoverPosition: TooltipPlacement
      }
    | {
        type: 'cidr'
        data: TFormCidrSgRuleChangesResult
        defaultTraffic: TTraffic
        setRules: Dispatch<SetStateAction<TFormCidrSgRule[]>>
        popoverPosition: TooltipPlacement
      }
    | {
        type: 'sgSgIcmp'
        data: TFormSgSgIcmpRuleChangesResult
        sgNames: string[]
        popoverPosition: TooltipPlacement
        setRules: Dispatch<SetStateAction<TFormSgSgIcmpRule[]>>
        rulesOtherside: TFormSgSgIcmpRule[]
        setRulesOtherside: Dispatch<SetStateAction<TFormSgSgIcmpRule[]>>
        centerSg?: string
      }
    | {
        type: 'sgSgIe'
        data: TFormSgSgIeRuleChangesResult
        sgNames: string[]
        popoverPosition: TooltipPlacement
        defaultTraffic: TTraffic
        setRules: Dispatch<SetStateAction<TFormSgSgIeRule[]>>
      }
    | {
        type: 'sgSgIeIcmp'
        data: TFormSgSgIeIcmpRuleChangesResult
        sgNames: string[]
        popoverPosition: TooltipPlacement
        defaultTraffic: TTraffic
        setRules: Dispatch<SetStateAction<TFormSgSgIeIcmpRule[]>>
      }
}

export const RulesDiff: FC<TRulesDiffProps> = ({ title, compareResult }) => {
  const [editOpenNewRules, setEditOpenNewRules] = useState<boolean[]>([])
  const [editOpenModifiedRules, setEditOpenModifiedRules] = useState<boolean[]>([])
  const [editOpenDeletedRules, setEditOpenDeletedRules] = useState<boolean[]>([])

  if (compareResult.type === 'sg') {
    return (
      <>
        <TitleWithNoTopMargin level={5}>{title}</TitleWithNoTopMargin>
        {compareResult.data.newRules.length > 0 && (
          <>
            <Typography.Paragraph>New Rules:</Typography.Paragraph>
            <SGTable
              isChangesMode
              sgNames={compareResult.sgNames}
              rules={compareResult.data.newRules}
              setRules={compareResult.setRules}
              rulesOtherside={compareResult.rulesOtherside}
              setRulesOtherside={compareResult.setRulesOtherside}
              setEditOpen={setEditOpenNewRules}
              editOpen={editOpenNewRules}
              popoverPosition={compareResult.popoverPosition}
              centerSg={compareResult.centerSg}
            />
          </>
        )}
        {compareResult.data.diffRules.length > 0 && (
          <>
            <Typography.Paragraph>Diff Rules:</Typography.Paragraph>
            <SGTable
              isChangesMode
              sgNames={compareResult.sgNames}
              rules={compareResult.data.diffRules}
              setRules={compareResult.setRules}
              rulesOtherside={compareResult.rulesOtherside}
              setRulesOtherside={compareResult.setRulesOtherside}
              setEditOpen={setEditOpenModifiedRules}
              editOpen={editOpenModifiedRules}
              popoverPosition={compareResult.popoverPosition}
              centerSg={compareResult.centerSg}
            />
          </>
        )}
        {compareResult.data.deletedRules.length > 0 && (
          <>
            <Typography.Paragraph>Deleted Rules:</Typography.Paragraph>
            <SGTable
              isChangesMode
              sgNames={compareResult.sgNames}
              rules={compareResult.data.deletedRules}
              setRules={compareResult.setRules}
              rulesOtherside={compareResult.rulesOtherside}
              setRulesOtherside={compareResult.setRulesOtherside}
              setEditOpen={setEditOpenDeletedRules}
              editOpen={editOpenDeletedRules}
              popoverPosition={compareResult.popoverPosition}
              centerSg={compareResult.centerSg}
            />
          </>
        )}
      </>
    )
  }

  if (compareResult.type === 'fqdn') {
    return (
      <>
        <TitleWithNoTopMargin level={5}>{title}</TitleWithNoTopMargin>
        {compareResult.data.newRules.length > 0 && (
          <>
            <Typography.Paragraph>New Rules:</Typography.Paragraph>
            <FQDNTable
              isChangesMode
              rules={compareResult.data.newRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenNewRules}
              editOpen={editOpenNewRules}
              popoverPosition={compareResult.popoverPosition}
            />
          </>
        )}
        {compareResult.data.diffRules.length > 0 && (
          <>
            <Typography.Paragraph>Diff Rules:</Typography.Paragraph>
            <FQDNTable
              isChangesMode
              rules={compareResult.data.diffRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenModifiedRules}
              editOpen={editOpenModifiedRules}
              popoverPosition={compareResult.popoverPosition}
            />
          </>
        )}
        {compareResult.data.deletedRules.length > 0 && (
          <>
            <Typography.Paragraph>Deleted Rules:</Typography.Paragraph>
            <FQDNTable
              isChangesMode
              rules={compareResult.data.deletedRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenDeletedRules}
              editOpen={editOpenDeletedRules}
              popoverPosition={compareResult.popoverPosition}
            />
          </>
        )}
      </>
    )
  }

  if (compareResult.type === 'cidr') {
    return (
      <>
        <TitleWithNoTopMargin level={5}>{title}</TitleWithNoTopMargin>
        {compareResult.data.newRules.length > 0 && (
          <>
            <Typography.Paragraph>New Rules:</Typography.Paragraph>
            <CidrSgTable
              isChangesMode
              defaultTraffic={compareResult.defaultTraffic}
              rules={compareResult.data.newRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenNewRules}
              editOpen={editOpenNewRules}
              popoverPosition={compareResult.popoverPosition}
            />
          </>
        )}
        {compareResult.data.diffRules.length > 0 && (
          <>
            <Typography.Paragraph>Diff Rules:</Typography.Paragraph>
            <CidrSgTable
              isChangesMode
              defaultTraffic={compareResult.defaultTraffic}
              rules={compareResult.data.diffRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenModifiedRules}
              editOpen={editOpenModifiedRules}
              popoverPosition={compareResult.popoverPosition}
            />
          </>
        )}
        {compareResult.data.deletedRules.length > 0 && (
          <>
            <Typography.Paragraph>Deleted Rules:</Typography.Paragraph>
            <CidrSgTable
              isChangesMode
              defaultTraffic={compareResult.defaultTraffic}
              rules={compareResult.data.deletedRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenDeletedRules}
              editOpen={editOpenDeletedRules}
              popoverPosition={compareResult.popoverPosition}
            />
          </>
        )}
      </>
    )
  }

  if (compareResult.type === 'sgSgIcmp') {
    return (
      <>
        <TitleWithNoTopMargin level={5}>{title}</TitleWithNoTopMargin>
        {compareResult.data.newRules.length > 0 && (
          <>
            <Typography.Paragraph>New Rules:</Typography.Paragraph>
            <SgSgIcmpTable
              isChangesMode
              sgNames={compareResult.sgNames}
              popoverPosition={compareResult.popoverPosition}
              rules={compareResult.data.newRules}
              setRules={compareResult.setRules}
              rulesOtherside={compareResult.rulesOtherside}
              setRulesOtherside={compareResult.setRulesOtherside}
              editOpen={editOpenNewRules}
              setEditOpen={setEditOpenNewRules}
              centerSg={compareResult.centerSg}
            />
          </>
        )}
        {compareResult.data.diffRules.length > 0 && (
          <>
            <Typography.Paragraph>Diff Rules:</Typography.Paragraph>
            <SgSgIcmpTable
              isChangesMode
              sgNames={compareResult.sgNames}
              popoverPosition={compareResult.popoverPosition}
              rules={compareResult.data.diffRules}
              setRules={compareResult.setRules}
              rulesOtherside={compareResult.rulesOtherside}
              setRulesOtherside={compareResult.setRulesOtherside}
              editOpen={editOpenModifiedRules}
              setEditOpen={setEditOpenModifiedRules}
              centerSg={compareResult.centerSg}
            />
          </>
        )}
        {compareResult.data.deletedRules.length > 0 && (
          <>
            <Typography.Paragraph>Deleted Rules:</Typography.Paragraph>
            <SgSgIcmpTable
              isChangesMode
              sgNames={compareResult.sgNames}
              popoverPosition={compareResult.popoverPosition}
              rules={compareResult.data.deletedRules}
              setRules={compareResult.setRules}
              rulesOtherside={compareResult.rulesOtherside}
              setRulesOtherside={compareResult.setRulesOtherside}
              editOpen={editOpenDeletedRules}
              setEditOpen={setEditOpenDeletedRules}
              centerSg={compareResult.centerSg}
            />
          </>
        )}
      </>
    )
  }

  if (compareResult.type === 'sgSgIe') {
    return (
      <>
        <TitleWithNoTopMargin level={5}>{title}</TitleWithNoTopMargin>
        {compareResult.data.newRules.length > 0 && (
          <>
            <Typography.Paragraph>New Rules:</Typography.Paragraph>
            <SgSgIeTable
              isChangesMode
              sgNames={compareResult.sgNames}
              popoverPosition={compareResult.popoverPosition}
              defaultTraffic={compareResult.defaultTraffic}
              rules={compareResult.data.newRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenNewRules}
              editOpen={editOpenNewRules}
            />
          </>
        )}
        {compareResult.data.diffRules.length > 0 && (
          <>
            <Typography.Paragraph>Diff Rules:</Typography.Paragraph>
            <SgSgIeTable
              isChangesMode
              sgNames={compareResult.sgNames}
              popoverPosition={compareResult.popoverPosition}
              defaultTraffic={compareResult.defaultTraffic}
              rules={compareResult.data.diffRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenModifiedRules}
              editOpen={editOpenModifiedRules}
            />
          </>
        )}
        {compareResult.data.deletedRules.length > 0 && (
          <>
            <Typography.Paragraph>Deleted Rules:</Typography.Paragraph>
            <SgSgIeTable
              isChangesMode
              sgNames={compareResult.sgNames}
              popoverPosition={compareResult.popoverPosition}
              defaultTraffic={compareResult.defaultTraffic}
              rules={compareResult.data.deletedRules}
              setRules={compareResult.setRules}
              setEditOpen={setEditOpenDeletedRules}
              editOpen={editOpenDeletedRules}
            />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <TitleWithNoTopMargin level={5}>{title}</TitleWithNoTopMargin>
      {compareResult.data.newRules.length > 0 && (
        <>
          <Typography.Paragraph>New Rules:</Typography.Paragraph>
          <SgSgIeIcmpTable
            isChangesMode
            sgNames={compareResult.sgNames}
            popoverPosition={compareResult.popoverPosition}
            defaultTraffic={compareResult.defaultTraffic}
            rules={compareResult.data.newRules}
            setRules={compareResult.setRules}
            editOpen={editOpenNewRules}
            setEditOpen={setEditOpenNewRules}
          />
        </>
      )}
      {compareResult.data.diffRules.length > 0 && (
        <>
          <Typography.Paragraph>Diff Rules:</Typography.Paragraph>
          <SgSgIeIcmpTable
            isChangesMode
            sgNames={compareResult.sgNames}
            popoverPosition={compareResult.popoverPosition}
            defaultTraffic={compareResult.defaultTraffic}
            rules={compareResult.data.diffRules}
            setRules={compareResult.setRules}
            editOpen={editOpenModifiedRules}
            setEditOpen={setEditOpenModifiedRules}
          />
        </>
      )}
      {compareResult.data.deletedRules.length > 0 && (
        <>
          <Typography.Paragraph>Deleted Rules:</Typography.Paragraph>
          <SgSgIeIcmpTable
            isChangesMode
            sgNames={compareResult.sgNames}
            popoverPosition={compareResult.popoverPosition}
            defaultTraffic={compareResult.defaultTraffic}
            rules={compareResult.data.deletedRules}
            setRules={compareResult.setRules}
            editOpen={editOpenDeletedRules}
            setEditOpen={setEditOpenDeletedRules}
          />
        </>
      )}
    </>
  )
}
