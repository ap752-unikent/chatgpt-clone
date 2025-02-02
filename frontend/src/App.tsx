import { Provider as ChakraProvider } from "@/components/ui/provider"
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Main } from './pages/main';
import { QueryClientProvider, QueryClient} from "react-query";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path='/:chatId' element={<Main />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
