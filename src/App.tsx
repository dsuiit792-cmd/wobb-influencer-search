import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        {/*
         * key="profile" remounts the component when navigating between
         * different profiles, preventing stale state from a previous visit.
         */}
        <Route path="/profile/:username" element={<ProfileDetailPage key="profile" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
