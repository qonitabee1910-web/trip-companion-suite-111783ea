import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound.tsx";

import HotelHome from "./modules/hotel/pages/HotelHome";
import HotelSearch from "./modules/hotel/pages/HotelSearch";
import HotelDetail from "./modules/hotel/pages/HotelDetail";
import HotelBooking from "./modules/hotel/pages/HotelBooking";

import ShuttleHome from "./modules/shuttle/pages/ShuttleHome";
import ShuttleSearch from "./modules/shuttle/pages/ShuttleSearch";
import ShuttleBooking from "./modules/shuttle/pages/ShuttleBooking";
import SeatLayoutEditor from "./modules/shuttle/pages/SeatLayoutEditor";
import ShuttleRayon from "./modules/shuttle/pages/ShuttleRayon";
import ShuttleService from "./modules/shuttle/pages/ShuttleService";
import ShuttleVehicle from "./modules/shuttle/pages/ShuttleVehicle";

import RideHome from "./modules/ride/pages/RideHome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/hotel" element={<HotelHome />} />
          <Route path="/hotel/search" element={<HotelSearch />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/hotel/:id/book" element={<HotelBooking />} />

          <Route path="/shuttle" element={<ShuttleHome />} />
          <Route path="/shuttle/rayon/:id" element={<ShuttleRayon />} />
          <Route path="/shuttle/service" element={<ShuttleService />} />
          <Route path="/shuttle/vehicle" element={<ShuttleVehicle />} />
          <Route path="/shuttle/book" element={<ShuttleBooking />} />
          <Route path="/shuttle/search" element={<ShuttleSearch />} />
          <Route path="/shuttle/seat-editor" element={<SeatLayoutEditor />} />
          <Route path="/shuttle/:id/book" element={<ShuttleBooking />} />

          <Route path="/ride" element={<RideHome />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
