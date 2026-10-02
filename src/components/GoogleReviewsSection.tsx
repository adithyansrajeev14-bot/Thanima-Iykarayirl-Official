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
  ShieldCheck,
  PlusCircle,
  X,
  ChevronDown,
  ChevronUp
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
  const [filterRating, setFilterRating] = useState<'ALL' | '5' | 'RECENT'>('ALL');
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
    <section id="reviews" className="py-20 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Maps Live Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by 10,000+ Students in Mallappally
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Real feedback from candidates who mastered their H-track, 8-track, and road driving with Thanima Iykarayil MDS.
          </p>
        </div>

        {/* Google Maps Score & Sync Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Google Rating Hero */}
            <div className="flex items-center gap-5 text-center md:text-left">
              {/* Google G Logo icon */}
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center p-3 flex-shrink-0">
                <svg className="w-10 h-10" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-4xl font-black text-slate-900">{rating}</span>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {totalCount} Google Reviews
                    </span>
                  </div>
                </div>
                <a
                  href={GOOGLE_MAPS_REVIEWS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold mt-1 flex items-center justify-center md:justify-start gap-1 group"
                  title="Open Thanima Iykkarayil MDS on Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="underline decoration-blue-300">Thanima Iykkarayil Motor Driving School, Mallappally</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Sync Controls & Action */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <a
                href={GOOGLE_MAPS_REVIEWS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-blue-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Open 153 Reviews on Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                onClick={handleSyncWithGoogle}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                title="Refresh reviews from Google Maps"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Reviews'}</span>
                <span className="text-[10px] text-slate-400 font-normal">({lastSyncTime})</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 text-xs">
          <button
            onClick={() => setFilterRating('ALL')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer ${
              filterRating === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating('5')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1 ${
              filterRating === '5'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>5-Star Experiences</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Author row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {rev.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                        <span>{rev.authorName}</span>
                        {rev.verified && (
                          <span title="Verified Google Reviewer">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{rev.relativeTime}</div>
                    </div>
                  </div>

                  {/* Google small icon */}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    Google
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-400 mb-2.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Highlight Tag */}
                {rev.highlight && (
                  <div className="mb-2 text-xs font-semibold text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100">
                    "{rev.highlight}"
                  </div>
                )}

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-600">{rev.batch || 'Verified Student'}</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <ThumbsUp className="w-3 h-3 text-slate-400" />
                  <span>{rev.likes || 1} helpful</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View More / Show All Reviews Button */}
        {filteredReviews.length > INITIAL_LIMIT && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs border border-blue-200 shadow-sm transition hover:shadow-md cursor-pointer"
            >
              <span>
                {showAllReviews
                  ? 'Show Fewer Reviews'
                  : `View More Reviews (Show All ${filteredReviews.length} Verified Student Experiences)`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllReviews ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-700 to-slate-900 text-white">
              <h3 className="font-bold text-sm">Write a Student Review</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Varghese"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Taken</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="LMV Car + MCWG Bike Combo">LMV Car + MCWG Bike Combo</option>
                  <option value="LMV Four Wheeler (Car)">LMV Four Wheeler (Car)</option>
                  <option value="Two Wheeler MCWG">Two Wheeler MCWG (Motorcycle)</option>
                  <option value="Scooter MCWOG">Scooter MCWOG</option>
                  <option value="Road Confidence Refresher">Road Confidence Refresher</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Rating</label>
                <div className="flex gap-2">
                  {[5, 4, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setUserRating(val)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                        userRating === val
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {val} Stars ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Experience / Feedback</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell others about your ground test practice, instructor patience, and driving test experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
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
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Google Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
