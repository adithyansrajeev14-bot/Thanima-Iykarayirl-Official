import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, ZoomIn, X, MapPin } from 'lucide-react';
import { GalleryItem } from '../types';

const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Dual-Control Training Fleet',
    category: 'fleet',
    image: '/src/assets/images/hero_driving_car_1790908090052.jpg',
    description: 'Modern, well-maintained training hatchbacks equipped with dual-brakes for maximum safety and comfort during initial road practice.',
    tag: 'Safety Fleet'
  },
  {
    id: 'g2',
    title: 'RTO-Standard H-Track & 8-Track Ground',
    category: 'ground',
    image: '/src/assets/images/ground_track_h_1790908104536.jpg',
    description: 'Dedicated private training ground with exact Kerala Motor Vehicle Department dimensions for reverse H-parking and figure 8 practice.',
    tag: 'Test Ground Track'
  },
  {
    id: 'g3',
    title: 'Two-Wheeler Balance & Clutch Training',
    category: 'twowheeler',
    image: '/src/assets/images/bike_training_1790908119701.jpg',
    description: 'Personalized 1-on-1 coaching for motorcycle with gear (MCWG) and scooter (MCWOG), emphasizing safety gear and cone maneuvering.',
    tag: 'Bike Practice'
  },
  {
    id: 'g4',
    title: 'First-Attempt Driving License Success',
    category: 'success',
    image: '/src/assets/images/license_success_1790908136486.jpg',
    description: 'Over 98% of our candidates clear their Sub-RTO Mallappally driving test on their first attempt with flying colors.',
    tag: '100% Pass Record'
  }
];

interface GallerySectionProps {
  gallery?: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery: propGallery }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>(propGallery || INITIAL_GALLERY_ITEMS);
  const [activeCategory, setActiveCategory] = useState<'all' | 'fleet' | 'ground' | 'twowheeler' | 'success'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (propGallery && propGallery.length > 0) {
      setGallery(propGallery);
    } else {
      fetch('/api/gallery')
        .then(res => res.json())
        .then(data => {
          if (data.gallery && data.gallery.length > 0) {
            setGallery(data.gallery);
          }
        })
        .catch(err => console.warn('Failed fetching gallery:', err));
    }
  }, [propGallery]);

  const filtered = activeCategory === 'all'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 mb-3">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Training Facilities & Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Training Ground & Modern Fleet
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Experience real ground tracks, dual-control cars, and joyful success stories at Thanima Iykarayil MDS, Mallappally.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full font-bold transition cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Photos
          </button>
          <button
            onClick={() => setActiveCategory('ground')}
            className={`px-4 py-2 rounded-full font-bold transition cursor-pointer ${
              activeCategory === 'ground'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            H-Track & 8-Track Ground
          </button>
          <button
            onClick={() => setActiveCategory('fleet')}
            className={`px-4 py-2 rounded-full font-bold transition cursor-pointer ${
              activeCategory === 'fleet'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Dual-Control Cars
          </button>
          <button
            onClick={() => setActiveCategory('twowheeler')}
            className={`px-4 py-2 rounded-full font-bold transition cursor-pointer ${
              activeCategory === 'twowheeler'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Two-Wheeler Training
          </button>
          <button
            onClick={() => setActiveCategory('success')}
            className={`px-4 py-2 rounded-full font-bold transition cursor-pointer ${
              activeCategory === 'success'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Student Celebrations
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  {item.tag}
                </span>

                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-blue-700 font-semibold">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>Mallappally Facility</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {selectedPhoto.tag}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
