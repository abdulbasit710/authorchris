import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import "./LightRays.css";

const hexToRgb = (hex) => {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
};

const origins = {
  "top-left": (width, height) => ({ position: [0, -height * 0.2], direction: [0, 1] }),
  "top-center": (width, height) => ({ position: [width * 0.5, -height * 0.2], direction: [0, 1] }),
  "top-right": (width, height) => ({ position: [width, -height * 0.2], direction: [0, 1] }),
  "bottom-center": (width, height) => ({ position: [width * 0.5, height * 1.2], direction: [0, -1] }),
};

function LightRays({
  raysOrigin = "top-center",
  raysColor = "#d9ab55",
  raysSpeed = 0.5,
  lightSpread = 0.7,
  rayLength = 2.5,
  followMouse = true,
  mouseInfluence = 0.08,
  noiseAmount = 0.02,
  distortion = 0.015,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let animationFrame;
    let visible = true;
    const mouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.75), alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const uniforms = {
      time: { value: 0 },
      resolution: { value: [1, 1] },
      rayPosition: { value: [0, 0] },
      rayDirection: { value: [0, 1] },
      color: { value: hexToRgb(raysColor) },
      speed: { value: raysSpeed },
      spread: { value: lightSpread },
      rayLength: { value: rayLength },
      mouse: { value: [0.5, 0.5] },
      mouseInfluence: { value: mouseInfluence },
      noiseAmount: { value: noiseAmount },
      distortion: { value: distortion },
    };

    const program = new Program(gl, {
      vertex: `
        attribute vec2 position;
        void main() { gl_Position = vec4(position, 0.0, 1.0); }
      `,
      fragment: `
        precision highp float;
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 rayPosition;
        uniform vec2 rayDirection;
        uniform vec3 color;
        uniform float speed;
        uniform float spread;
        uniform float rayLength;
        uniform vec2 mouse;
        uniform float mouseInfluence;
        uniform float noiseAmount;
        uniform float distortion;

        float random(vec2 point) {
          return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float ray(vec2 source, vec2 direction, vec2 point, float seed, float pace) {
          vec2 delta = point - source;
          float distanceFromSource = length(delta);
          vec2 deltaDirection = normalize(delta);
          float alignment = dot(deltaDirection, direction);
          alignment += distortion * sin(time * 1.7 + distanceFromSource * 0.012);
          float cone = pow(max(alignment, 0.0), 1.0 / max(spread, 0.001));
          float angle = atan(deltaDirection.x, deltaDirection.y);
          float movingBands = 0.28 + 0.72 * pow(0.5 + 0.5 * sin(angle * seed + time * pace * speed), 7.0);
          float falloff = clamp((resolution.x * rayLength - distanceFromSource) / (resolution.x * rayLength), 0.0, 1.0);
          return cone * falloff * movingBands;
        }

        void main() {
          vec2 point = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
          vec2 mousePoint = mouse * resolution;
          vec2 mouseDirection = normalize(mousePoint - rayPosition);
          vec2 direction = normalize(mix(rayDirection, mouseDirection, mouseInfluence));
          float strength = ray(rayPosition, direction, point, 17.0, 0.72);
          strength += ray(rayPosition, direction, point, 10.5, -0.48) * 0.7;
          strength *= 1.0 + random(point * 0.012 + time * 0.02) * noiseAmount;
          float edgeFade = smoothstep(0.0, 0.16, gl_FragCoord.x / resolution.x)
                         * smoothstep(0.0, 0.16, 1.0 - gl_FragCoord.x / resolution.x);
          strength = clamp(strength * edgeFade * 0.86, 0.0, 0.72);
          gl_FragColor = vec4(color * strength, clamp(strength * 0.5, 0.0, 0.42));
        }
      `,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new Mesh(gl, { geometry, program });
    const getOrigin = origins[raysOrigin] || origins["top-center"];

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      const pixelWidth = width * renderer.dpr;
      const pixelHeight = height * renderer.dpr;
      uniforms.resolution.value = [pixelWidth, pixelHeight];
      const origin = getOrigin(pixelWidth, pixelHeight);
      uniforms.rayPosition.value = origin.position;
      uniforms.rayDirection.value = origin.direction;
    };

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / rect.width;
      mouse.y = (event.clientY - rect.top) / rect.height;
    };

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.02 });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    if (followMouse) window.addEventListener("pointermove", onMouseMove, { passive: true });
    resize();

    const render = (now) => {
      if (visible) {
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.06;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.06;
        uniforms.mouse.value = [smoothMouse.x, smoothMouse.y];
        uniforms.time.value = now * 0.001;
        renderer.render({ scene: mesh });
      }
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onMouseMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, followMouse, mouseInfluence, noiseAmount, distortion]);

  return <div ref={containerRef} className={`light-rays-container ${className}`.trim()} aria-hidden="true" />;
}

export default LightRays;
