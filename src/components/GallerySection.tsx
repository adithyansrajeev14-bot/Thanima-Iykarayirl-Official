import React, { useState, useEffect } from 'react';
import { Camera, ZoomIn, X, MapPin } from 'lucide-react';
import { GalleryItem } from '../types';

const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Dual-Control Training Fleet',
    category: 'fleet',
    image: '/src/assets/images/hero_driving_car_1790908090052.jpg',
    description: 'Well-maintained training hatchbacks fitted with secondary dual brake and clutch pedals under instructor supervision.',
    tag: 'Safety Fleet'
  },
  {
    id: 'g2',
    title: 'Kerala MVD-Spec H-Track & 8-Track Ground',
    category: 'ground',
    image: '/src/assets/images/ground_track_h_1790908104536.jpg',
    description: 'Private training ground in Kaduvakuzhy, Chengaroor with exact Kerala Motor Vehicles Department dimensions for reverse H-parking and figure 8 tests.',
    tag: 'Test Ground Track'
  },
  {
    id: 'g3',
    title: 'Two-Wheeler Balance & Clutch Training',
    category: 'twowheeler',
    image: '/src/assets/images/bike_training_1790908119701.jpg',
    description: 'Personalized 1-on-1 coaching for motorcycle with gear (MCWG) and scooter (MCWOG), emphasizing clutch balance and cone maneuvering.',
    tag: 'Two-Wheeler'
  },
  {
    id: 'g4',
    title: 'Sub RTO Mallappally Driving Test Clearance',
    category: 'success',
    image: '/src/assets/images/license_success_1790908136486.jpg',
    description: 'Candidates with their official driving licenses after clearing both ground and road tests at Sub-RTO Mallappally (KL-28).',
    tag: 'Test Clearance'
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
    <section id="gallery" className="py-16 bg-gradient-to-b from-sky-50/40 via-blue-50/20 to-sky-50/40 border-b border-sky-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-sky-200/80 pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">
                Facility & Practice
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Training Ground & Vehicles
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Photographs of our private training facility at Kaduvakuzhy, Chengaroor P.O., dual-brake hatchbacks, and test preparation sessions.
            </p>
          </div>
        </div>

        {/* Filter Controls in Glass Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 ${
              activeCategory === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            All Photos ({gallery.length})
          </button>
          <button
            onClick={() => setActiveCategory('ground')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 ${
              activeCategory === 'ground'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            H-Track & 8-Track Ground
          </button>
          <button
            onClick={() => setActiveCategory('fleet')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 ${
              activeCategory === 'fleet'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            Dual-Control Cars
          </button>
          <button
            onClick={() => setActiveCategory('twowheeler')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 ${
              activeCategory === 'twowheeler'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            Two-Wheeler Classes
          </button>
          <button
            onClick={() => setActiveCategory('success')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 ${
              activeCategory === 'success'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            Test Clearances
          </button>
        </div>

        {/* Gallery Grid in Light Blue Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="bg-white/80 backdrop-blur-md border border-sky-200 rounded-xl overflow-hidden shadow-xs hover:border-sky-300 hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-sky-100 border-b border-sky-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-sky-950/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                  {item.tag}
                </span>
                <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-sky-950/70 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-sky-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-sky-100 flex items-center gap-1 text-[11px] text-sky-800">
                  <MapPin className="w-3 h-3 text-red-600" />
                  <span>Kaduvakuzhy, Chengaroor</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal in Frosted Glass */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl border border-sky-300"
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
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                {selectedPhoto.tag}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
