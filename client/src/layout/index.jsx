import { useSelector } from "react-redux";

// import DashboardDefault from '../views/dashboard/Default';
// import MainRoutes from '../routes';
// material-ui
import { useTheme } from "@mui/material/styles";
import { AppBar, Box, Toolbar } from "@mui/material";

// project imports
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();

  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  return (
    <Box sx={{ display: "flex" }}>
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened
            ? theme.transitions.create("width")
            : "none",
        }}
      >
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={leftDrawerOpened} />

      {/* main content */}
      <div style={{ marginTop: "120px" }}>
        <Outlet />
      </div>
    </Box>
  );
};

export default MainLayout;
