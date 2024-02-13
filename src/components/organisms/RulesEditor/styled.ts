import styled from 'styled-components'

const Container = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background: whitesmoke;
`

const Loader = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Styled = {
  Container,
  Loader,
}
