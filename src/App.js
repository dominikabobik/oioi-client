import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Home />
                {/* {sessionStorage.getItem("username") !== "" ? (
                  <Home socket={socket} />
                ) : (
                  <Username />
                )} */}
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
