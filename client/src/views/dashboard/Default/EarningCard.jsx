import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import Axios from "axios";

import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonEarningCard from '../../../ui-component/cards/Skeleton/EarningCard';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading }) => {
    const [BodyBlock, setBodyBlock] = useState([]);    
    const [HeaderBlock, setHeaderBlock] = useState({});    
    const [PreviousHash, setPreviousHash] = useState('');    
    const [MerkleRoot, setMerkleRoot] = useState('');    
    const theme = useTheme();

    const { index, timestamp, version } = HeaderBlock;
    const previousHashDisplay = `${PreviousHash.substring(0, 15)}...`;
    const merkleRootDisplay = `${MerkleRoot.substring(0, 15)}...`;

    useEffect(() => {
        Axios.get('/api/block/lastBlock')
        .then(response => {
            setBodyBlock(response.data.body)
            setHeaderBlock(response.data.header)
            setPreviousHash(response.data.header.previousHash)
            setMerkleRoot(response.data.header.merkleRoot)
            setHeaderBlock(response.data.header)
        });
    }, [])

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 6.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.secondary[800],
                                                mt: 1
                                            }}
                                        >
                                            {/* <img src={EarningIcon} alt="Notification" /> */}
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        LAST BLOCK
                                    </Grid>
                                    <Grid item>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            {BodyBlock}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                cursor: 'pointer',
                                                ...theme.typography.smallAvatar,
                                                backgroundColor: theme.palette.secondary[200],
                                                color: theme.palette.secondary.dark
                                            }}
                                        >
                                            <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.secondary[200]
                                    }}
                                >
                                    <div>Index : {index}</div>
                                    <div>PreviousHash : {previousHashDisplay}</div>
                                    <div>Timestamp : {new Date(timestamp).toLocaleString()}</div>
                                    <div>MerkleRoot : {merkleRootDisplay}</div>
                                    <div>Version : {version}</div>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper> 

            )}
        </>
    );
};

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default EarningCard;
