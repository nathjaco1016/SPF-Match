import { Routes, Route, Link } from "react-router-dom";

import Home from "./Home.jsx"
import Questionnaire from "./Questionnaire.jsx"
import Blog from "./Blog.jsx"
import Sunscreen from "./Sunscreen.jsx"

function App() {

  return(


    <>
      {/* nav */}
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/questionnaire">Questionnaire</Link> |{" "}
        <Link to="/blog">Blog</Link> |{" "}
        <Link to="/data">Data</Link> |{" "}
      </nav>

      {/* routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/data" element={<Sunscreen />} />
      </Routes>
    </>
  );
}

export default App
