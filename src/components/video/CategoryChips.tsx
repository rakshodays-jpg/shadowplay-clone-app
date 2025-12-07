import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  'All',
  'Music',
  'Gaming',
  'Live',
  'News',
  'Sports',
  'Learning',
  'Fashion',
  'Podcasts',
  'Comedy',
  'Movies',
  'Recently uploaded',
  'New to you',
];

interface CategoryChipsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative bg-background sticky top-14 z-40">
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-background via-background to-transparent pr-4">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full hover:bg-youtube-hover transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-youtube-icon" />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              selected === category
                ? 'bg-youtube-chip-active text-youtube-chip-active-text'
                : 'bg-youtube-chip text-youtube-chip-text hover:bg-youtube-hover'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-background via-background to-transparent pl-4">
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full hover:bg-youtube-hover transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-youtube-icon" />
          </button>
        </div>
      )}
    </div>
  );
}
