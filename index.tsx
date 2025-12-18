import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Trash2, Plus, Instagram, Music, Mail, ExternalLink, X, Image as ImageIcon, ArrowDown, Edit2, Check } from 'lucide-react';

// --- Types ---
interface Photo {
  id: number;
  url: string;
  caption: string;
  date: string;
}

interface SocialProfile {
  id: string;
  platform: string;
  handle: string;
  link: string;
  color: string;
  iconType: 'Instagram' | 'Douyin' | 'Email';
}

// --- Constants ---
const HERO_WORDS = [
  { text: "REALITY", gradient: "from-pink-500 via-red-500 to-yellow-500" },
  { text: "EMOTION", gradient: "from-blue-400 via-indigo-500 to-purple-600" },
  { text: "CHAOS", gradient: "from-orange-400 via-amber-500 to-red-600" },
  { text: "LIGHT", gradient: "from-lime-400 via-emerald-500 to-teal-500" },
  { text: "MOMENTS", gradient: "from-fuchsia-500 via-purple-600 to-pink-500" },
  { text: "DREAMS", gradient: "from-cyan-400 via-blue-500 to-indigo-600" }
];

const INITIAL_PHOTOS: Photo[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    caption: "Mountain Haze",
    date: "2023-10-12"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    caption: "Urban Geometry",
    date: "2023-11-05"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    caption: "Neon Nights",
    date: "2024-01-15"
  }
];

const INITIAL_SOCIALS: SocialProfile[] = [
  {
    id: 'instagram',
    platform: 'Instagram',
    handle: '@lololo.shots',
    link: 'https://instagram.com',
    color: 'hover:bg-pink-600',
    iconType: 'Instagram'
  },
  {
    id: 'douyin',
    platform: 'Douyin',
    handle: '@lololo_vibe',
    link: 'https://www.douyin.com',
    color: 'hover:bg-stone-950', // Douyin/TikTok black vibe
    iconType: 'Douyin'
  },
  {
    id: 'email',
    platform: 'Email',
    handle: 'hello@lololo.co',
    link: 'mailto:hello@lololo.co',
    color: 'hover:bg-emerald-600',
    iconType: 'Email'
  }
];

// --- Components ---
const SocialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Instagram': return <Instagram size={32} />;
    case 'Douyin': return <Music size={32} />; // Music note for Douyin
    case 'Email': return <Mail size={32} />;
    default: return <ExternalLink size={32} />;
  }
};

const SocialCard = ({ 
  profile, 
  isEditing, 
  onUpdate 
}: { 
  profile: SocialProfile; 
  isEditing: boolean; 
  onUpdate: (id: string, field: keyof SocialProfile, value: string) => void 
}) => {
  
  if (isEditing) {
    return (
      <div className={`block bg-stone-800 border-2 border-lime-400 p-6 shadow-[8px_8px_0px_0px_rgba(132,204,22,1)]`}>
         <div className="flex items-center gap-3 mb-6 text-lime-400">
            <SocialIcon type={profile.iconType} />
            <span className="font-bold uppercase tracking-widest">{profile.platform}</span>
         </div>
         <div className="space-y-3">
            <div>
              <label className="text-xs font-mono text-stone-500 uppercase">Display Handle</label>
              <input 
                type="text" 
                value={profile.handle}
                onChange={(e) => onUpdate(profile.id, 'handle', e.target.value)}
                className="w-full bg-stone-900 border border-stone-600 text-white p-2 text-sm font-mono focus:border-lime-400 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-stone-500 uppercase">Link URL</label>
              <input 
                type="text" 
                value={profile.link}
                onChange={(e) => onUpdate(profile.id, 'link', e.target.value)}
                className="w-full bg-stone-900 border border-stone-600 text-white p-2 text-sm font-mono focus:border-lime-400 outline-none"
              />
            </div>
         </div>
      </div>
    );
  }

  return (
    <a 
      href={profile.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-stone-800 border border-stone-700 p-8 hover:scale-[1.02] transition-all duration-300 ${profile.color}`}
    >
      <div className="flex justify-between items-start mb-12">
        <div className="text-stone-400 group-hover:text-white transition-colors">
          <SocialIcon type={profile.iconType} />
        </div>
        <ExternalLink size={20} className="text-stone-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-stone-200 group-hover:text-white mb-2">{profile.platform}</h3>
        <p className="font-mono text-sm text-stone-500 group-hover:text-white/80">{profile.handle}</p>
      </div>
    </a>
  );
};

const App = () => {
  // State for photos
  const [photos, setPhotos] = useState<Photo[]>(() => {
    try {
      const saved = localStorage.getItem('lololo_photos');
      return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
    } catch (e) {
      return INITIAL_PHOTOS;
    }
  });

  // State for Socials
  const [socials, setSocials] = useState<SocialProfile[]>(() => {
    try {
      const saved = localStorage.getItem('lololo_socials');
      return saved ? JSON.parse(saved) : INITIAL_SOCIALS;
    } catch (e) {
      return INITIAL_SOCIALS;
    }
  });

  const [isEditingSocials, setIsEditingSocials] = useState(false);
  
  // State for UI
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  // State for Dynamic Hero Text
  const [wordIndex, setWordIndex] = useState(0);

  // Cycle through hero words
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2500); 
    return () => clearInterval(interval);
  }, []);

  // Persist Photos
  useEffect(() => {
    localStorage.setItem('lololo_photos', JSON.stringify(photos));
  }, [photos]);

  // Persist Socials
  useEffect(() => {
    localStorage.setItem('lololo_socials', JSON.stringify(socials));
  }, [socials]);

  // Handlers
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const newPhoto: Photo = {
      id: Date.now(),
      url: newUrl,
      caption: newCaption || 'Untitled',
      date: new Date().toLocaleDateString()
    };

    setPhotos([newPhoto, ...photos]);
    setNewUrl('');
    setNewCaption('');
    setIsAdding(false);
  };

  const handleDeletePhoto = (id: number) => {
    if (window.confirm('Delete this masterpiece?')) {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  const handleUpdateSocial = (id: string, field: keyof SocialProfile, value: string) => {
    setSocials(socials.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const activeWord = HERO_WORDS[wordIndex];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b-2 border-stone-900 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter brand-font flex items-center gap-2 select-none hover:scale-105 transition-transform cursor-pointer">
          <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center rounded-sm rotate-3">
            <Camera size={18} />
          </div>
          LOLOLO
        </div>
        <div className="flex gap-6 text-sm font-bold tracking-wide">
          <a href="#gallery" className="hover:text-lime-600 transition-colors">WORKS</a>
          <a href="#socials" className="hover:text-lime-600 transition-colors">CONNECT</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex flex-col justify-center px-6 border-b-2 border-stone-900 overflow-hidden">
        
        {/* Background Scrolling Marquee */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-[0.04] pointer-events-none select-none z-0">
          <div className="whitespace-nowrap animate-marquee flex gap-8">
            {Array(10).fill("LOLOLO PHOTOGRAPHY").map((t, i) => (
              <span key={i} className="text-[12rem] font-black leading-none">{t}</span>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full py-20">
          <p className="font-mono text-stone-500 mb-4 tracking-widest uppercase text-sm md:text-base">
            Portfolio / 2024
          </p>
          <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter mb-8 leading-[0.85] md:leading-[0.85]">
            CAPTURING <br />
            {/* Dynamic Word Container */}
            <span className="relative inline-block min-w-[300px]">
              <span 
                key={wordIndex} // Key change triggers animation
                className={`animate-text-change inline-block text-transparent bg-clip-text bg-gradient-to-r ${activeWord.gradient}`}
              >
                {activeWord.text}
              </span>
            </span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mt-8">
            <p className="text-xl md:text-2xl max-w-xl font-medium text-stone-800 leading-relaxed">
              A visual archive of light, shadow, and fleeting moments.
              Welcome to my digital darkroom.
            </p>
            
            <a href="#gallery" className="group flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-lime-400 hover:text-stone-900 transition-all duration-300">
              EXPLORE WORKS
              <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <main id="gallery" className="flex-grow max-w-7xl mx-auto w-full px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-stone-200 pb-6 gap-6">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold brand-font tracking-tight">THE ARCHIVE</h2>
            <p className="text-stone-500 mt-2 font-mono uppercase tracking-wider">Curated Selection</p>
          </div>
          
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="group flex items-center gap-2 bg-white border-2 border-stone-900 text-stone-900 px-6 py-3 hover:bg-stone-900 hover:text-white transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            {isAdding ? <X size={20}/> : <Plus size={20}/>}
            <span className="font-bold text-sm tracking-widest">{isAdding ? 'CLOSE PANEL' : 'ADD NEW WORK'}</span>
          </button>
        </div>

        {/* Add Photo Form Panel */}
        {isAdding && (
          <div className="mb-16 bg-lime-50 p-8 border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] animate-text-change">
            <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
              <div className="bg-lime-400 p-2 border border-stone-900 rounded-full"><ImageIcon size={20}/></div>
              UPLOAD NEW PIECE
            </h3>
            <form onSubmit={handleAddPhoto} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Image URL (e.g. Unsplash link)"
                className="flex-grow p-4 border-2 border-stone-300 focus:border-stone-900 focus:bg-white outline-none bg-white/50 font-mono text-sm transition-colors placeholder:text-stone-400"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Title / Caption"
                className="md:w-1/3 p-4 border-2 border-stone-300 focus:border-stone-900 focus:bg-white outline-none bg-white/50 font-mono text-sm transition-colors"
                value={newCaption}
                onChange={e => setNewCaption(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-stone-900 text-white border-2 border-stone-900 px-10 py-4 font-bold hover:bg-lime-400 hover:text-stone-900 transition-colors uppercase tracking-widest"
              >
                Publish
              </button>
            </form>
          </div>
        )}

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid group relative bg-white border-2 border-transparent hover:border-stone-900 hover:shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] transition-all duration-300 ease-out">
              {/* Image Container */}
              <div className="relative bg-stone-100 overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.caption} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Image+Error';
                  }}
                />
                
                {/* Overlay actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button 
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="bg-white text-stone-900 border-2 border-stone-900 p-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors shadow-lg cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="p-5 bg-white border-t-2 border-transparent group-hover:border-stone-900">
                <h3 className="font-bold brand-font text-xl truncate leading-tight">{photo.caption}</h3>
                <p className="text-xs font-mono text-stone-400 mt-2 flex justify-between items-center">
                  <span>{photo.date}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-stone-900 font-bold transition-opacity">#00{photo.id.toString().slice(-2)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-stone-300 rounded-lg">
            <p className="text-3xl brand-font text-stone-300 mb-4 font-bold">ARCHIVE EMPTY</p>
            <p className="text-stone-400 mb-8">The gallery is waiting for your vision.</p>
            <button 
              onClick={() => setIsAdding(true)} 
              className="text-stone-900 font-bold underline decoration-2 underline-offset-4 hover:text-lime-600 cursor-pointer"
            >
              Upload your first photo
            </button>
          </div>
        )}
      </main>

      {/* Socials / Footer Section */}
      <footer id="socials" className="bg-stone-900 text-stone-50 pt-24 pb-12 px-6 border-t-2 border-lime-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-6xl md:text-8xl font-black brand-font tracking-tighter leading-[0.9]">
                  LET'S <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">CONNECT</span>
                </h2>
                
                {/* Edit Socials Toggle */}
                <button 
                  onClick={() => setIsEditingSocials(!isEditingSocials)}
                  className={`self-end mb-4 p-3 rounded-full border border-stone-700 hover:bg-stone-800 transition-colors ${isEditingSocials ? 'bg-lime-400 text-stone-900 border-lime-400' : 'text-stone-500'}`}
                  title={isEditingSocials ? "Save Changes" : "Edit Social Links"}
                >
                  {isEditingSocials ? <Check size={24} /> : <Edit2 size={24} />}
                </button>
              </div>
            </div>
            <p className="text-stone-400 max-w-md text-lg">
              Open for collaborations. <br/>
              {isEditingSocials ? <span className="text-lime-400 font-bold animate-pulse">EDITING MODE ACTIVE</span> : "Click the edit icon to update your links."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            {socials.map((profile) => (
              <SocialCard 
                key={profile.id} 
                profile={profile} 
                isEditing={isEditingSocials}
                onUpdate={handleUpdateSocial}
              />
            ))}
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 text-sm font-mono">
             <p>&copy; {new Date().getFullYear()} LOLOLO PORTFOLIO.</p>
             <p>DESIGNED IN REACT.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}