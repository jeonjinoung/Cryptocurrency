import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material';

import MainLayout from './layout';
import UserLayout from './layout/User';

// defaultTheme
import themes from './themes';
import { Route, Routes } from 'react-router-dom';


// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <Routes>
                    <Route path="/free" element={<MainLayout />} />
                    <Route path="/free/user" element={<UserLayout />} />
                </Routes>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
