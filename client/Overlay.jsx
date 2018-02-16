import FullScreen from './FullScreen'

export default FullScreen.extend`
  background: ${props => props.background};
  opacity: ${props => props.opacity};
`
