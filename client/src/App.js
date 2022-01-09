import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material';

import MainLayout from './layout';

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
                    <Route path="/" element={<MainLayout />} />
                </Routes>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
