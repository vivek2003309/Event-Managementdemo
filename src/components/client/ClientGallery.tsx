import React, { useState, useMemo } from 'react';
import { GalleryPhoto } from '../../types/firebase';
import {
  Image,
  Sparkles,
  Camera,
  Eye,
  Filter,
} from 'lucide-react';

const MOODBOARD_PHOTOS: GalleryPhoto[] = [
  {
    id: 'g-1',
    title: 'Jagmandir Island Palace Floating Floral Mandap',
    category: 'Scenography',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    caption: '10,000 hand-threaded marigolds, tuberoses & brass hanging lanterns.',
  },
  {
    id: 'g-2',
    title: 'Vintage Mewari Brass Flotilla Baraat',
    category: 'Rituals',
    imageUrl:
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1000&q=80',
    caption: 'Lake Pichola sunset procession with traditional royal fanfare.',
  },
  {
    id: 'g-3',
    title: 'Haldi Courtyard Marigold Rain & Stepwell',
    category: 'Rituals',
    imageUrl:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    caption: 'Vibrant organic turmeric rituals with live folk musicians.',
  },
  {
    id: 'g-4',
    title: 'Celestial Sangeet Lighting & Crystal Canopy',
    category: 'Scenography',
    imageUrl:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    caption: 'Cascading fairy-light ceilings and acoustic symphony stage.',
  },
  {
    id: 'g-5',
    title: 'Royal Table Scape & Chiseled Silverware',
    category: 'Gastronomy',
    imageUrl:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    caption: 'Hand-painted Mewari thalis, rose crystal goblets, and calligraphed menus.',
  },
  {
    id: 'g-6',
    title: 'Sunset Nuptial Vows over Lake Pichola',
    category: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    caption: 'Golden hour portraits capturing raw emotion and royal heritage.',
  },
];

export const ClientGallery: React.FC = () => {
  const [filterCat, setFilterCat] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const filtered = useMemo(() => {
    if (filterCat === 'all') return MOODBOARD_PHOTOS;
    return MOODBOARD_PHOTOS.filter((p) => p.category === filterCat);
  }, [filterCat]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs">
        <div>
          <h2 className="font-serif text-[22px] text-[#171717]">
            Curated Nuptial Visual Archive &amp; Moodboard
          </h2>
          <p className="text-[12px] text-[#77736D] font-light">
            Editorial references, palace lighting renders, and approved scenography palettes
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-[4px] border border-[#EAE5DC] text-[11px]">
          {['all', 'Scenography', 'Rituals', 'Portraits', 'Gastronomy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors cursor-pointer ${
                filterCat === cat
                  ? 'bg-[#171717] text-white font-semibold'
                  : 'text-[#77736D] hover:text-[#171717]'
              }`}
            >
              {cat === 'all' ? 'All Moods' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group bg-white rounded-[10px] border border-[#EAE5DC] overflow-hidden shadow-xs hover:border-[#C6A66B] transition-all cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#24211D]">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[12px] font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-[4px] backdrop-blur-xs">
                  <Eye className="w-4 h-4 text-[#C6A66B]" />
                  <span>Inspect Visual</span>
                </span>
              </div>
            </div>

            <div className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#8C6D37] tracking-wider block">
                {photo.category}
              </span>
              <h4 className="font-serif text-[16px] text-[#171717] font-medium line-clamp-1">
                {photo.title}
              </h4>
              <p className="text-[12px] text-[#77736D] font-light line-clamp-2">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white max-w-3xl w-full rounded-[12px] overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[16/10] bg-black">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="p-5 space-y-2 bg-[#FAF8F5]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C6D37]">
                  {activePhoto.category}
                </span>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="text-[12px] text-[#77736D] hover:text-[#171717]"
                >
                  Close
                </button>
              </div>
              <h3 className="font-serif text-[20px] text-[#171717]">{activePhoto.title}</h3>
              <p className="text-[13px] text-[#77736D] font-light">{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
