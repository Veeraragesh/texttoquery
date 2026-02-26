import React, { useState, useMemo, useRef } from "react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";

import axios from "axios";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Divider,
  Paper,
  MenuItem,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DarkMode, LightMode, ContentCopy } from "@mui/icons-material";
import { motion } from "framer-motion";

const drawerWidth = 280;
const TOPBAR_HEIGHT = 52; 

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [dbType, setDbType] = useState("postgresql");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const centerRef = useRef(null);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
        typography: {
          fontFamily: "Inter, sans-serif",
          h5: {
            fontWeight: 700,
          },
          subtitle1: {
            fontWeight: 600,
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                height: TOPBAR_HEIGHT,
                justifyContent: "center",
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const handleSubmit = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const response = await axios.post("http://localhost:8000/query", {
        db_config: {
          db_type: dbType,
          host,
          port: port ? parseInt(port) : undefined,
          username,
          password,
          database,
        },
        prompt,
      });

      const end = performance.now();
      setExecutionTime(((end - start) / 1000).toFixed(2));
      setResult(response.data);
      setHistory((prev) => [{ prompt, time: new Date().toLocaleTimeString() }, ...prev]);
      if (centerRef.current) centerRef.current.scrollTop = 0;
    } catch (err) {
      alert("Invalid credentials or something went wrong");
      const msg = err.response?.data?.detail || err.message || "Error";
      setResult({ generated_sql: null, data: [], error: msg });
    } finally {
      setLoading(false);
      

    }
  };

  const columns = useMemo(() => {
    if (result?.data?.length > 0) {
      return Object.keys(result.data[0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 120,
      }));
    }

    //  Fallback column to avoid "No columns"
    return [
      {
        field: "empty",
        headerName: "",
        flex: 1,
      },
    ];
  }, [result]);

  const rows =
    result?.data?.map((row, index) => ({
      id: index,
      ...row,
    })) || [];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Root Layout - Column */}
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* FULL WIDTH TOP BAR */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            height: TOPBAR_HEIGHT,
            backgroundColor: "transparent",
            color: (t) => (t.palette.mode === "dark" ? "#fff" : "#111"),
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Toolbar variant="dense" sx={{ minHeight: TOPBAR_HEIGHT, px: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 0.4,
                fontFamily: "Inter, sans-serif",
              }}
            >
              TEXT TO QUERY
            </Typography>

            <Box sx={{ flex: 1 }} />

            <IconButton onClick={() => setDarkMode((v) => !v)} color="inherit" size="large">
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* SIDEBAR */}
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                top: TOPBAR_HEIGHT,
                height: `calc(100% - ${TOPBAR_HEIGHT}px)`,
              },
            }}
          >
            <Box sx={{ p: 2, height: "100%", overflowY: "auto" }}>
              {/* smaller sidebar heading */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, letterSpacing: 0.4, mb: 1, fontSize: 13 }}
              >
                Query History
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {history.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                    No queries yet
                  </Typography>
                )}
                {history.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText primary={item.prompt} secondary={item.time} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          {/* MAIN CONTENT */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Database Config Bar */}
            <Box
              sx={{
                px: 3,
                py: 1,
                height: 84,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 2,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <TextField
                  select
                  label="DB"
                  value={dbType}
                  onChange={(e) => setDbType(e.target.value)}
                  size="small"
                >
                  <MenuItem value="postgresql">PostgreSQL</MenuItem>
                  <MenuItem value="mysql">MySQL</MenuItem>
                </TextField>

                <TextField label="Host" value={host} size="small" onChange={(e) => setHost(e.target.value)} />

                <TextField label="Port" value={port} size="small" onChange={(e) => setPort(e.target.value)} />

                <TextField label="User" value={username} size="small" onChange={(e) => setUsername(e.target.value)} />

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  size="small"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <TextField label="Database" value={database} size="small" onChange={(e) => setDatabase(e.target.value)} />
              </Box>
            </Box>

            <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", overflow: "hidden" }} ref={centerRef}>
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  fontFamily: "JetBrains Mono, monospace",
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#0b0b0b" : "#f5f5f5"),
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Generated SQL
                  </Typography>

                  <Tooltip title="Copy SQL">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (result?.generated_sql) navigator.clipboard.writeText(result.generated_sql);
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ mt: 1, whiteSpace: "pre-wrap", fontSize: 13 }}>{result?.generated_sql || "No query yet"}</Box>
              </Paper>

              {/* Info row */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">Rows: {rows.length}</Typography>
              </Box>

              {/* Data table wrapper: keep headers & SQL fixed, only rows scroll */}
              <Paper sx={{ flex: 1, p: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                <DataGrid
                  rows={rows}
                  columns={columns}
                  density="compact"
                  disableRowSelectionOnClick
                  slots={{
                    noRowsOverlay: () => (
                      <Box
                        sx={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.9rem",
                          color: "text.secondary",
                        }}
                      >
                        No data
                      </Box>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    "& .MuiDataGrid-virtualScroller": {
                      overflowY: "auto",
                    },
                  }}
                />
              </Paper>
            </Box>

            {/* Bottom Prompt Bar */}
            <Box
              sx={{
                px: 3,
                py: 1,
                height: 84,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TextField placeholder="Type your query in English..." value={prompt} onChange={(e) => setPrompt(e.target.value)} fullWidth size="small" />

              <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={18} color="inherit" /> : "Run"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}