import React, { useEffect, useState, useLayoutEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { tooltipClasses } from "@mui/material/Tooltip";
import { changeMode } from "../redux/slices/mainModeSlice";

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

const LargeTextTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 16,
  },
}));

export default function PropertyDisplay({ updateDrawData }) {
  // Window width and height states
  const [windowWidth, windowHeight] = useWindowSize();
  const dispatch = useDispatch();
  // The data from drawEllipse reducer, which is the shape data of ellipse
  const ellipseStats = useSelector((state) => state.drawEllipse);
  const mainMode = useSelector((state) => state.mainMode);
  const [animationData, setAnimationData] = useState([]);

  useEffect(() => {
    if (mainMode.mode === "animate" && mainMode.subMode === "properties") {
      const newData = {};
      Object.assign(newData, ellipseStats);
      if (animationData.length > 0) {
        if (animationData.length === 1) {
          animationData[0].startTime = Date.now() - 30;
        }
        const timeNow = Date.now();
        newData.time = timeNow - animationData[0].startTime;
        if (
          newData.time - animationData[animationData.length - 1].time > 100 &&
          animationData.length > 1
        ) {
          setAnimationData([...animationData, newData]);
        } else if (animationData.length === 1) {
          setAnimationData([...animationData, newData]);
        }
      } else {
        newData.time = 0;
        newData.startTime = Date.now();
        setAnimationData([...animationData, newData]);
      }
    }
  }, [mainMode, ellipseStats]);

  // useEffect(() => {
  //   const drawData = animationData.map((d) => ({
  //     id: d.id,
  //     shape: "ellipse",
  //     position: `${d.x}, ${d.y}`,
  //     radiusX: d.rx,
  //     radiusY: d.ry,
  //     deg: d.deg,
  //   }));
  //   updateDrawData(false, drawData);
  // }, [animationData]);

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        bottom: windowHeight / 2,
        transform: "translate(0, 50%)",
      }}
    >
      <Paper
        sx={{
          position: "relative",
          minWidth: 248,
          height: 600,
          borderRadius: "0 16px 16px 0",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
        }}
        elevation={4}
      >
        <Grid item>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <LargeTextTooltip title='Cancel' placement='right'>
                <IconButton
                  size='small'
                  onClick={() => {
                    dispatch(
                      changeMode({ mode: null, subMode: null, status: null })
                    );
                  }}
                >
                  <CancelOutlinedIcon />
                </IconButton>
              </LargeTextTooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item flex={1} overflow='auto'>
          <Grid container>
            <Table size='small' aria-label='properties table'>
              <TableHead>
                <TableRow>
                  <TableCell>Time Elapsed</TableCell>
                  <TableCell>x</TableCell>
                  <TableCell>y</TableCell>
                  <TableCell>radiusX</TableCell>
                  <TableCell>radiusY</TableCell>
                  <TableCell>degrees</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {animationData.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{d.time}</TableCell>
                    <TableCell>{+d.x.toFixed(2)}</TableCell>
                    <TableCell>{+d.y.toFixed(2)}</TableCell>
                    <TableCell>{+d.rx.toFixed(2)}</TableCell>
                    <TableCell>{+d.ry.toFixed(2)}</TableCell>
                    <TableCell>{+d.deg.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
