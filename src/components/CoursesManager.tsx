import React, { useState } from 'react';
import { CoursePackage } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  Car,
  PlusCircle,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  Layers,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface CoursesManagerProps {
  courses: CoursePackage[];
  onRefreshCourses: () => void;
}

export const CoursesManager: React.FC<CoursesManagerProps> = ({
  courses,
  onRefreshCourses,
}) => {
  const [editingCourse, setEditingCourse] = useState<CoursePackage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'LMV' | 'MCWG' | 'COMBO' | 'REFRESHER' | 'SPECIAL'>('LMV');
  const [vehicleType, setVehicleType] = useState('Four Wheeler (Car - Manual)');
  const [description, setDescription] = useState('');
  const [defaultFee, setDefaultFee] = useState<number>(8500);
  const [defaultRtoFee, setDefaultRtoFee] = useState<number>(1000);
  const [durationDays, setDurationDays] = useState<number>(25);

  const openCreateModal = () => {
    setName('');
    setCategory('LMV');
    setVehicleType('Four Wheeler (Car - Manual)');
    setDescription('Ground steering, H-track parking, and road confidence coaching');
    setDefaultFee(8500);
    setDefaultRtoFee(1000);
    setDurationDays(25);
    setIsCreating(true);
    setEditingCourse(null);
    setError(null);
  };

  const openEditModal = (c: CoursePackage) => {
    setEditingCourse(c);
    setName(c.name);
    setCategory(c.category);
    setVehicleType(c.vehicleType);
    setDescription(c.description);
    setDefaultFee(c.defaultFee);
    setDefaultRtoFee(c.defaultRtoFee);
    setDurationDays(c.durationDays);
    setIsCreating(false);
    setError(null);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingCourse(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a course name');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      category,
      vehicleType: vehicleType.trim(),
      description: description.trim(),
      defaultFee: Number(defaultFee),
      defaultRtoFee: Number(defaultRtoFee),
      durationDays: Number(durationDays),
    };

    try {
      if (editingCourse) {
        // Update existing course
        const res = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to update course');
        setSuccessMessage(`Course "${payload.name}" updated successfully!`);
      } else {
        // Create new course
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to create course');
        setSuccessMessage(`New course "${payload.name}" added successfully!`);
      }

      onRefreshCourses();
      closeModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, courseName: string) => {
    if (!window.confirm(`Are you sure you want to delete the course "${courseName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete course');
      onRefreshCourses();
      setSuccessMessage(`Course "${courseName}" deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed deleting course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Course Packages & Pricing Manager</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage training packages displayed on the official website and available in the receipt generator.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Course</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Courses List Table/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => {
          const totalFee = c.defaultFee + c.defaultRtoFee;
          return (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {c.durationDays} Days
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base">{c.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{c.vehicleType}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {c.description}
                </p>

                {/* Price Breakdown */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-500">Package Total:</span>
                    <span className="text-base font-black text-slate-900">
                      {formatCurrency(totalFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Tuition: {formatCurrency(c.defaultFee)}</span>
                    <span>Govt RTO: {formatCurrency(c.defaultRtoFee)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                  title="Delete Course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(isCreating || editingCourse) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-slate-900 text-white">
              <h3 className="font-bold text-base">
                {editingCourse ? `Edit Course: ${editingCourse.name}` : 'Add New Driving Course Package'}
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-white/10 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LMV Car Driving Intensive"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="LMV">LMV (Four Wheeler / Car)</option>
                    <option value="MCWG">MCWG (Two Wheeler with Gear)</option>
                    <option value="COMBO">COMBO (Car + Bike)</option>
                    <option value="REFRESHER">REFRESHER (License Holders)</option>
                    <option value="SPECIAL">SPECIAL / Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Type / Model</label>
                <input
                  type="text"
                  placeholder="e.g. Four Wheeler (Maruti Swift / WagonR)"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tuition / Training Fee (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={defaultFee}
                    onChange={(e) => setDefaultFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Govt. RTO & Slot Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={defaultRtoFee}
                    onChange={(e) => setDefaultRtoFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Description & Syllabus</label>
                <textarea
                  rows={3}
                  placeholder="Describe ground training, H-track reverse parking, road traffic practice..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
