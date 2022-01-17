import PropTypes from "prop-types";

import { styled, useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Typography } from "@mui/material";

import MainCard from "../../ui-component/cards/MainCard";

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

const BlocksCard = (props) => {
  const theme = useTheme();

  return (
    <>
      {props.Blocks &&
        props.Blocks.reverse().map((block) => {
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
        })}
    </>
  );
};

BlocksCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default BlocksCard;
