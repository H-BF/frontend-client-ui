import React, { FC } from 'react'
import { Button, Form, Input, Select, Switch } from 'antd'
import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { TFormFqdnRule } from 'localTypes/rules'
import { Styled } from './styled'

type TAddFqdnPopoverProps = {
  hide: () => void
  addNew: (values: TFormFqdnRule) => void
}

export const AddFqdnPopover: FC<TAddFqdnPopoverProps> = ({ hide, addNew }) => {
  const [addForm] = Form.useForm()

  return (
    <Form
      form={addForm}
      onFinish={(values: TFormFqdnRule) => {
        addNew(values)
        addForm.resetFields()
      }}
    >
      <Styled.FormItem label="Groups" name={['fqdns']} rules={[{ required: true, message: 'Missing FQDNs' }]}>
        <Select
          mode="tags"
          showSearch
          placeholder="Select FQDNs"
          optionFilterProp="children"
          allowClear
          tokenSeparators={[',', ' ']}
          getPopupContainer={node => node.parentNode}
        />
      </Styled.FormItem>
      <Styled.FormItem label="Ports Source" name="portsSource">
        <Input placeholder="Ports Source" />
      </Styled.FormItem>
      <Styled.FormItem label="Ports Destination" name="portsDestination">
        <Input placeholder="Ports Destination" />
      </Styled.FormItem>
      <Styled.FormItem
        name="transport"
        label="Transport"
        hasFeedback
        validateTrigger="onBlur"
        rules={[{ required: true, message: 'Please choose transport' }]}
      >
        <Select
          allowClear
          placeholder="Transport"
          options={[
            { label: 'TCP', value: 'TCP' },
            { label: 'UDP', value: 'UDP' },
          ]}
          getPopupContainer={node => node.parentNode}
        />
      </Styled.FormItem>
      <Styled.FormItem valuePropName="checked" name="logs" label="Logs">
        <Switch />
      </Styled.FormItem>
      <Styled.ButtonsContainer>
        <Styled.ButtonWithRightMargin>
          <Button
            type="dashed"
            block
            icon={<CloseOutlined />}
            onClick={() => {
              hide()
              addForm.resetFields()
            }}
          >
            Cancel
          </Button>
        </Styled.ButtonWithRightMargin>
        <Button type="primary" block icon={<PlusCircleOutlined />} htmlType="submit">
          Add
        </Button>
      </Styled.ButtonsContainer>
    </Form>
  )
}
