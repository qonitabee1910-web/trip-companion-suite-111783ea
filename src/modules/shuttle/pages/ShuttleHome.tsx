import { ResponsiveLayout } from "@/shared/components/ResponsiveLayout";
import { ShuttleSearchForm } from "../components/ShuttleSearchForm";
import { Bus } from "lucide-react";

const ShuttleHome = () => {
  return (
    <ResponsiveLayout mobileTitle="Cari Shuttle" mobileBack="/" mobileSubtitle="Tiket shuttle antar kota">
      <section className="bg-gradient-hero text-primary-foreground hidden md:block">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <Bus className="h-8 w-8" />
            <h1 className="text-3xl font-extrabold">Tiket Shuttle Antar Kota</h1>
          </div>
          <p className="text-white/85">Bandung, Jakarta, Yogyakarta dan kota lain dengan operator terpercaya.</p>
        </div>
      </section>

      <div className="container -mt-6 md:-mt-10 px-3 md:px-6 pt-4 md:pt-0">
        <ShuttleSearchForm />
      </div>

      <section className="container px-3 md:px-6 mt-8 pb-8">
        <h2 className="text-lg font-bold mb-3">Rute Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { from: "Jakarta", to: "Bandung", price: 135000 },
            { from: "Jakarta", to: "Bogor", price: 75000 },
            { from: "Bandung", to: "Yogyakarta", price: 250000 },
            { from: "Surabaya", to: "Malang", price: 80000 },
          ].map((r, i) => (
            <div key={i} className="p-4 rounded-lg border bg-card hover:shadow-card transition-shadow cursor-pointer">
              <p className="text-sm text-muted-foreground">{r.from} →</p>
              <p className="font-semibold">{r.to}</p>
              <p className="text-sm font-bold text-accent mt-2">mulai Rp{r.price.toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      </section>
    </ResponsiveLayout>
  );
};

export default ShuttleHome;
