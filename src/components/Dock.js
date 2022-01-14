import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  SvgIcon,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import BrushIcon from "@mui/icons-material/Brush";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import MouseIcon from "@mui/icons-material/Mouse";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { useDispatch, useSelector } from "react-redux";
import { blue, grey } from "@mui/material/colors";
import { changeMode as changeModeDispatch } from "../redux/slices/mainModeSlice";
import { setActive as setActiveDispatch } from "../redux/slices/showDockSlice";

const LargeTextTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 16,
  },
}));

export default function Dock() {
  const dispatch = useDispatch();
  // main mode state selector
  const mainMode = useSelector((state) => state.mainMode);
  // Shapes menu states and functions
  const [shapesMenuAnchorEl, setShapesMenuAnchorEl] = useState(null);
  const shapesMenuOpen = Boolean(shapesMenuAnchorEl);
  const handleShapesClick = (event) => {
    setShapesMenuAnchorEl(event.currentTarget);
  };
  const handleShapesClose = () => {
    setShapesMenuAnchorEl(null);
  };
  // Animate menu states and functions
  const [animateMenuAnchorEl, setAnimateMenuAnchorEl] = useState(null);
  const animateMenuOpen = Boolean(animateMenuAnchorEl);
  const handleAnimateClick = (event) => {
    setAnimateMenuAnchorEl(event.currentTarget);
  };
  const handleAnimateClose = () => {
    setAnimateMenuAnchorEl(null);
  };
  // Show or hide dock state, from the store
  const showDock = useSelector((state) => state.showDock);
  // Show or hide dock state on UI, with a delay
  const [dockEnter, setDockEnter] = useState(true);

  useEffect(() => {
    if (shapesMenuOpen || animateMenuOpen) {
      dispatch(setActiveDispatch({ active: true }));
    } else {
      dispatch(setActiveDispatch({ active: false }));
    }
  }, [shapesMenuOpen, animateMenuOpen]);

  useEffect(() => {
    if (showDock.show) {
      setDockEnter(true);
    } else {
      setTimeout(() => {
        setDockEnter(false);
      }, 3000);
    }
  }, [showDock.show]);

  return (
    <Slide direction='left' in={dockEnter} mountOnEnter unmountOnExit>
      <Box sx={{ position: "absolute", right: 0 }}>
        <AppBar
          position='static'
          sx={{ borderRadius: "16px 0 0 16px", backgroundColor: "#FFFFFF" }}
        >
          <Toolbar style={{ padding: 16 }}>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                <LargeTextTooltip title='Select' placement='left'>
                  <IconButton
                    size='large'
                    onClick={() => {
                      // change main mode to select
                      dispatch(changeModeDispatch({ mode: "select" }));
                    }}
                  >
                    <SvgIcon fontSize='large'>
                      <path
                        style={{
                          stroke:
                            mainMode.mode === "select" ? blue[500] : grey[600],
                          fill:
                            mainMode.mode === "select" ? blue[500] : grey[600],
                          strokeWidth: "1px",
                          strokeMiterlimit: 10,
                        }}
                        d='M18.9,15.4L5.7,2.2C5.6,2.1,5.4,2.1,5.3,2.1C5.1,2.2,5,2.4,5,2.5v18.9c0,0.2,0.1,0.3,0.3,0.4c0,0,0.1,0,0.1,0
                      c0.1,0,0.2-0.1,0.3-0.1l4.8-5.6h8c0.2,0,0.3-0.1,0.4-0.3C19,15.7,19,15.5,18.9,15.4z'
                      />
                    </SvgIcon>
                  </IconButton>
                </LargeTextTooltip>
              </Grid>
              <Grid item>
                <LargeTextTooltip title='Brushes' placement='left'>
                  <IconButton size='large'>
                    <BrushIcon fontSize='large' />
                  </IconButton>
                </LargeTextTooltip>
              </Grid>
              <Grid item>
                <LargeTextTooltip title='Shapes' placement='left'>
                  <IconButton
                    size='large'
                    id='shapes-button'
                    aria-controls='shapes-menu'
                    aria-haspopup='true'
                    aria-expanded={shapesMenuOpen ? "true" : undefined}
                    onClick={handleShapesClick}
                    color={mainMode.mode === "shape" ? "primary" : "default"}
                  >
                    {mainMode.mode === "shape" ? (
                      mainMode.subMode === "line" ? (
                        <SvgIcon fontSize='large'>
                          <path
                            style={{
                              stroke: blue[500],
                              strokeWidth: "1px",
                              strokeMiterlimit: 10,
                            }}
                            d='M19.5,3c-0.7,0-1.3,0.5-1.5,1.2C10.8,4.9,4.9,10.7,4.2,17.9c-0.7,0.2-1.2,0.8-1.2,1.5C3,20.3,3.7,21,4.5,21
s1.6-0.7,1.6-1.6c0-0.7-0.4-1.2-1-1.5c0.7-6.7,6.1-12.2,12.8-12.8c0.2,0.6,0.8,1,1.5,1c0.9,0,1.6-0.7,1.6-1.6S20.3,3,19.5,3z'
                          />
                        </SvgIcon>
                      ) : mainMode.subMode === "ellipse" ? (
                        <SvgIcon fontSize='large'>
                          <path
                            style={{
                              stroke: blue[500],
                              strokeWidth: "1px",
                              strokeMiterlimit: 10,
                            }}
                            d='M12,3.5c-4.7,0-8.5,3.8-8.5,8.5c0,4.7,3.8,8.5,8.5,8.5c4.7,0,8.5-3.8,8.5-8.5C20.5,7.3,16.7,3.5,12,3.5z
			 M12,19.5c-4.1,0-7.5-3.4-7.5-7.5S7.9,4.5,12,4.5s7.5,3.4,7.5,7.5S16.1,19.5,12,19.5z'
                          />
                        </SvgIcon>
                      ) : mainMode.subMode === "rect" ? (
                        <CropSquareIcon fontSize='large' />
                      ) : mainMode.subMode === "quad" ? (
                        <SvgIcon fontSize='large'>
                          <path
                            style={{
                              stroke: blue[500],
                              strokeWidth: "1px",
                              strokeMiterlimit: 10,
                            }}
                            d='M3.7,17h11.7l5-10H8.7L3.7,17z M15.6,17.9H3c-0.2,0-0.3-0.1-0.4-0.2c-0.1-0.1-0.1-0.3,0-0.4
  L8,6.4c0.1-0.2,0.2-0.2,0.4-0.2H21c0.2,0,0.3,0.1,0.4,0.2c0.1,0.1,0.1,0.3,0,0.4L16,17.6C15.9,17.8,15.8,17.9,15.6,17.9z'
                          />
                        </SvgIcon>
                      ) : (
                        <SvgIcon fontSize='large'>
                          <path
                            style={{
                              stroke: blue[500],
                              strokeWidth: "1px",
                              strokeMiterlimit: 10,
                            }}
                            d='M19.8,16.8l-6.6-11c-0.5-0.9-1.8-0.9-2.4,0l-6.6,11c0,0,0,0,0,0c-0.6,0.9,0.1,2.1,1.2,2.1h13.2
			C19.7,18.9,20.4,17.7,19.8,16.8z M18.6,17.9H5.4c-0.3,0-0.6-0.4-0.4-0.7l6.6-11c0.2-0.3,0.6-0.3,0.8,0l6.6,11
			C19.2,17.6,19,17.9,18.6,17.9z'
                          />
                        </SvgIcon>
                      )
                    ) : (
                      <CropSquareIcon fontSize='large' />
                    )}
                  </IconButton>
                </LargeTextTooltip>
                <Menu
                  id='shapes-menu'
                  anchorEl={shapesMenuAnchorEl}
                  open={shapesMenuOpen}
                  onClose={handleShapesClose}
                  MenuListProps={{ "aria-labelledby": "shapes-button" }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      // change main mode to shape -> line
                      dispatch(
                        changeModeDispatch({ mode: "shape", subMode: "line" })
                      );
                      handleShapesClose();
                    }}
                  >
                    <ListItemIcon>
                      <SvgIcon fontSize='large'>
                        <path
                          style={{
                            stroke: grey[600],
                            strokeWidth: "1px",
                            strokeMiterlimit: 10,
                          }}
                          d='M19.5,3c-0.7,0-1.3,0.5-1.5,1.2C10.8,4.9,4.9,10.7,4.2,17.9c-0.7,0.2-1.2,0.8-1.2,1.5C3,20.3,3.7,21,4.5,21
		s1.6-0.7,1.6-1.6c0-0.7-0.4-1.2-1-1.5c0.7-6.7,6.1-12.2,12.8-12.8c0.2,0.6,0.8,1,1.5,1c0.9,0,1.6-0.7,1.6-1.6S20.3,3,19.5,3z'
                        />
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText>
                      <span style={{ fontSize: 16 }}>Line</span>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      // change main mode to shape -> ellipse
                      dispatch(
                        changeModeDispatch({
                          mode: "shape",
                          subMode: "ellipse",
                        })
                      );
                      // close the menu
                      handleShapesClose();
                    }}
                  >
                    <ListItemIcon>
                      <SvgIcon fontSize='large'>
                        <path
                          style={{
                            stroke: grey[600],
                            strokeWidth: "1px",
                            strokeMiterlimit: 10,
                          }}
                          d='M12,3.5c-4.7,0-8.5,3.8-8.5,8.5c0,4.7,3.8,8.5,8.5,8.5c4.7,0,8.5-3.8,8.5-8.5C20.5,7.3,16.7,3.5,12,3.5z
			 M12,19.5c-4.1,0-7.5-3.4-7.5-7.5S7.9,4.5,12,4.5s7.5,3.4,7.5,7.5S16.1,19.5,12,19.5z'
                        />
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText>
                      <span style={{ fontSize: 16 }}>Ellipse</span>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      // change main mode to shape -> rect
                      dispatch(
                        changeModeDispatch({ mode: "shape", subMode: "rect" })
                      );
                      handleShapesClose();
                    }}
                  >
                    <ListItemIcon>
                      <CropSquareIcon
                        sx={{ color: grey[600] }}
                        fontSize='large'
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <span style={{ fontSize: 16 }}>Rectangle</span>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      // change main mode to shape -> quad
                      dispatch(
                        changeModeDispatch({ mode: "shape", subMode: "quad" })
                      );
                      handleShapesClose();
                    }}
                  >
                    <ListItemIcon>
                      <SvgIcon fontSize='large'>
                        <path
                          style={{
                            stroke: grey[600],
                            strokeWidth: "1px",
                            strokeMiterlimit: 10,
                          }}
                          d='M3.7,17h11.7l5-10H8.7L3.7,17z M15.6,17.9H3c-0.2,0-0.3-0.1-0.4-0.2c-0.1-0.1-0.1-0.3,0-0.4
		L8,6.4c0.1-0.2,0.2-0.2,0.4-0.2H21c0.2,0,0.3,0.1,0.4,0.2c0.1,0.1,0.1,0.3,0,0.4L16,17.6C15.9,17.8,15.8,17.9,15.6,17.9z'
                        />
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText>
                      <span style={{ fontSize: 16 }}>Quadrilateral</span>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      // change main mode to shape -> triangle
                      dispatch(
                        changeModeDispatch({
                          mode: "shape",
                          subMode: "triangle",
                        })
                      );
                      handleShapesClose();
                    }}
                  >
                    <ListItemIcon>
                      <SvgIcon fontSize='large'>
                        <path
                          style={{
                            stroke: grey[600],
                            strokeWidth: "1px",
                            strokeMiterlimit: 10,
                          }}
                          d='M19.8,16.8l-6.6-11c-0.5-0.9-1.8-0.9-2.4,0l-6.6,11c0,0,0,0,0,0c-0.6,0.9,0.1,2.1,1.2,2.1h13.2
			C19.7,18.9,20.4,17.7,19.8,16.8z M18.6,17.9H5.4c-0.3,0-0.6-0.4-0.4-0.7l6.6-11c0.2-0.3,0.6-0.3,0.8,0l6.6,11
			C19.2,17.6,19,17.9,18.6,17.9z'
                        />
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText>
                      <span style={{ fontSize: 16 }}>Triangle</span>
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </Grid>
              <Grid item>
                <LargeTextTooltip title='Text' placement='left'>
                  <IconButton
                    size='large'
                    onClick={() => {
                      // change main mode to text
                      dispatch(changeModeDispatch({ mode: "text" }));
                    }}
                  >
                    <TextFieldsIcon
                      sx={{
                        color: mainMode.mode === "text" ? blue[500] : grey[600],
                      }}
                      fontSize='large'
                    />
                  </IconButton>
                </LargeTextTooltip>
              </Grid>
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <LargeTextTooltip title='Mouse Pressed' placement='left'>
                  <IconButton size='large'>
                    <MouseIcon fontSize='large' />
                  </IconButton>
                </LargeTextTooltip>
              </Grid>
              <Grid item>
                <LargeTextTooltip title='Key Down' placement='left'>
                  <IconButton size='large'>
                    <KeyboardIcon fontSize='large' />
                  </IconButton>
                </LargeTextTooltip>
              </Grid>
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <LargeTextTooltip title='Animate' placement='left'>
                  <IconButton
                    id='animate-button'
                    size='large'
                    onClick={handleAnimateClick}
                  >
                    <SvgIcon fontSize='large'>
                      <path
                        style={{
                          stroke:
                            mainMode.mode === "animate" ? blue[500] : grey[600],
                          fill:
                            mainMode.mode === "animate" ? blue[500] : grey[600],
                          strokeWidth: "1px",
                          strokeMiterlimit: 10,
                        }}
                        d='M21.3,8.2c-0.6-0.9-1.6-2.1-2.7-2c-0.2-0.3-0.8-1.3-1.4-2.3c-0.6-1.1-1.8-2.1-2.2-1.4c-0.1,0.1-0.1,0.6,0.5,1.8
				C15,3.7,14.6,3,14,2.8c-0.7-0.3-1.2,0.1-0.5,1.6c1.2,2.9,1.4,3.7,1.3,4.1c0,0.2-0.2,0.4-0.5,0.2c-1.1-0.5-3.6-1-4.5-1
				c-4.3,0-5.5,2.8-6.2,4.3c0,0-0.6,1.5-0.6,4.2C2.5,15.7,2,15,1.6,15C1.2,15,1,15.3,1,16c0,0.7,0.8,2.1,1.9,2.8
				c0.2,0.2,0.5,0.2,0.8,0c0.1-0.1,0.2-0.1,0.2-0.1c0.5,0.5,0.9,0.8,1.3,1.1c1,1.4,0.8,1.2,5.7,1.9c0,0,0.7,0.1,1-0.5
				c0.2-0.6-0.1-1-0.6-1.4c-0.1-0.1-0.5-0.3-0.7-0.4c2.6,0.3,4.5,0.6,4.8,0.8c0.3,0.8,1,1.2,2.1,1.4c0.5,0,0.8-0.2,1-0.6
				c0.3-0.7-0.6-1.3-1.1-1.6c-0.5-0.3-0.7-0.9-0.7-1c0,0,0,0,0,0c0.7-0.4,1.4-1,2-1.9c0.5-0.8,0.8-1.6,0.9-2.3c0.7,0,1.6-0.6,2.3-1
				c0.8-0.5,1.2-1.2,1.2-1.9C23,10.3,22.2,9.5,21.3,8.2z M19,9.3c-0.3,0-0.6-0.3-0.6-0.6c0-0.3,0.3-0.6,0.6-0.6
				c0.3,0,0.6,0.3,0.6,0.6C19.5,9.1,19.3,9.3,19,9.3z'
                      />
                    </SvgIcon>
                  </IconButton>
                </LargeTextTooltip>
                <Menu
                  id='animate-menu'
                  anchorEl={animateMenuAnchorEl}
                  open={animateMenuOpen}
                  onClose={handleAnimateClose}
                  MenuListProps={{ "aria-labelledby": "animate-button" }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      dispatch(
                        changeModeDispatch({
                          mode: "animate",
                          subMode: "properties",
                        })
                      );
                      handleAnimateClose();
                    }}
                  >
                    <ListItemText>
                      <span style={{ fontSize: 16 }}>Properties Mode</span>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      dispatch(
                        changeModeDispatch({
                          mode: "animate",
                          subMode: "record",
                          status: "ready",
                        })
                      );
                      handleAnimateClose();
                    }}
                  >
                    <ListItemText>
                      <span style={{ fontSize: 16 }}>Free Mode</span>
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </Slide>
  );
}
