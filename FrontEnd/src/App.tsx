import { AppRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'
import { ScrollToHash } from './components/ScrollToHash'

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App