import React, { FC, useState, useEffect } from 'react'
import { Button, notification } from 'antd'
import { TrashSimple, MagnifyingGlass, X } from '@phosphor-icons/react'
import { Layouts } from 'components'
import { RULES_CONFIGS_FOR_FACTORY } from '../../constants'
import { SgModalAndTypeSwitcher, RulesBlockFactory, DeleteManyModal } from '../../organisms'
import { Styled } from './styled'

type TRulesByTypeProps = {
  typeId: string
  onSelectCenterSg: (newSg?: string) => void
}

export const RulesByType: FC<TRulesByTypeProps> = ({ typeId, onSelectCenterSg }) => {
  const [subType, setSubType] = useState<string>('TCPUDP')

  const [api, contextHolder] = notification.useNotification()

  const [searchText, setSearchText] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false)

  useEffect(() => {
    setSubType('TCPUDP')
  }, [typeId])

  const openNotification = (msg: string) => {
    api.success({
      message: msg,
      placement: 'topRight',
    })
  }

  const clearSelected = () => {
    setSelectedRowKeys([])
  }

  return (
    <>
      <Layouts.ControlsRow>
        <Layouts.ControlsRightSide>
          {selectedRowKeys.length > 0 ? (
            <>
              <Styled.SelectedItemsText>Selected Rules: {selectedRowKeys.length}</Styled.SelectedItemsText>
              <Button type="text" icon={<X size={16} color="#00000073" />} onClick={clearSelected} />
            </>
          ) : (
            <SgModalAndTypeSwitcher
              onSelectCenterSg={onSelectCenterSg}
              subType={subType}
              onSelectSubType={setSubType}
            />
          )}
          <Layouts.Separator />
          <Button
            disabled={selectedRowKeys.length === 0}
            type="text"
            icon={<TrashSimple size={18} />}
            onClick={() => setIsModalDeleteOpen(true)}
          />
        </Layouts.ControlsRightSide>
        <Layouts.ControlsLeftSide>
          <Layouts.SearchControl>
            <Layouts.InputWithCustomPreffixMargin
              allowClear
              placeholder="Search"
              prefix={<MagnifyingGlass color="#00000073" />}
              value={searchText}
              onChange={e => {
                setSearchText(e.target.value)
              }}
            />
          </Layouts.SearchControl>
        </Layouts.ControlsLeftSide>
      </Layouts.ControlsRow>
      {typeId === 'sgSg' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSg.from} isDisabledDefault />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSg.to} isDisabledDefault />
        </>
      )}
      {typeId === 'sgSgIcmp' && subType === 'ICMP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIcmp.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIcmp.to} />
        </>
      )}
      {typeId === 'sgSgIe' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIe.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIe.to} />
        </>
      )}
      {typeId === 'sgSgIeIcmp' && subType === 'ICMP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIeIcmp.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIeIcmp.to} />
        </>
      )}
      {typeId === 'sgCidr' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgCidr.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgCidr.to} />
        </>
      )}
      {typeId === 'sgCidrIcmp' && subType === 'ICMP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgCidrIcmp.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgCidrIcmp.to} />
        </>
      )}
      {typeId === 'sgFqdn' && <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgFqdn.to} />}
      <DeleteManyModal open={isModalDeleteOpen} openNotification={openNotification} />
      {contextHolder}
    </>
  )
}
