/* Floating UI Components Library */

// Enhanced Floating Particles Generator
export function FloatingParticles() {
      const particles = Array.from({ length: 20 }, (_, i) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomDelay = Math.random() * 5;
            const randomDuration = 8 + Math.random() * 6;
            const isVertical = Math.random() > 0.5;

            return {
                  id: i,
                  x: randomX,
                  y: randomY,
                  delay: randomDelay,
                  duration: randomDuration,
                  size: 2 + Math.random() * 4,
                  isVertical,
                  color: [
                        'rgba(244, 63, 94, 0.6)',    // rose
                        'rgba(168, 85, 247, 0.6)',   // purple
                        'rgba(6, 182, 212, 0.4)',    // cyan
                        'rgba(59, 130, 246, 0.4)',   // blue
                  ][Math.floor(Math.random() * 4)]
            };
      });

      return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                  {particles.map(particle => (
                        <div
                              key={particle.id}
                              className="absolute rounded-full particle-dot"
                              style={{
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    background: particle.color,
                                    animation: `particle-float ${particle.duration}s linear infinite`,
                                    animationDelay: `${particle.delay}s`,
                              }}
                        />
                  ))}
            </div>
      );
}

// Enhanced Background Orbs
export function FloatingOrbs() {
      return (
            <>
                  {/* Rose Orb - Top Left */}
                  <div
                        className="floating-orb orb-rose fixed"
                        style={{
                              top: '-100px',
                              left: '10%',
                              zIndex: 0,
                        }}
                  />

                  {/* Purple Orb - Bottom Right */}
                  <div
                        className="floating-orb orb-purple fixed"
                        style={{
                              bottom: '-50px',
                              right: '5%',
                              zIndex: 0,
                        }}
                  />

                  {/* Cyan Orb - Top Right */}
                  <div
                        className="floating-orb orb-cyan fixed"
                        style={{
                              top: '20%',
                              right: '15%',
                              zIndex: 0,
                        }}
                  />

                  {/* Blue Orb - Bottom Left */}
                  <div
                        className="floating-orb orb-blue fixed"
                        style={{
                              bottom: '10%',
                              left: '20%',
                              zIndex: 0,
                        }}
                  />
            </>
      );
}

// Grid Background
export function GridBackground() {
      return (
            <div
                  className="grid-background fixed inset-0"
                  style={{
                        zIndex: 0,
                  }}
            />
      );
}

// Radial Gradient Overlay
export function RadialGradientOverlay() {
      return (
            <div
                  className="radial-gradient-overlay fixed inset-0"
                  style={{
                        zIndex: 0,
                  }}
            />
      );
}

// Corner Ornaments for Card
export function CornerOrnaments() {
      return (
            <>
                  <div className="corner-ornament corner-top-left" />
                  <div className="corner-ornament corner-top-right" />
                  <div className="corner-ornament corner-bottom-left" />
                  <div className="corner-ornament corner-bottom-right" />
            </>
      );
}

// Floating Lines
export function FloatingLines() {
      const lines = [
            { color: 'line-rose', top: '20%', left: '10%', delay: 0 },
            { color: 'line-purple', top: '40%', right: '15%', delay: 0.5 },
            { color: 'line-cyan', top: '60%', left: '20%', delay: 1 },
            { color: 'line-rose', top: '80%', right: '10%', delay: 1.5 },
            { color: 'line-purple', top: '30%', right: '5%', delay: 0.8 },
            { color: 'line-cyan', top: '70%', left: '5%', delay: 1.2 },
      ];

      return (
            <div className="floating-lines-container absolute inset-0 pointer-events-none">
                  {lines.map((line, idx) => (
                        <div
                              key={idx}
                              className={`floating-line ${line.color}`}
                              style={{
                                    top: line.top,
                                    ...(line.left && { left: line.left }),
                                    ...(line.right && { right: line.right }),
                                    animationDelay: `${line.delay}s`,
                              }}
                        />
                  ))}
            </div>
      );
}

// Enhanced Card Wrapper
export function AuthCardWrapper({ children, className = "" }) {
      return (
            <div className={`auth-card-enhanced ${className}`}>
                  <CornerOrnaments />
                  <FloatingLines />
                  {children}
            </div>
      );
}

// Enhanced Background Wrapper
export function EnhancedAuthBackground({ children, withParticles = true }) {
      return (
            <div className="relative w-full min-h-screen" style={{ background: "#0a0a0a" }}>
                  {/* Background Layers */}
                  <FloatingOrbs />
                  <GridBackground />
                  <RadialGradientOverlay />
                  {withParticles && <FloatingParticles />}

                  {/* Content */}
                  <div className="relative z-10">
                        {children}
                  </div>
            </div>
      );
}
