import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  adminRoutes,
  authRoutes,
  labAttendantRoutes,
  librarianRoutes,
  routes,
} from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/admin/Dashboard";

import { useEffect, useRef } from "react";
import { loadUser } from "./redux/actions/user";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./pages/other/Loading";
import toast, { Toaster } from "react-hot-toast";
import { sLabAttendantRoutes, sLibrarianRoutes } from "./routes/sidebarRoute";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import Profile from "./pages/other/Profile";
import MyRequests from "./pages/other/MyRequests";
import LibraryItemsView from "./pages/admin/library-items/library-items";
import DiscussionRoomView from "./pages/admin/discusion-room/discussion-room";
import LabResources from "./pages/admin/lab-resources/lab-resources";
import NotificationScreen from "./pages/admin/notifications/notifications";
import ProfileScreen from "./pages/admin/profile/profile";
import UserProfileScreen from "./pages/admin/profile/profile";
import VerifyEmail from "./pages/auth/VerifyEmail"; // <-- Add this import

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error, message } = useSelector(
    (state) => state.user
  );
  const {
    loading: libraryLoading,
    error: libraryError,
    message: libraryMessage,
  } = useSelector((state) => state.library);

  // Use refs to track if messages have been shown
  const messageShownRef = useRef({});

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    // Only show the message if it's not the registration success message
    if (
      message &&
      message !== "Account Created Successfully" &&
      !messageShownRef.current[message]
    ) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
      messageShownRef.current[message] = true;
    }

    if (error && !messageShownRef.current[error]) {
      toast.error(error);
      dispatch({ type: "clearError" });
      messageShownRef.current[error] = true;
    }
  }, [error, message, dispatch]);

  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  return loading ? (
    <Loading />
  ) : (
    <ReactLenis root>
      <Router>
        {/* Show Header to all users */}
        <Header isAuthenticated={isAuthenticated} user={user} />

        {/* Single Toaster instance */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "gilroy_medium",
              background: "#333",
              color: "#fff",
              border: "1px solid #666",
            },
            success: {
              style: {
                background: "#10B981",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "#EF4444",
                color: "#fff",
              },
            },
          }}
        />

        <div className="min-h-screen pt-[80px] lg:pt-[85px]">
          <Routes>
            {/* Add the verification route here */}
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route
              path="/me"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  redirect={"/login"}
                >
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-requests"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  redirect={"/login"}
                >
                  <MyRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/desk"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  redirect={"/login"}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/library-items"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  redirect={"/login"}
                >
                  <LibraryItemsView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/discussion-room"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  redirect={"/login"}
                >
                  <DiscussionRoomView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-lab-resources"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  redirect={"/login"}
                >
                  <LabResources />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user-notifications"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  redirect={"/login"}
                >
                  <NotificationScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user-profile"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  redirect={"/login"}
                >
                  <UserProfileScreen />
                </ProtectedRoute>
              }
            />

            {routes.map((r, index) => (
              <Route key={index} path={r.path} element={<r.element />} />
            ))}

            {authRoutes.map((r, index) => (
              <Route
                key={index}
                path={r.path}
                element={
                  <ProtectedRoute
                    isAuthenticated={!isAuthenticated}
                    redirect={
                      user && user.role === "admin"
                        ? "/admin"
                        : user && user.role === "librarian"
                        ? "/librarian-view"
                        : user && user.role === "lab_attendant"
                        ? "/lab_attendant"
                        : user && (user.role === "student" || user.role === "teacher")
                        ? "/desk"
                        : "/"
                    }
                  >
                    <r.element title={r.title} />
                  </ProtectedRoute>
                }
              />
            ))}

            {adminRoutes.map((r, index) => (
              <Route
                key={index}
                path={r.path}
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    redirect="/login"
                  >
                    <Sidebar component={r.element} routes={adminRoutes} />
                  </ProtectedRoute>
                }
              />
            ))}

            {librarianRoutes.map((r, index) => (
              <Route
                key={index}
                path={r.path}
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    redirect="/login"
                  >
                    <r.element title={r.title} />
                  </ProtectedRoute>
                }
              />
            ))}

            {labAttendantRoutes.map((r, index) => (
              <Route
                key={index}
                path={r.path}
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    redirect="/login"
                  >
                    <r.element title={r.title} />
                  </ProtectedRoute>
                }
              />
            ))}
          </Routes>
        </div>
      </Router>
    </ReactLenis>
  );
};

export default App;