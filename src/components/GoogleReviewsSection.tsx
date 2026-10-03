import React, { useState, useEffect } from 'react';
import { GoogleReview } from '../types';
import {
  Star,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  ThumbsUp,
  MapPin,
  ExternalLink,
  PlusCircle,
  X,
  ChevronDown
} from 'lucide-react';

interface GoogleReviewsSectionProps {
  onSyncReview?: () => void;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [rating, setRating] = useState(4.9);
  const [totalCount, setTotalCount] = useState(153);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [isSyncing, setIsSyncing] = useState(false);
  const [filterRating, setFilterRating] = useState<'ALL' | '5'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const GOOGLE_MAPS_REVIEWS_URL =
    'https://www.google.com/maps/place/Thanima+Iykkarayil+Motor+Driving+School/@9.4362596,76.6413042,101m/data=!3m1!1e3!4m8!3m7!1s0x3b0625e130d716c1:0xf434ddbb4440fbd8!8m2!3d9.4361345!4d76.6414822!9m1!1b1!16s%2Fg%2F11ns5khhs7?entry=ttu';

  // New review form state
  const [authorName, setAuthorName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [batch, setBatch] = useState('LMV Car + MCWG Bike');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (data.reviews) setReviews(data.reviews);
        if (data.rating) setRating(data.rating);
        if (data.totalCount) setTotalCount(data.totalCount);
        if (data.lastSync) {
          const d = new Date(data.lastSync);
          setLastSyncTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Error fetching Google reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSyncWithGoogle = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/reviews/sync', { method: 'POST' });
      if (res.ok) {
        await fetchReviews();
        setLastSyncTime('Just now');
      }
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName.trim(),
          rating: userRating,
          text: reviewText.trim(),
          batch,
          highlight: 'Newly submitted student feedback'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reviews) setReviews(data.reviews);
        setShowAddModal(false);
        setAuthorName('');
        setReviewText('');
      }
    } catch (err) {
      console.error('Error posting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === '5') return r.rating === 5;
    return true;
  });

  const INITIAL_LIMIT = 6;
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, INITIAL_LIMIT);

  return (
    <section id="reviews" className="py-16 bg-gradient-to-b from-white via-sky-50/50 to-white border-b border-sky-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-sky-200/80 pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">
                Student Testimonials
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Verified Google Maps Feedback
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Authentic feedback from candidates who trained for their H-track, 8-track, and road tests at Thanima Iykarayil MDS in Mallappally.
            </p>
          </div>
        </div>

        {/* Google Maps Score & Sync Card in Light Blue Glass */}
        <div className="bg-white/80 backdrop-blur-md border border-sky-200 rounded-2xl p-6 mb-10 shadow-sm shadow-sky-900/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-white border border-sky-200 flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{rating}</span>
                  <div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {totalCount} Verified Google Reviews
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Thanima Iykkarayil Motor Driving School, Mallappally</span>
                </div>
              </div>
            </div>

            {/* Action Buttons in Glass Style */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={GOOGLE_MAPS_REVIEWS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-sky-900 hover:text-sky-950 bg-sky-50/80 hover:bg-sky-100 border border-sky-200 transition shadow-2xs"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
              </a>

              <button
                onClick={handleSyncWithGoogle}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-sky-200 transition cursor-pointer"
                title="Refresh reviews from Google Maps"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit Student Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls in Glass Tabs */}
        <div className="flex items-center gap-2 mb-8 text-xs">
          <button
            onClick={() => setFilterRating('ALL')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              filterRating === 'ALL'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating('5')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              filterRating === '5'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>5-Star Ratings</span>
          </button>
        </div>

        {/* Reviews Cards Grid in Light Blue Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white/80 backdrop-blur-md border border-sky-200 rounded-xl p-5 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs border border-sky-200">
                      {rev.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <span>{rev.authorName}</span>
                        {rev.verified && (
                          <span title="Verified Google Review">
                            <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{rev.relativeTime}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                    Google
                  </span>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">{rev.batch || 'Driving Student'}</span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 text-slate-400" />
                  <span>{rev.likes || 1} helpful</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Reviews Toggle */}
        {filteredReviews.length > INITIAL_LIMIT && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/80 backdrop-blur-md hover:bg-sky-50 text-sky-900 font-bold text-xs border border-sky-200 transition cursor-pointer shadow-xs"
            >
              <span>
                {showAllReviews
                  ? 'Show Fewer Reviews'
                  : `Show All ${filteredReviews.length} Student Reviews`}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllReviews ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Review Submission Modal in Frosted Glass */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md border border-sky-300 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-sky-900 text-white">
              <h3 className="font-bold text-sm">Submit Student Review</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Varghese"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Course Completed</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none"
                >
                  <option value="Combo Pack (LMV Car + MCWG Bike)">Combo Pack (LMV Car + MCWG Bike)</option>
                  <option value="LMV Four Wheeler (Car)">LMV Four Wheeler (Car)</option>
                  <option value="Two Wheeler MCWG">Two Wheeler MCWG (Motorcycle)</option>
                  <option value="Scooter MCWOG">Scooter MCWOG</option>
                  <option value="Road Confidence Refresher">Road Confidence Refresher</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[5, 4, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setUserRating(val)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                        userRating === val
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-sky-200'
                      }`}
                    >
                      {val} Stars ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Your Review / Experience *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your training experience on the ground track, slope, and RTO test day..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
