import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "@/App";
import List from "@/pages/listProject/list";
import ProjectDetails from "@/pages/[projectName]/page";
import Published from "@/pages/published/page";
import UpdateProduct from "@/pages/updateProduct.tsx/page";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/list" element={<List />} />
        <Route
          path="/project/:name"
          element={<ProjectDetails />}
        />
        <Route
          path="/project/:projectName/edit"
          element={<UpdateProduct />}
        />
        <Route
          path="/publised"
          element={<Published />}
        />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}
