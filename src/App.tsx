import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { Routes, Route } from "react-router-dom";
import Topbar from "./pages/global/Topbar";
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const [theme, colorMode] = useMode();
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
              <main className="content">
                <Topbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                </Routes>
              </main>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider >
      </ QueryClientProvider >
    </>
  )
}
