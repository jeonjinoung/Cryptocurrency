import { useSelector } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material";

import MainLayout from "./layout";
import Dashboard from "./views/dashboard/Default";
import UserDefault from "./views/User";
import BlockDefault from "./views/Block";
import WalletDefault from "./views/Wallet";
import LoginDefault from "./views/Login";

// defaultTheme
import themes from "./themes";
import { Route, Routes } from "react-router-dom";

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <Routes>
          <Route path="" element={<LoginDefault />}>
            <Route path="/free/*" element={<MainLayout />}>
              <Route path="" element={<Dashboard />} />
              <Route path="user" element={<UserDefault />} />
              <Route path="block" element={<BlockDefault />} />
              <Route path="wallet" element={<WalletDefault />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
