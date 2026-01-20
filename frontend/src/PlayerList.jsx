import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Dialog,
  DialogContent,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Box,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // State to track which player's card to show
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/mpl/players`);
        setPlayers(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 10 }} />;

  // Client-side filtering: search by regNumber, _id or name, and filter by role/category
  const normalized = (s) => String(s || "").toLowerCase();
  const filteredPlayers = players.filter((p) => {
    const q = normalized(searchTerm).trim();
    const matchesQuery =
      q === "" ||
      normalized(p.regNumber).includes(q) ||
      normalized(p._id).includes(q) ||
      normalized(p.name).includes(q);

    const matchesFilter =
      filter === "all" ||
      (filter === "U19" && Number(p.age) < 19) ||
      (filter === "A40" && Number(p.age) >= 40) ||
      normalized(p.category).includes(normalized(filter)) ||
      normalized(p.style).includes(normalized(filter));

    return matchesQuery && matchesFilter;
  });

  const PLACEHOLDER = "https://via.placeholder.com/600x400?text=No+Image";

  const resolveImage = (val) => {
    if (!val) return PLACEHOLDER;
    if (typeof val === "string") return val;
    if (val.secure_url) return val.secure_url;
    if (val.url) return val.url;
    if (val.path) return val.path;
    return PLACEHOLDER;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Total Players {players.length}
      </Typography>

      <AppBar position="static" color="inherit" elevation={0} sx={{ mb: 2 }}>
        <Toolbar sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by ID or name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Batter">Batter</MenuItem>
              <MenuItem value="Bowler">Bowler</MenuItem>
              <MenuItem value="Keeper">Keeper</MenuItem>
              <MenuItem value="All-Rounder">All-Rounder</MenuItem>
              <MenuItem value="U19">U19</MenuItem>
              <MenuItem value="A40">A40</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              {/* New Column */}
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Category</TableCell>
              <TableCell sx={{ color: "white" }}>Style</TableCell>
              <TableCell sx={{ color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((p) => (
              <TableRow
                key={p._id}
                hover
                onClick={() => setSelectedPlayer(p)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <strong>#{p.regNumber}</strong>
                </TableCell>
                {/* Display ID */}
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.style}</TableCell>
                <TableCell>
                  <Button size="small" variant="text">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- PLAYER DETAIL CARD MODAL --- */}
      <Dialog
        open={Boolean(selectedPlayer)}
        onClose={() => setSelectedPlayer(null)}
        maxWidth="xs"
        fullWidth
        scroll="paper" // 1. Tells Dialog to scroll the internal content
      >
        {selectedPlayer && (
          <>
            {/* Close button fixed at the top right */}
            <IconButton
              onClick={() => setSelectedPlayer(null)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                zIndex: 10, // Ensure it stays on top of everything
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* 2. DialogContent is REQUIRED for scroll="paper" to work */}
            <DialogContent sx={{ p: 0 }}>
              <Card sx={{ borderRadius: 0, boxShadow: "none" }}>
                <Box sx={{ width: "100%", bgcolor: "#f5f5f5" }}>
                  <Box
                    component="img"
                    src={resolveImage(selectedPlayer.photo)}
                    alt={selectedPlayer.name}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    sx={{
                      width: "100%",
                      maxHeight: "350px",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedPlayer.name}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    Registration ID: #{selectedPlayer.regNumber}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {selectedPlayer.style} ({selectedPlayer.hand})
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* All details are now inside the scrollable area */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Typography variant="body2">
                      <strong>Age:</strong> {selectedPlayer.age}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Mobile:</strong> {selectedPlayer.mobile}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Aadhaar:</strong> {selectedPlayer.aadhar}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Category:</strong> {selectedPlayer.category}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      <strong>Fee Paid:</strong> ₹
                      {selectedPlayer.registrationFee}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {selectedPlayer.address}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Payment Proof Screenshot:
                  </Typography>
                  <Box
                    component="img"
                    src={resolveImage(selectedPlayer.screenshot)}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                    sx={{
                      width: "100%",
                      borderRadius: 1,
                      border: "1px solid #eee",
                      objectFit: "contain",
                      maxHeight: "400px", // Limits the payment proof height
                    }}
                  />
                </CardContent>
              </Card>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
