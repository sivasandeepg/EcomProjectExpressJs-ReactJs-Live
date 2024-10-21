// src/App.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // Import React Query
import Loader from './components/shared/Loader'; // Import your loader
 
// Lazy load the route components
const CustomerRoutes = lazy(() => import("./routes/CustomerRoutes"));
const VendorRoutes = lazy(() => import("./routes/VendorRoutes"));

// Create a QueryClient instance
const queryClient = new QueryClient();
 
const App = () => {
  return (
    // Wrap the entire app inside QueryClientProvider to make React Query available
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Customer routes */}
            <Route path="/*" element={<CustomerRoutes />} />
            
            {/* Admin routes */}
            <Route path="/vendor/*" element={<VendorRoutes />} /> 
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
 