import React, { useState, useEffect, useCallback } from 'react';
import { Receipt, SchoolSettings, CoursePackage } from './types';
import { OfficialNavbar } from './components/OfficialNavbar';
import { HeroSection } from './components/HeroSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CoursesSection } from './components/CoursesSection';
import { GoogleReviewsSection } from './components/GoogleReviewsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { AdminMode } from './components/AdminMode';
import { AdminLoginGate } from './components/AdminLoginGate';
import { CustomerBillPage } from './components/CustomerBillPage';
import { BillLookupModal } from './components/BillLookupModal';
import { ReceiptModal } from './components/ReceiptModal';
import { InstallmentModal } from './components/InstallmentModal';
import { DeleteReceiptModal } from './components/DeleteReceiptModal';
import { LearnerBadge } from './components/LearnerBadge';
import { Phone, MapPin, Search, MessageSquare, AlertCircle } from 'lucide-react';

const FALLBACK_SETTINGS: SchoolSettings = {
  name: 'THANIMA IYKARAYIL MOTOR DRIVING SCHOOL',
  tagline: 'LEARN TO DRIVE WITH CONFIDENCE',
  address: 'Kaduvakuzhy, Chengaroor P.O., Mallappally',
  city: 'Mallappally, Pathanamthitta Dist., Kerala',
  pincode: '689594',
  primaryPhone: '9562879877',
  secondaryPhone: '9947125692',
  whatsappPhone: '9562879877',
  email: 'thanimaiykarayilmds@gmail.com',
  upiId: '9562879877@okaxis',
  upiName: 'Thanima Iykarayil MDS',
  rtoOffice: 'Sub RTO Mallappally (KL-28)',
  terms: [
    'Learner’s license is valid for 6 months from the date of issue.',
    'Students must carry their original Learner’s License and fee receipt during training sessions.',
    'Fee paid is non-refundable and non-transferable under any circumstances.',
    'Driving test date will be allotted subject to RTO slot availability and full fee clearance.'
  ],
  googleMapsUrl: 'https://www.google.com/maps/place/Thanima+Iykkarayil+Motor+Driving+School/@9.4362596,76.6413042,101m/data=!3m1!1e3!4m8!3m7!1s0x3b0625e130d716c1:0xf434ddbb4440fbd8!8m2!3d9.4361345!4d76.6414822!9m1!1b1!16s%2Fg%2F11ns5khhs7?entry=ttu'
};

const FALLBACK_COURSES: CoursePackage[] = [
  {
    id: 'course-combo',
    name: 'Combo Pack (LMV Car + MCWG Bike)',
    category: 'COMBO',
    vehicleType: 'Car + Motorcycle with Gear',
    description: 'Comprehensive 4-wheeler and 2-wheeler training with complete RTO test assistance',
    defaultFee: 11500,
    defaultRtoFee: 1500,
    durationDays: 30
  },
  {
    id: 'course-lmv',
    name: 'LMV Only (Light Motor Vehicle - Car)',
    category: 'LMV',
    vehicleType: 'Four Wheeler (Car - Manual Transmission)',
    description: 'Ground steering, road driving, parking (H & 8 test preparation) & RTO road test',
    defaultFee: 8500,
    defaultRtoFee: 1000,
    durationDays: 25
  },
  {
    id: 'course-mcwg',
    name: 'MCWG Only (Two Wheeler with Gear)',
    category: 'MCWG',
    vehicleType: 'Motorcycle with Gear (Bike)',
    description: 'Balance, clutch control, traffic maneuvers & figure 8 ground test practice',
    defaultFee: 4500,
    defaultRtoFee: 800,
    durationDays: 15
  },
  {
    id: 'course-mcwog',
    name: 'MCWOG (Scooter / Non-Gear)',
    category: 'MCWG',
    vehicleType: 'Scooter (Gearless)',
    description: 'Basic handling, traffic road safety, ground test practice for gearless 2-wheelers',
    defaultFee: 4000,
    defaultRtoFee: 800,
    durationDays: 12
  },
  {
    id: 'course-refresher',
    name: 'License Holder Refresher Course',
    category: 'REFRESHER',
    vehicleType: 'LMV Car (On-Road Confidence)',
    description: 'High traffic confidence, slope stop & go, night driving, and parallel parking for existing license holders',
    defaultFee: 5000,
    defaultRtoFee: 0,
    durationDays: 10
  }
];

function extractBillIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  const hash = window.location.hash;
  const search = window.location.search;

  // Match /bill/... or /receipt/... (e.g. /bill/TIMDS-2026-0001 or /bill/TIMDS-2026-0001.pdf)
  const pathMatch = path.match(/^\/(?:bill|receipt)\/([^/?#]+)/i);
  if (pathMatch && pathMatch[1]) {
    return decodeURIComponent(pathMatch[1]).replace(/\.pdf$/i, '').trim();
  }

  // Match /bill-...
  const dashMatch = path.match(/^\/(?:bill|receipt)-([^/?#]+)/i);
  if (dashMatch && dashMatch[1]) {
    return decodeURIComponent(dashMatch[1]).replace(/\.pdf$/i, '').trim();
  }

  // Match hash #/bill/... or #bill/...
  const hashMatch = hash.match(/#(?:(?:\/)?(?:bill|receipt)\/)([^/?#]+)/i);
  if (hashMatch && hashMatch[1]) {
    return decodeURIComponent(hashMatch[1]).replace(/\.pdf$/i, '').trim();
  }

  // Match query parameter ?receipt=... or ?bill=...
  const params = new URLSearchParams(search);
  const qBill = params.get('bill') || params.get('receipt') || params.get('id');
  if (qBill) {
    return qBill.replace(/\.pdf$/i, '').trim();
  }

  return null;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'website' | 'admin'>('website');
  const [customerBill, setCustomerBill] = useState<Receipt | null>(null);
  const [billLoading, setBillLoading] = useState(false);
  const [billNotFound, setBillNotFound] = useState(false);

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [courses, setCourses] = useState<CoursePackage[]>(FALLBACK_COURSES);
  const [settings, setSettings] = useState<SchoolSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('timds_admin_token');
    }
    return null;
  });

  // Modals
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [activeReceiptModal, setActiveReceiptModal] = useState<Receipt | null>(null);
  const [activeInstallmentModal, setActiveInstallmentModal] = useState<Receipt | null>(null);
  const [receiptToDeleteFromApp, setReceiptToDeleteFromApp] = useState<Receipt | null>(null);

  // Check URL route for secret /adminmode or direct /bill/:id extension
  const checkUrlRoute = useCallback(async () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;

    // Secret Admin Mode
    if (
      path.toLowerCase().includes('adminmode') ||
      path.toLowerCase().includes('/admin') ||
      hash.toLowerCase().includes('adminmode') ||
      search.toLowerCase().includes('admin')
    ) {
      setCurrentView('admin');
      setCustomerBill(null);
      return;
    }

    // Direct /bill/... URL extension
    const billId = extractBillIdFromUrl();
    if (billId) {
      setBillLoading(true);
      setBillNotFound(false);
      try {
        const res = await fetch(`/api/receipts/${encodeURIComponent(billId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.receipt) {
            setCustomerBill(data.receipt);
            setBillLoading(false);
            return;
          }
        }
        setBillNotFound(true);
      } catch (err) {
        console.warn('Error fetching digital bill:', err);
        setBillNotFound(true);
      } finally {
        setBillLoading(false);
      }
      return;
    }

    // Default to Official Driving School Website
    setCurrentView('website');
    setCustomerBill(null);
  }, []);

  useEffect(() => {
    checkUrlRoute();

    const handlePopState = () => {
      checkUrlRoute();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [checkUrlRoute]);

  const handleNavigateView = (view: 'website' | 'admin' | 'generate') => {
    if (view === 'generate') {
      setCurrentView('admin'); // Inside admin mode, generator is available
    } else {
      setCurrentView(view);
    }
    setCustomerBill(null);
    const targetPath = (view === 'admin' || view === 'generate') ? '/adminmode' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  const handleExitCustomerBill = () => {
    setCustomerBill(null);
    setBillNotFound(false);
    window.history.pushState(null, '', '/');
  };

  // Fetch initial data with resilient local storage caching
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resReceipts, resCourses, resSettings] = await Promise.all([
        fetch('/api/receipts').catch(() => null),
        fetch('/api/courses').catch(() => null),
        fetch('/api/settings').catch(() => null),
      ]);

      if (resReceipts && resReceipts.ok) {
        const d = await resReceipts.json();
        if (d.receipts) {
          setReceipts(d.receipts);
          try { localStorage.setItem('timds_receipts', JSON.stringify(d.receipts)); } catch (e) {}
        }
      } else {
        const cached = localStorage.getItem('timds_receipts');
        if (cached) {
          try { setReceipts(JSON.parse(cached)); } catch (e) {}
        }
      }

      if (resCourses && resCourses.ok) {
        const d = await resCourses.json();
        if (d.courses) {
          setCourses(d.courses);
          try { localStorage.setItem('timds_courses', JSON.stringify(d.courses)); } catch (e) {}
        }
      } else {
        const cached = localStorage.getItem('timds_courses');
        if (cached) {
          try { setCourses(JSON.parse(cached)); } catch (e) {}
        }
      }

      if (resSettings && resSettings.ok) {
        const d = await resSettings.json();
        if (d.settings) {
          setSettings(d.settings);
          try { localStorage.setItem('timds_settings', JSON.stringify(d.settings)); } catch (e) {}
        }
      } else {
        const cached = localStorage.getItem('timds_settings');
        if (cached) {
          try { setSettings(JSON.parse(cached)); } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Backend API connection warning, using cached state:', err);
      const cached = localStorage.getItem('timds_receipts');
      if (cached) {
        try { setReceipts(JSON.parse(cached)); } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReceiptCreated = (newReceipt: Receipt) => {
    setReceipts(prev => {
      const updated = [newReceipt, ...prev];
      try { localStorage.setItem('timds_receipts', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    setActiveReceiptModal(newReceipt);
  };

  const handlePaymentAdded = (updatedReceipt: Receipt) => {
    setReceipts(prev => {
      const updated = prev.map(r => (r.id === updatedReceipt.id ? updatedReceipt : r));
      try { localStorage.setItem('timds_receipts', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    if (activeReceiptModal && activeReceiptModal.id === updatedReceipt.id) {
      setActiveReceiptModal(updatedReceipt);
    }
    if (customerBill && customerBill.id === updatedReceipt.id) {
      setCustomerBill(updatedReceipt);
    }
  };

  const pendingCount = receipts.filter(r => r.paymentStatus !== 'PAID').length;

  // 1. Direct Customer Bill Page (e.g. from WhatsApp /bill/TIMDS-2026-0001)
  if (customerBill) {
    return (
      <CustomerBillPage
        receipt={customerBill}
        settings={settings}
        onBackToHome={handleExitCustomerBill}
      />
    );
  }

  // 2. Loading state when fetching bill
  if (billLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-sm">Opening Official Digital Bill...</p>
        <p className="text-xs text-slate-500 mt-1">{settings.name}</p>
      </div>
    );
  }

  // 3. Not found state
  if (billNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md text-center max-w-md w-full space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Receipt Not Found</h2>
          <p className="text-xs text-slate-600">
            The requested bill link could not be located. Please verify the receipt number or contact the driving school.
          </p>
          <div className="pt-2">
            <button
              onClick={handleExitCustomerBill}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              Go to Official Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-blue-50/30 to-sky-50/60 text-slate-800 flex flex-col antialiased">
      {/* Top Official Navbar */}
      <OfficialNavbar
        settings={settings}
        currentView={currentView}
        onNavigateView={handleNavigateView}
        onOpenLookup={() => setShowLookupModal(true)}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentView === 'website' ? (
          /* Official Motor Driving School Website Experience */
          <div>
            {/* Top Anchor */}
            <div id="top" />

            {/* 1. Hero Section */}
            <HeroSection
              settings={settings}
              onOpenLookup={() => setShowLookupModal(true)}
              onExploreCourses={() => {
                const el = document.getElementById('courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. Key Highlights / Why Choose Us */}
            <WhyChooseUs />

            {/* 3. Courses & Pricing Packages */}
            <CoursesSection
              courses={courses}
              settings={settings}
            />

            {/* 4. Google Maps Live Reviews (Auto-updated) */}
            <GoogleReviewsSection />

            {/* 5. Training Facilities & Moments Gallery */}
            <GallerySection />

            {/* 6. Contact & Location Section */}
            <ContactSection settings={settings} />
          </div>
        ) : !adminToken ? (
          /* Password Protected Admin Login Gate */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminLoginGate
              onSuccess={(token) => setAdminToken(token)}
              onCancel={() => handleNavigateView('website')}
            />
          </div>
        ) : (
          /* Authenticated Administrative Mode Panel */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminMode
              receipts={receipts}
              courses={courses}
              settings={settings}
              onRefreshReceipts={fetchData}
              onRefreshCourses={fetchData}
              onOpenReceipt={(receipt) => setActiveReceiptModal(receipt)}
              onOpenInstallment={(receipt) => setActiveInstallmentModal(receipt)}
              onUpdateSettings={(newSettings) => setSettings(newSettings)}
              onExitAdmin={() => handleNavigateView('website')}
              onLogout={() => {
                sessionStorage.removeItem('timds_admin_token');
                setAdminToken(null);
                handleNavigateView('website');
              }}
              onReceiptCreated={handleReceiptCreated}
            />
          </div>
        )}
      </main>

      {/* Public Institutional Footer with Deep Sky Glass Styling */}
      <footer className="mt-auto border-t border-sky-800/80 bg-gradient-to-br from-sky-950 via-slate-900 to-sky-950 text-sky-200 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-sky-900/60">
            {/* Col 1: Institute Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <LearnerBadge size="sm" />
                <span className="font-extrabold text-white text-sm tracking-wide">
                  THANIMA IYKARAYIL MDS
                </span>
              </div>
              <p className="text-sky-300/80 text-xs leading-relaxed">
                Govt. Recognized Motor Driving School affiliated for Kerala Motor Vehicles Department driving tests at Sub RTO Mallappally (KL-28).
              </p>
              <div className="text-[11px] text-amber-300 font-medium">
                Chief Instructor: Arun Iykarayil
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Prospectus & Links
              </div>
              <ul className="space-y-2 text-sky-300/80">
                <li>
                  <a href="#about" className="hover:text-white transition">About School & Instructors</a>
                </li>
                <li>
                  <a href="#courses" className="hover:text-white transition">Courses & Fee Tariffs</a>
                </li>
                <li>
                  <a href="#rto-guidelines" className="hover:text-white transition">Sub-RTO Test Procedures</a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-white transition">Private Training Ground (H & 8)</a>
                </li>
                <li>
                  <a href="#reviews" className="hover:text-white transition">Google Maps Reviews (4.9★)</a>
                </li>
              </ul>
            </div>

            {/* Col 3: Jurisdiction & Location */}
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Ground & Jurisdiction
              </div>
              <div className="space-y-2 text-sky-300/80">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{settings.address}, {settings.city} - {settings.pincode}</span>
                </div>
                <div className="pt-1 text-[11px] text-sky-400/80">
                  Jurisdiction: Mallappally, Chengaroor, Vennikulam, Anjilithanam, Kaviyoor, and nearby areas.
                </div>
              </div>
            </div>

            {/* Col 4: Student Services */}
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Student Desk
              </div>
              <ul className="space-y-2.5 text-sky-300/80">
                <li>
                  <button
                    onClick={() => setShowLookupModal(true)}
                    className="text-amber-300 hover:text-amber-200 font-semibold cursor-pointer underline text-left"
                  >
                    Download Official Fee Receipt / Bill
                  </button>
                </li>
                <li className="flex items-center gap-1.5 text-sky-200">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-mono">{settings.primaryPhone} / {settings.secondaryPhone}</span>
                </li>
                <li>
                  <a
                    href={`https://wa.me/91${settings.whatsappPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Admissions Desk</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-sky-400/70 gap-4">
            <div>
              © {new Date().getFullYear()} {settings.name}. All Rights Reserved. Govt. Approved Motor Driving School.
            </div>
            <div className="text-sky-400/70 text-center md:text-right">
              Learner's License is valid for 6 months. Driving test allotted subject to Sub-RTO Mallappally slot availability.
            </div>
          </div>
        </div>
      </footer>

      {/* Bill Lookup Modal (For students on website) */}
      <BillLookupModal
        isOpen={showLookupModal}
        onClose={() => setShowLookupModal(false)}
        onSelectReceipt={(receipt) => {
          // Open direct customer bill page for the selected receipt
          setCustomerBill(receipt);
          window.history.pushState(null, '', `/bill/${receipt.receiptNumber}`);
        }}
      />

      {/* Modals for Admin / Staff operations */}
      {activeReceiptModal && (
        <ReceiptModal
          receipt={activeReceiptModal}
          settings={settings}
          isOpen={Boolean(activeReceiptModal)}
          onClose={() => setActiveReceiptModal(null)}
          onOpenInstallmentModal={(r) => {
            setActiveReceiptModal(null);
            setActiveInstallmentModal(r);
          }}
          onDeleteReceipt={(r) => {
            setActiveReceiptModal(null);
            setReceiptToDeleteFromApp(r);
          }}
        />
      )}

      {/* Delete Receipt Confirmation Modal */}
      {receiptToDeleteFromApp && (
        <DeleteReceiptModal
          receipt={receiptToDeleteFromApp}
          isOpen={Boolean(receiptToDeleteFromApp)}
          allowDeletion={Boolean(settings.allowReceiptDeletion)}
          onClose={() => setReceiptToDeleteFromApp(null)}
          onSuccess={(deletedId) => {
            setReceipts(prev => {
              const updated = prev.filter(r => r.id !== deletedId);
              try { localStorage.setItem('timds_receipts', JSON.stringify(updated)); } catch (e) {}
              return updated;
            });
            setReceiptToDeleteFromApp(null);
            fetchData();
          }}
          onOpenSettings={() => {
            handleNavigateView('admin');
          }}
        />
      )}

      {activeInstallmentModal && (
        <InstallmentModal
          receipt={activeInstallmentModal}
          isOpen={Boolean(activeInstallmentModal)}
          onClose={() => setActiveInstallmentModal(null)}
          onPaymentAdded={handlePaymentAdded}
        />
      )}
    </div>
  );
}
