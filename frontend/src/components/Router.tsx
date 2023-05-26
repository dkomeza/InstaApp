import { Route, Routes } from "react-router-dom";
import { PostProvider } from "@/features/app/context/PostContext";
import { Home, Post } from "@pages/app";

import { Navbar } from "@/layouts";

import "@assets/styles/app/layout.scss";

function Router() {
  return (
    <PostProvider>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<Post />} />
          </Routes>
        </main>
      </div>
    </PostProvider>
  );
}

export default Router;
