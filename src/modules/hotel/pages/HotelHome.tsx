import { ResponsiveLayout } from "@/shared/components/ResponsiveLayout";
import { HotelSearchForm } from "../components/HotelSearchForm";
import { Hotel } from "lucide-react";

const HotelHome = () => {
  return (
    <ResponsiveLayout mobileTitle="Cari Hotel" mobileBack="/" mobileSubtitle="Penginapan terbaik di seluruh Indonesia">
      <section className="bg-gradient-hero text-primary-foreground hidden md:block">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <Hotel className="h-8 w-8" />
            <h1 className="text-3xl font-extrabold">Cari & Pesan Hotel</h1>
          </div>
          <p className="text-white/85">Temukan penginapan terbaik dengan harga kompetitif.</p>
        </div>
      </section>

      <div className="container -mt-6 md:-mt-10 md:px-6 px-3 pt-4 md:pt-0">
        <HotelSearchForm />
      </div>

      <section className="container px-3 md:px-6 mt-8 pb-8">
        <h2 className="text-lg font-bold mb-3">Destinasi Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600" },
            { name: "Yogyakarta", img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600" },
            { name: "Bandung", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600" },
            { name: "Jakarta", img: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600" },
          ].map((d) => (
            <div key={d.name} className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-card cursor-pointer group">
              <img src={d.img} alt={d.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-2 left-3 text-white font-bold">{d.name}</p>
            </div>
          ))}
        </div>
      </section>
    </ResponsiveLayout>
  );
};

export default HotelHome;
