import { useState, useRef, useEffect } from "react";
import './wheelpicker.css'


export default function WheelPicker({
      items,
      value,
      onChange,
      format = (v) => v,
      className = "",
}) {
      const containerRef = useRef(null);

      function handleScroll() {
            const container = containerRef.current;
            if (!container) return;

            const itemHeight = 65;
            const index = Math.round(container.scrollTop / itemHeight);

            const selected = items[index];

            if (selected !== undefined) {
                  onChange(selected);
            }
            // console.log('Selected Time : ', selected);
      }

      useEffect(() => {
            const container = containerRef.current;
            if (!container) return;
            const index = items.indexOf(value);

            if (index === -1) return;
            container.scrollTo({ top: index * 65, behavior: "instant" });
      }, []);

      return (
            <div className={`relative ${className}`}>

                  {/* TOP FADE */}
                  <div className="pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-neutral-800 to-transparent z-10" />

                  {/* CENTER HIGHLIGHT */}
                  <div className="pointer-events-none absolute top-1/2 left-0 right-0 h-10 -translate-y-1/2 rounded-xl border border-rose-700/40 bg-neutral-700/30 z-10" />

                  {/* BOTTOM FADE */}
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-neutral-800 to-transparent z-10" />

                  <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        className="
                          h-15
                          overflow-y-auto
                          snap-y
                          snap-mandatory
                          scrollbar-none
                          scroll-smooth
                    "
                  >
                        {/* TOP SPACING */}
                        <div className="h-10" />

                        {items.map((item) => {
                              const active = item === value;

                              return (
                                    <div
                                          key={item}
                                          className={`
                                            h-15
                                            snap-center
                                            flex
                                            items-center
                                            justify-center
                                            text-sm
                                            transition-all
                                           duration-150
                                            ${active
                                                      ? "text-white font-semibold scale-110"
                                                      : "text-neutral-500"}
                                      `}
                                    >
                                          {format(item)}
                                    </div>
                              );
                        })}

                        {/* BOTTOM SPACING */}
                        <div className="h-16" />
                  </div>
            </div>
      );
}