import styled from 'styled-components'
import { Form } from 'antd'

const GroupRulesNode = styled.div`
  width: 700px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 24px rgba(23, 49, 65, 0.13);
`

const FormItem = styled(Form.Item)`
  margin-bottom: 5px;

  label {
    min-width: 150px;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

const ButtonWithRightMargin = styled.div`
  margin-right: 10px;
`

type TRulesEntryTransportProps = {
  $transport: string
  $modified?: boolean
}

const RulesEntryTransport = styled.div<TRulesEntryTransportProps>`
  padding: 3px;
  text-align: center;
  background: ${({ $transport, $modified }) => {
    if ($modified) {
      return '#f1c1c1d9'
    }
    if ($transport === 'TCP') {
      return '#c1f1c3d9'
    }
    return '#c1d4f1d9'
  }};
  border-left: 1px solid #cbcbcb;
  border-radius: 5px;
`

type TRulesEntrySgsProps = {
  $modified?: boolean
}

const RulesEntrySgs = styled.div<TRulesEntrySgsProps>`
  width: 100%;
  padding: 3px;
  word-break: break-all;
  background: ${({ $modified }) => ($modified ? '#f1c1c1d9' : 'initial')};
`

type TRulesEntryMarksProps = {
  $modified?: boolean
}

const RulesEntryMarks = styled.div<TRulesEntryMarksProps>`
  min-width: fit-content;
  padding: 5px 5px;
  background: ${({ $modified }) => ($modified ? '#f1c1c1d9' : 'initial')};
`

type TRulesEntryPortsProps = {
  $modified?: boolean
}

const RulesEntryPorts = styled.div<TRulesEntryPortsProps>`
  padding: 3px;
  text-align: center;
  background: ${({ $modified }) => ($modified ? '#f1c1c1d9' : 'initial')};
  border-left: 1px solid #cbcbcb;
  border-radius: 5px;
`

export const Styled = {
  GroupRulesNode,
  FormItem,
  ButtonsContainer,
  ButtonWithRightMargin,
  RulesEntryTransport,
  RulesEntrySgs,
  RulesEntryMarks,
  RulesEntryPorts,
}
