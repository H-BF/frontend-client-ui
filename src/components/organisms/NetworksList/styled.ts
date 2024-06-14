import styled from 'styled-components'
import { Input } from 'antd'

const HeaderRow = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #0000000f;
`

const ControlsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 12px 24px;
  border-bottom: 1px solid #0000000f;
`

const ControlsRightSide = styled.div`
  display: flex;
`

const Separator = styled.div`
  width: 1px;
  height: 24pcx;
  margin: 0 16px;
  background: #0000000f;
`

const ControlsLeftSide = styled.div`
  display: flex;
  justify-content: flex-end;
`

const SearchControl = styled.div`
  width: 240px;
`

const InputWithCustomPreffixMargin = styled(Input)`
  && .ant-input-prefix {
    margin-inline-end: 10px;
  }
`

const TableContainer = styled.div`
  padding: 24px;
`

const HideableControls = styled.div`
  && .ant-table-row .hideable {
    display: none;
  }

  && .ant-table-row:hover .hideable {
    display: block;
  }
`

export const Styled = {
  HeaderRow,
  ControlsRow,
  ControlsRightSide,
  Separator,
  ControlsLeftSide,
  SearchControl,
  InputWithCustomPreffixMargin,
  TableContainer,
  HideableControls,
}
