import { useSelector } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material";

import MainLayout from "./layout";
import Dashboard from "./views/dashboard";
import PeerDefault from "./views/Peer";
import BlockDefault from "./views/Block";
import WalletDefault from "./views/Wallet";
// import UserDefault from "./views/User/index";
iiiimp;
import themes from "./themes";
import { Route, Routes } from "react-router-dom";

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <Routes>
          {/* <Route path="" element={<UserDefault />} /> */}
          <Route path="/*" element={<MainLayout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="user" element={<PeerDefault />} />
            <Route path="block" element={<BlockDefault />} />
            <Route path="wallet" element={<WalletDefault />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
