import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material';

// routing
import Routes from './routes';

import MainLayout from './layout';

// defaultTheme
import themes from './themes';


// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                {/* <Routes /> */}
                <MainLayout />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
