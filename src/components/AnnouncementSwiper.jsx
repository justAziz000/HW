import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getAnnouncements } from './store';
import { Megaphone } from 'lucide-react';

export function AnnouncementSwiper() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        setAnnouncements(getAnnouncements());

        const handler = () => setAnnouncements(getAnnouncements());
        window.addEventListener('announcements-updated', handler);
        return () => window.removeEventListener('announcements-updated', handler);
    }, []);

    if (announcements.length === 0) return null;

    return (
        <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-b border-indigo-700 relative overflow-hidden">
            <div className="max-w-6xl mx-auto flex items-center">
                <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-indigo-800 font-bold z-10 shrink-0">
                    <Megaphone className="w-5 h-5 animate-pulse" />
                    E'lonlar:
                </div>

                <div className="overflow-hidden flex-1 cursor-grab active:cursor-grabbing" ref={emblaRef}>
                    <div className="flex">
                        {announcements.map((ann) => (
                            <div className="flex-[0_0_100%] min-w-0 py-3 px-6 flex items-center justify-center text-center md:text-left md:justify-start" key={ann.id}>
                                <span className="font-medium text-lg leading-tight">{ann.text}</span>
                                <span className="ml-4 text-xs opacity-60 bg-white/10 px-2 py-1 rounded-md hidden sm:inline-block">
                                    {new Date(ann.date).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
