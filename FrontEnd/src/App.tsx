import { AppRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'
import { ScrollToHash } from './components/ScrollToHash'
import { Toaster } from 'sonner'

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <AppRoutes />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: 'bg-millions-dark border border-white/10 text-white font-jost uppercase tracking-widest text-[0.7rem]',
        }}
      />
    </BrowserRouter>
  )
}

export default App