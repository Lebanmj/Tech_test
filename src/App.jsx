import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobsListPage from "./pages/JobsListPage";
import JobDetailsPage from "./pages/JobDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* List Page */}
        <Route path="/" element={<JobsListPage />} />

        {/* Details Page */}
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
