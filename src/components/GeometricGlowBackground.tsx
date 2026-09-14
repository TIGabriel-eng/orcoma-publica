import React, { useEffect, useRef } from 'react';

interface GeometricGlowBackgroundProps {
  className?: string;
  baseColor?: string;
}

export const GeometricGlowBackground: React.FC<GeometricGlowBackgroundProps> = ({
  className = '',
  baseColor = '#07073b',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number; isHovering: boolean }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isHovering: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      if (!mousePos.current.isHovering) {
        mousePos.current.x = width * 0.5;
        mousePos.current.y = height * 0.5;
        mousePos.current.targetX = width * 0.5;
        mousePos.current.targetY = height * 0.5;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current.isHovering = true;
      mousePos.current.targetX = e.clientX - rect.left;
      mousePos.current.targetY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        mousePos.current.isHovering = true;
        mousePos.current.targetX = e.touches[0].clientX - rect.left;
        mousePos.current.targetY = e.touches[0].clientY - rect.top;
      }
    };

    const handleMouseLeave = () => {
      mousePos.current.isHovering = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;
    const triangleBase = 44;
    const triangleHeight = 1.732 * triangleBase;
    const gap = 3;

    const render = () => {
      time += 0.025;

      // Suave interpolação do mouse ou percurso autônomo
      if (mousePos.current.isHovering) {
        mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
        mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;
      } else {
        // Movimento autônomo suave pelo fundo quando não há interação de mouse
        mousePos.current.x = width * 0.5 + Math.sin(time * 0.8) * (width * 0.35);
        mousePos.current.y = height * 0.5 + Math.cos(time * 0.6) * (height * 0.3);
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Fundo azul escuro base
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, width, height);

      // 2. Ondas autônomas e contínuas de BRILHO DOURADO (Golden Glow)
      const primaryPulse = 0.55 + Math.sin(time * 1.8) * 0.25; // Pulso contínuo brilhante
      const secondaryPulse = 0.45 + Math.cos(time * 2.2) * 0.2;

      // Luz Principal Dourada 1 (Navega e pulsa intensamente em tons de ouro e âmbar)
      const glow1X = mousePos.current.x;
      const glow1Y = mousePos.current.y;
      const glow1Radius = Math.max(width * 0.38, 280) * (0.85 + primaryPulse * 0.3);

      const goldGrad1 = ctx.createRadialGradient(glow1X, glow1Y, 0, glow1X, glow1Y, glow1Radius);
      goldGrad1.addColorStop(0, `rgba(255, 220, 80, ${0.75 * primaryPulse})`); // Núcleo dourado brilhante
      goldGrad1.addColorStop(0.25, `rgba(232, 184, 0, ${0.55 * primaryPulse})`); // rgb(232, 184, 0)
      goldGrad1.addColorStop(0.55, `rgba(200, 150, 0, ${0.35 * primaryPulse})`);
      goldGrad1.addColorStop(0.8, `rgba(160, 120, 0, ${0.15 * primaryPulse})`);
      goldGrad1.addColorStop(1, 'rgba(7, 7, 59, 0)');

      ctx.fillStyle = goldGrad1;
      ctx.fillRect(0, 0, width, height);

      // Luz Dourada 2 (Ponto de luz orbital à esquerda/superior)
      const glow2X = width * 0.2 + Math.sin(time * 1.2) * (width * 0.15);
      const glow2Y = height * 0.35 + Math.cos(time * 0.9) * (height * 0.2);
      const glow2Radius = Math.max(width * 0.32, 220) * (0.9 + secondaryPulse * 0.2);

      const goldGrad2 = ctx.createRadialGradient(glow2X, glow2Y, 0, glow2X, glow2Y, glow2Radius);
      goldGrad2.addColorStop(0, `rgba(255, 230, 110, ${0.6 * secondaryPulse})`);
      goldGrad2.addColorStop(0.35, `rgba(232, 184, 0, ${0.4 * secondaryPulse})`);
      goldGrad2.addColorStop(0.7, `rgba(180, 140, 0, ${0.18 * secondaryPulse})`);
      goldGrad2.addColorStop(1, 'rgba(7, 7, 59, 0)');

      ctx.fillStyle = goldGrad2;
      ctx.fillRect(0, 0, width, height);

      // Luz Dourada 3 (Ponto de luz orbital à direita/inferior)
      const glow3X = width * 0.8 + Math.cos(time * 0.95) * (width * 0.12);
      const glow3Y = height * 0.7 + Math.sin(time * 1.1) * (height * 0.2);
      const glow3Radius = Math.max(width * 0.3, 200);

      const goldGrad3 = ctx.createRadialGradient(glow3X, glow3Y, 0, glow3X, glow3Y, glow3Radius);
      goldGrad3.addColorStop(0, `rgba(245, 205, 50, ${0.5 * primaryPulse})`);
      goldGrad3.addColorStop(0.4, `rgba(232, 184, 0, ${0.3 * primaryPulse})`);
      goldGrad3.addColorStop(1, 'rgba(7, 7, 59, 0)');

      ctx.fillStyle = goldGrad3;
      ctx.fillRect(0, 0, width, height);

      // 3. Renderização da malha de triângulos geométrica
      const colWidth = triangleBase * 2;
      const cols = Math.ceil(width / colWidth) + 2;
      const rows = Math.ceil(height / (triangleHeight / 2)) + 2;

      ctx.fillStyle = baseColor;

      for (let r = 0; r < rows; r++) {
        const y = r * (triangleHeight / 2);
        const isOffset = r % 2 === 1;
        const offsetX = isOffset ? -triangleBase : 0;

        for (let c = -1; c < cols; c++) {
          const x = c * colWidth + offsetX;

          // Triângulo apontando para cima
          ctx.beginPath();
          ctx.moveTo(x + triangleBase, y + gap);
          ctx.lineTo(x + colWidth - gap, y + triangleHeight - gap);
          ctx.lineTo(x + gap, y + triangleHeight - gap);
          ctx.closePath();
          ctx.fill();

          // Triângulo apontando para baixo
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + colWidth, y);
          ctx.lineTo(x + triangleBase, y + triangleHeight - gap);
          ctx.closePath();
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [baseColor]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
