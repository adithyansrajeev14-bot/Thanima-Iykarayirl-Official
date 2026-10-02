import React, { useState, useEffect } from 'react';
import { SchoolSettings, GalleryItem } from '../types';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  RefreshCw,
  PlusCircle,
  X,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface MediaManagerProps {
  settings: SchoolSettings;
  onUpdateSettings: (settings: SchoolSettings) => void;
  onRefreshGallery?: () => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  settings,
  onUpdateSettings,
  onRefreshGallery,
}) => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);

  // New gallery photo state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'fleet' | 'ground' | 'twowheeler' | 'success'>('ground');
  const [newTag, setNewTag] = useState('Ground Track');
  const [newDescription, setNewDescription] = useState('');
  const [newImageData, setNewImageData] = useState<string>('');

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        if (data.gallery) setGallery(data.gallery);
      }
    } catch (err) {
      console.warn('Error fetching gallery:', err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Helper to handle local file upload to Data URL
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 15MB)
    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onComplete(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Change a Core Website Image
  const handleUpdateCoreImage = async (
    key: 'heroImage' | 'groundTrackImage' | 'twoWheelerImage' | 'successImage',
    dataUrl: string,
    label: string
  ) => {
    setLoading(true);
    const updatedCustomImages = {
      ...(settings.customImages || {}),
      [key]: dataUrl,
    };

    const updatedSettings = {
      ...settings,
      customImages: updatedCustomImages,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings(data.settings);
        setUploadSuccess(`${label} updated successfully from your local device!`);
        setTimeout(() => setUploadSuccess(null), 3500);
      }
    } catch (err) {
      alert('Failed saving updated image to server');
    } finally {
      setLoading(false);
    }
  };

  // Reset core image back to default asset
  const handleResetCoreImage = async (
    key: 'heroImage' | 'groundTrackImage' | 'twoWheelerImage' | 'successImage',
    label: string
  ) => {
    if (!window.confirm(`Reset ${label} back to original default photo?`)) return;

    const updatedCustomImages = { ...(settings.customImages || {}) };
    delete updatedCustomImages[key];

    const updatedSettings = {
      ...settings,
      customImages: updatedCustomImages,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings(data.settings);
        setUploadSuccess(`${label} reset to default photo.`);
        setTimeout(() => setUploadSuccess(null), 3000);
      }
    } catch (err) {
      alert('Failed resetting image');
    }
  };

  // Add new photo to gallery
  const handleAddGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageData) {
      alert('Please choose an image file from your device');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim() || 'Driving School Training Moment',
          category: newCategory,
          tag: newTag.trim() || 'Facility',
          description: newDescription.trim() || 'Thanima Iykarayil MDS Mallappally',
          image: newImageData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGallery(data.gallery);
        setShowAddGalleryModal(false);
        setNewTitle('');
        setNewDescription('');
        setNewImageData('');
        setUploadSuccess('New photo uploaded to gallery successfully!');
        if (onRefreshGallery) onRefreshGallery();
        setTimeout(() => setUploadSuccess(null), 3500);
      }
    } catch (err) {
      alert('Error uploading photo to gallery');
    } finally {
      setLoading(false);
    }
  };

  // Delete photo from gallery
  const handleDeleteGalleryPhoto = async (id: string, title: string) => {
    if (!window.confirm(`Delete photo "${title}" from gallery?`)) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setGallery(data.gallery);
        if (onRefreshGallery) onRefreshGallery();
      }
    } catch (err) {
      alert('Error deleting photo');
    }
  };

  const coreImages = [
    {
      key: 'heroImage' as const,
      label: '1. Hero Section Car Banner',
      defaultImg: '/src/assets/images/hero_driving_car_1790908090052.jpg',
      currentImg: settings.customImages?.heroImage || '/src/assets/images/hero_driving_car_1790908090052.jpg',
      isCustom: Boolean(settings.customImages?.heroImage),
      desc: 'Top hero background image seen when visitors first open the website.'
    },
    {
      key: 'groundTrackImage' as const,
      label: '2. H-Track & 8-Track Ground Photo',
      defaultImg: '/src/assets/images/ground_track_h_1790908104536.jpg',
      currentImg: settings.customImages?.groundTrackImage || '/src/assets/images/ground_track_h_1790908104536.jpg',
      isCustom: Boolean(settings.customImages?.groundTrackImage),
      desc: 'Shown in the hero preview card & training facilities ground track highlight.'
    },
    {
      key: 'twoWheelerImage' as const,
      label: '3. Motorcycle / Two-Wheeler Training Photo',
      defaultImg: '/src/assets/images/bike_training_1790908119701.jpg',
      currentImg: settings.customImages?.twoWheelerImage || '/src/assets/images/bike_training_1790908119701.jpg',
      isCustom: Boolean(settings.customImages?.twoWheelerImage),
      desc: 'Used in the two-wheeler training showcase.'
    },
    {
      key: 'successImage' as const,
      label: '4. Student License Success Celebration Photo',
      defaultImg: '/src/assets/images/license_success_1790908136486.jpg',
      currentImg: settings.customImages?.successImage || '/src/assets/images/license_success_1790908136486.jpg',
      isCustom: Boolean(settings.customImages?.successImage),
      desc: 'Pass-out celebration photo featured in success gallery.'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <span>Website Media & Image Uploader</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload images from your phone or computer to replace website hero banners or add new photos to the gallery.
          </p>
        </div>

        <button
          onClick={() => setShowAddGalleryModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Upload to Gallery</span>
        </button>
      </div>

      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Part 1: Core Website Key Images */}
      <div>
        <div className="mb-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Main Website Key Images (Click to Change from Device)</span>
          </h4>
          <p className="text-xs text-slate-500">
            Replace any of the prominent website photos with your own real vehicle or ground photos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreImages.map((img) => (
            <div
              key={img.key}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Preview */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={img.currentImg}
                  alt={img.label}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {img.isCustom ? '★ Custom Upload Active' : 'Default Photo'}
                </span>
              </div>

              {/* Info & Upload controls */}
              <div className="p-4 space-y-3">
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">{img.label}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{img.desc}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e, (dataUrl) =>
                          handleUpdateCoreImage(img.key, dataUrl, img.label)
                        )
                      }
                    />
                  </label>

                  {img.isCustom && (
                    <button
                      onClick={() => handleResetCoreImage(img.key, img.label)}
                      className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                      title="Reset to default photo"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Gallery Photos Manager */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Training Gallery Photos ({gallery.length})</span>
            </h4>
            <p className="text-xs text-slate-500">
              Photos currently visible in the public Training Facilities & Moments gallery.
            </p>
          </div>

          <button
            onClick={() => setShowAddGalleryModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 bg-blue-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {photo.tag}
                </span>

                <button
                  onClick={() => handleDeleteGalleryPhoto(photo.id, photo.title)}
                  className="absolute bottom-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                  title="Delete from Gallery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3">
                <div className="font-bold text-slate-900 text-xs truncate" title={photo.title}>
                  {photo.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{photo.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Upload New Photo to Gallery */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-slate-900 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Photo from Local Device</span>
              </h3>
              <button onClick={() => setShowAddGalleryModal(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGalleryPhoto} className="p-6 space-y-4 text-xs">
              {/* Device Image Picker */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Choose Image from Local Device *
                </label>

                {newImageData ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-blue-500 bg-slate-100">
                    <img src={newImageData} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImageData('')}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-lg text-xs"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition">
                    <Upload className="w-6 h-6 text-blue-600" />
                    <span className="font-bold text-slate-700 text-xs">Click to browse file from device</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, JPEG, WebP up to 15MB</span>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, (dataUrl) => setNewImageData(dataUrl))}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Practice Session with Cones"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="ground">H-Track & 8-Track Ground</option>
                    <option value="fleet">Dual-Control Cars</option>
                    <option value="twowheeler">Two-Wheeler Training</option>
                    <option value="success">Student License Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Track Practice"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Morning 6:30 AM batch practicing reverse parking"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newImageData}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Save to Website Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
