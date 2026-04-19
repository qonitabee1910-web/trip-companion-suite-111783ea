import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { SeatEditorPanel } from "@/modules/shuttle/components/SeatEditorPanel";
import type { VehicleId, ServiceTier } from "@/modules/shuttle/data/seatLayouts";

const VALID_VEHICLES: VehicleId[] = ["hiace", "suv", "minicar"];
const VALID_TIERS: ServiceTier[] = ["reguler", "semi-executive", "executive"];

const AdminSeatEditor = () => {
  const [params] = useSearchParams();
  const v = params.get("vehicle") as VehicleId | null;
  const t = params.get("tier") as ServiceTier | null;
  const initialVehicle = v && VALID_VEHICLES.includes(v) ? v : undefined;
  const initialTier = t && VALID_TIERS.includes(t) ? t : undefined;

  return (
    <AdminLayout title="Seat Layout Editor">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h2 className="font-semibold">Editor Denah Kursi</h2>
          <p className="text-xs text-muted-foreground">
            Pilih kombinasi kendaraan × service. Layout tersimpan langsung dipakai pada tampilan user.
          </p>
        </div>
        <SeatEditorPanel initialVehicle={initialVehicle} initialTier={initialTier} />
      </div>
    </AdminLayout>
  );
};

export default AdminSeatEditor;
