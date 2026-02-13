import { AppRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'
import { TestimonialProvider } from './context/TestimonialContext'

const App = () => {
  return (
    <TestimonialProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TestimonialProvider>
  )
}

export default App