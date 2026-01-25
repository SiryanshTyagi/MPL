import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import PlayerList from "./PlayerList"; // We will create this next
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

function App() {
  return (
    <Router>
      {/* Navigation stays visible on all pages */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MPL 2026
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Register
          </Button>
          <Button color="inherit" component={Link} to="/MPL/List-private">
            Players
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/MPL/List-private" element={<PlayerList />} />
      </Routes>
    </Router>
  );
}

export default App;
