import React, { FC, useState, useEffect } from 'react'
import { AxiosError } from 'axios'
import { Button, Table, TableProps, Result, Spin, notification } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { TrashSimple, MagnifyingGlass, PencilSimpleLine } from '@phosphor-icons/react'
import {
  TitleWithNoMargins,
  CustomEmpty,
  TextAlignContainer,
  MiddleContainer,
  TinyButton,
  NetworkAddModal,
  NetworkEditModal,
  NetworkDeleteModal,
} from 'components'
import { getNetworks } from 'api/networks'
import { ITEMS_PER_PAGE } from 'constants/networks'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { TNetwork } from 'localTypes/networks'
import { Styled } from './styled'

type TColumn = {
  name: string
  cidr: string
  key: string
}

type OnChange = NonNullable<TableProps<TColumn>['onChange']>

type Filters = Parameters<OnChange>[1]

export const NetworksList: FC = () => {
  const [api, contextHolder] = notification.useNotification()

  const [networks, setNetworks] = useState<TNetwork[]>([])
  const [error, setError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<string | boolean>(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState<string | boolean>(false)

  const [searchText, setSearchText] = useState('')
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    getNetworks()
      .then(({ data }) => {
        setIsLoading(false)
        setNetworks(data.networks)
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

  useEffect(() => {
    setFilteredInfo({ name: searchText ? [searchText] : null })
  }, [searchText])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange: OnChange = (pagination, filters, sorter, extra) => {
    setFilteredInfo(filters)
  }

  const openNotification = (msg: string) => {
    api.success({
      message: msg,
      placement: 'topRight',
    })
  }

  if (error) {
    return (
      <MiddleContainer>
        <Result status="error" title={error.status} subTitle={error.data?.message} />
      </MiddleContainer>
    )
  }

  const columns: ColumnsType<TColumn> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: filteredInfo.name || null,
      onFilter: (value, { name }) => name.toLowerCase().includes((value as string).toLowerCase()),
      width: '50%',
    },
    {
      title: 'CIDR',
      dataIndex: 'cidr',
      key: 'cidr',
      width: 'auto',
    },
    {
      title: '',
      key: 'controls',
      align: 'right',
      className: 'controls',
      width: 84,
      render: (_, record: { name: string; cidr: string }) => (
        <TextAlignContainer $align="right" className="hideable">
          <TinyButton
            type="text"
            size="small"
            onClick={() => setIsModalEditOpen(record.name)}
            icon={<PencilSimpleLine size={14} />}
          />
          <TinyButton
            type="text"
            size="small"
            onClick={() => setIsModalDeleteOpen(record.name)}
            icon={<TrashSimple size={14} />}
          />
        </TextAlignContainer>
      ),
    },
  ]

  return (
    <>
      <Styled.HeaderRow>
        <TitleWithNoMargins level={3}>Networks</TitleWithNoMargins>
      </Styled.HeaderRow>
      <Styled.ControlsRow>
        <Styled.ControlsRightSide>
          <Button onClick={() => setIsModalAddOpen(true)} type="primary">
            <PlusOutlined /> Add
          </Button>
          <Styled.Separator />
          <Button type="text" icon={<TrashSimple color="#00000040" size={18} />} />
        </Styled.ControlsRightSide>
        <Styled.ControlsLeftSide>
          <Styled.SearchControl>
            <Styled.InputWithCustomPreffixMargin
              allowClear
              placeholder="Search"
              prefix={<MagnifyingGlass color="#00000073" />}
              value={searchText}
              onChange={e => {
                setSearchText(e.target.value)
              }}
            />
          </Styled.SearchControl>
        </Styled.ControlsLeftSide>
      </Styled.ControlsRow>
      {isLoading && (
        <MiddleContainer>
          <Spin />
        </MiddleContainer>
      )}
      {!networks.length && !error && !isLoading && <CustomEmpty />}
      {networks.length > 0 && (
        <Styled.TableContainer>
          <Styled.HideableControls>
            <Table
              pagination={{
                position: ['bottomCenter'],
                showQuickJumper: {
                  goButton: <Button size="small">Go</Button>,
                },
                showSizeChanger: false,
                defaultPageSize: ITEMS_PER_PAGE,
                hideOnSinglePage: true,
              }}
              dataSource={networks.map(row => ({ name: row.name, cidr: row.network.CIDR, key: row.name }))}
              columns={columns}
              scroll={{ x: 'max-content' }}
              onChange={handleChange}
            />
          </Styled.HideableControls>
        </Styled.TableContainer>
      )}
      <NetworkDeleteModal
        externalOpenInfo={isModalDeleteOpen}
        setExternalOpenInfo={setIsModalDeleteOpen}
        openNotification={openNotification}
        networks={networks}
        setNetworks={setNetworks}
      />
      <NetworkAddModal
        externalOpenInfo={isModalAddOpen}
        setExternalOpenInfo={setIsModalAddOpen}
        openNotification={openNotification}
      />
      <NetworkEditModal
        externalOpenInfo={isModalEditOpen}
        setExternalOpenInfo={setIsModalEditOpen}
        openNotification={openNotification}
      />
      {contextHolder}
    </>
  )
}
