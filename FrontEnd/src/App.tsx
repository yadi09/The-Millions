import { AppRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  )
}

export default App