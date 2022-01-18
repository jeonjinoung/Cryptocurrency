import PropTypes from 'prop-types';
import Axios from "axios";

import { useTheme, styled } from '@mui/material/styles';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

import MainCard from '../../../ui-component/cards/MainCard';

import { useEffect, useState } from 'react';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const TotalIncomeLightCard = ({ isLoading }) => {
    const theme = useTheme();
    const [SuccessPeer, setSuccessPeer] = useState([]);

    useEffect(() => {
        Axios.get("/api/peer/peers").then((response) => {
            setSuccessPeer(response.data.peer)
        })
    }, [])

    return (
        <>
            {SuccessPeer && SuccessPeer.map((peer) => {
                return <CardWrapper border={false} content={false}>
                <Box sx={{ p: 2 }}>
                    <List sx={{ py: 0 }}>
                        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={<Typography variant="subtitle2">연결된 노드</Typography>}
                                secondary={
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            color: theme.palette.grey[500],
                                            mt: 0.5
                                        }}
                                    >
                                        {peer}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </Box>
            </CardWrapper>
            })}
        </>
    );
};

TotalIncomeLightCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalIncomeLightCard;
