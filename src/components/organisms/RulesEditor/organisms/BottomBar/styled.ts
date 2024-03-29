import styled from 'styled-components'
import { Form } from 'antd'

type TContainerProps = {
  $isOpen: boolean
  $containerHeight?: number
}

const Container = styled.div<TContainerProps>`
  position: absolute;
  bottom: 0;
  left: 50px;
  z-index: 2;
  width: calc(100vw - 148px);
  height: ${({ $isOpen, $containerHeight }) => {
    if ($isOpen) {
      return '90vh'
    }
    return $containerHeight || '50px'
  }};
  padding: 0 24px 24px 24px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 24px rgba(23, 49, 65, 0.13);
`

const Resizer = styled.div`
  width: 100%;
  height: 10px;
  padding-bottom: 14px;
  cursor: grab;
  user-select: none;
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`

const FlexContainerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`

const ButtonFormItem = styled(Form.Item)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;

  @media (min-width: 1440px) {
    justify-content: flex-start;
    margin-top: 0;
  }

  button {
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }
  }
`

export const Styled = {
  Container,
  FlexContainer,
  FlexContainerItem,
  Resizer,
  ButtonFormItem,
}
