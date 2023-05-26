import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@features/auth/context/AuthContext";
import PrivateRoute from "@utils/PrivateRoute";
import SignIn from "@pages/auth/SignIn";
import SignUp from "@pages/auth/SignUp";
import InnerRouter from "@components/Router";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route element={<PrivateRoute />}>
              <Route path="*" element={<InnerRouter />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
