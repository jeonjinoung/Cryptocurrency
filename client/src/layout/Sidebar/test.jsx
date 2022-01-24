import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MenuList from './MenuList';

const Sidebar = () => {
    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: '13vw', padding: '1vw', margin: '3.2vw 2vw 0 0'}} >
            <div>
              <MenuList />
            </div>
        </Box>
    );
};

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
};

export default Sidebar;
