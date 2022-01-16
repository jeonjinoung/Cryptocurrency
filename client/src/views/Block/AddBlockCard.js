import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Axios from "axios";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from "@mui/material";

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import SkeletonEarningCard from "../../ui-component/cards/Skeleton/EarningCard";

// assets
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import GetAppTwoToneIcon from "@mui/icons-material/GetAppOutlined";
import FileCopyTwoToneIcon from "@mui/icons-material/FileCopyOutlined";
import PictureAsPdfTwoToneIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArchiveTwoToneIcon from "@mui/icons-material/ArchiveOutlined";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: "#fff",
  overflow: "hidden",
  position: "relative",
  margin: 10,
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: "50%",
    top: -85,
    right: -95,
    [theme.breakpoints.down("sm")]: {
      top: -105,
      right: -140,
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: "50%",
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down("sm")]: {
      top: -155,
      right: -70,
    },
  },
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const AddBlockCard = ({ isLoading }) => {
  const [Blocks, setBlocks] = useState([]);
  
  const blocks = {
    //배열로 넣어줘야된다. Block은 배열로 받았으니까
    data : ["복습을 해보자 Axios에대해서"]
  }

  const onSubmitAddBlock = (e) => {
    e.preventDefault();
    Axios.post("/api/mineBlock", blocks).then((response) => {
      console.log(response.data);
      if (response.data.success) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <form onSubmit={onSubmitAddBlock}>
        {isLoading ? (
          <SkeletonEarningCard />
        ) : (
          Blocks &&
          Blocks.reverse().map((block) => {
            return (
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
                              mt: 1,
                            }}
                          >
                            {/* <img src={EarningIcon} alt="Notification" /> */}
                          </Avatar>
                        </Grid>
                        <Grid item>{block.header.index + 1} 번째 블록</Grid>
                        <Grid item>
                          <Avatar
                            variant="rounded"
                            sx={{
                              ...theme.typography.commonAvatar,
                              ...theme.typography.mediumAvatar,
                              backgroundColor: theme.palette.secondary.dark,
                              color: theme.palette.secondary[200],
                              zIndex: 1,
                            }}
                            aria-controls="menu-earning-card"
                            aria-haspopup="true"
                            onClick={handleClick}
                          >
                            <MoreHorizIcon fontSize="inherit" />
                          </Avatar>
                          <Menu
                            id="menu-earning-card"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            variant="selectedMenu"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                          >
                            <MenuItem onClick={handleClose}>
                              <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> 1번 예정
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> 2번 예정
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> 3번
                              예정
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> 4번 예정
                            </MenuItem>
                          </Menu>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container alignItems="center">
                        <Grid item>
                          <Typography
                            sx={{
                              fontSize: "2.125rem",
                              fontWeight: 500,
                              mr: 1,
                              mt: 1.75,
                              mb: 0.75,
                            }}
                          >
                            {block.body}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Avatar
                            sx={{
                              cursor: "pointer",
                              ...theme.typography.smallAvatar,
                              backgroundColor: theme.palette.secondary[200],
                              color: theme.palette.secondary.dark,
                            }}
                          >
                            <ArrowUpwardIcon
                              fontSize="inherit"
                              sx={{ transform: "rotate3d(1, 1, 1, 45deg)" }}
                            />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item sx={{ mb: 1.25 }}>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 500,
                          color: theme.palette.secondary[200],
                        }}
                      >
                        {block.header.previousHash}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardWrapper>
            );
          })
        )}
        <button>블록추가</button>
      </form>
    </>
  );
};

AddBlockCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default AddBlockCard;
