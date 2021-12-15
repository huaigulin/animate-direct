import React, { useState, useLayoutEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import { useDispatch } from "react-redux";
import { changeMode } from "../redux/slices/animateModeSlice";

const LargeTextTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 16,
  },
}));

/**
 * Custom hook to monitor window height and width
 * @returns [windowWidth, windowHeight]
 */
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

const useStyles = makeStyles({
  select: {
    padding: "8px 16px",
  },
  selectRoot: {
    paddingTop: 8,
  },
  buttonBase: {
    textTransform: "capitalize",
  },
});

export default function AnimateControl() {
  const classes = useStyles();
  const dispatch = useDispatch();
  // Window width and height states
  const [windowWidth, windowHeight] = useWindowSize();
  // How fast the animation performance should be recorded
  const [recordSpeed, setRecordSpeed] = useState();
  const [recordSpeedTooltipOpen, setRecordSpeedTooltipOpen] = useState(false);

  const handleRecordSpeedSelectChange = (event) => {
    setRecordSpeed(event.target.value);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 80,
        left: windowWidth / 2,
        transform: "translate(-50%, 0)",
      }}
    >
      <AppBar
        position='relative'
        sx={{ backgroundColor: "#FFFFFF", borderRadius: "16px" }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems='center'>
            <Grid item>
              <LargeTextTooltip title='Cancel' placement='top'>
                <IconButton
                  size='small'
                  onClick={() => {
                    dispatch(changeMode({ mode: null, status: null }));
                  }}
                >
                  <CancelOutlinedIcon />
                </IconButton>
              </LargeTextTooltip>
            </Grid>
            <Grid item className={classes.selectRoot}>
              <LargeTextTooltip
                title='Record Speed'
                placement='top'
                open={recordSpeedTooltipOpen}
              >
                <FormControl sx={{ minWidth: 104 }}>
                  <Select
                    classes={{ select: classes.select }}
                    value={recordSpeed}
                    onChange={handleRecordSpeedSelectChange}
                    onPointerEnter={() => {
                      setRecordSpeedTooltipOpen(true);
                    }}
                    onPointerLeave={() => {
                      setRecordSpeedTooltipOpen(false);
                    }}
                    onPointerDown={() => {
                      setRecordSpeedTooltipOpen(false);
                    }}
                    displayEmpty
                    inputProps={{ "aria-label": "Select record speed" }}
                    defaultValue={1}
                  >
                    <MenuItem value={1}>
                      <Typography>Normal</Typography>
                    </MenuItem>
                    <MenuItem value={0.75}>
                      <Typography>0.75</Typography>
                    </MenuItem>
                    <MenuItem value={0.5}>
                      <Typography>0.5</Typography>
                    </MenuItem>
                    <MenuItem value={0.25}>
                      <Typography>0.25</Typography>
                    </MenuItem>
                  </Select>
                </FormControl>
              </LargeTextTooltip>
            </Grid>
            <Grid item style={{ height: 64 }}>
              <Divider orientation='vertical' />
            </Grid>
            <Grid item>
              <Button
                variant='contained'
                classes={{ root: classes.buttonBase }}
                endIcon={<SpaceBarIcon />}
                onClick={() => {
                  dispatch(changeMode({ mode: "record", status: "yes" }));
                }}
              >
                <Typography>Record</Typography>
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
