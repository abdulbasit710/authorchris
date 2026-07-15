import React, { useEffect, useRef } from "react";
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import "./GradientBlinds.css";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uResolution;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uAngle;
  uniform float uNoise;
  uniform float uBlindCount;
  uniform float uSpotlightRadius;
  uniform float uSpotlightSoftness;
  uniform float uSpotlightOpacity;
  uniform float uDistort;

  float random(vec2 value) {
    return fract(sin(dot(value, vec2(12.9898, 78.233))) * 43758.5453);
  }

  mat2 rotate2d(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
  }

  vec3 gradientColor(float t) {
    vec3 black = vec3(0.008, 0.007, 0.006);
    vec3 bronze = vec3(0.25, 0.15, 0.055);
    vec3 gold = vec3(0.85, 0.63, 0.27);
    vec3 graphite = vec3(0.19, 0.20, 0.19);
    if (t < 0.34) return mix(black, bronze, t / 0.34);
    if (t < 0.68) return mix(bronze, gold, (t - 0.34) / 0.34);
    return mix(gold, graphite, (t - 0.68) / 0.32);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= aspect;
    centered = rotate2d(uAngle) * centered;
    centered.x /= aspect;
    uv = centered * 0.5 + 0.5;

    uv.x += sin(uv.y * 7.0 + uTime * 0.13) * 0.008 * uDistort;
    float stripe = fract(uv.x * max(uBlindCount, 1.0));
    float blindShade = mix(0.16, 0.92, smoothstep(0.04, 0.94, stripe));
    vec3 color = gradientColor(clamp(uv.x, 0.0, 1.0)) * blindShade;

    vec2 mouseUv = uMouse / uResolution.xy;
    float distanceToMouse = distance(vUv, mouseUv);
    float spotlight = 1.0 - smoothstep(
      uSpotlightRadius * 0.2,
      uSpotlightRadius,
      pow(distanceToMouse, max(0.2, uSpotlightSoftness))
    );
    color += vec3(0.95, 0.76, 0.4) * spotlight * uSpotlightOpacity * 0.28;

    float grain = (random(gl_FragCoord.xy + uTime * 19.0) - 0.5) * uNoise;
    color += grain;
    float edgeFade = 1.0 - smoothstep(0.52, 0.94, length(vUv - 0.5));
    float alpha = clamp(max(max(color.r, color.g), color.b) * 0.56, 0.08, 0.48) * edgeFade;
    gl_FragColor = vec4(max(color, vec3(0.0)), alpha);
  }
`;

function GradientBlinds({
  angle = 20,
  noise = 0.035,
  blindCount = 16,
  spotlightRadius = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 0.8,
  mouseDampening = 0.15,
  distortAmount = 0.35,
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return undefined;

    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.35));
    stage.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;
    const uniforms = {
      uResolution: { value: new Vector3(1, 1, 1) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uAngle: { value: (angle * Math.PI) / 180 },
      uNoise: { value: mobile ? noise * 0.55 : noise },
      uBlindCount: { value: mobile ? Math.min(10, blindCount) : blindCount },
      uSpotlightRadius: { value: spotlightRadius },
      uSpotlightSoftness: { value: spotlightSoftness },
      uSpotlightOpacity: { value: mobile ? spotlightOpacity * 0.55 : spotlightOpacity },
      uDistort: { value: distortAmount },
    };
    const geometry = new PlaneGeometry(2, 2);
    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    scene.add(new Mesh(geometry, material));

    const mouseTarget = new Vector2(0.5, 0.5);
    const mouseCurrent = new Vector2(0.5, 0.5);
    let visible = false;
    let frameId = 0;
    let startTime = performance.now();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
      const effectiveCount = Math.max(6, Math.min(uniforms.uBlindCount.value, Math.floor(width / (mobile ? 48 : 70))));
      uniforms.uBlindCount.value = effectiveCount;
    };

    const pointerMove = (event) => {
      if (mobile) return;
      const dpr = renderer.getPixelRatio();
      mouseTarget.set(event.clientX * dpr, (window.innerHeight - event.clientY) * dpr);
    };

    const render = (time) => {
      if (visible) {
        const factor = Math.min(0.22, Math.max(0.025, mouseDampening));
        mouseCurrent.lerp(mouseTarget, factor);
        uniforms.uMouse.value.copy(mouseCurrent);
        uniforms.uTime.value = ((time - startTime) / 1000) * (reducedMotion ? 0.08 : mobile ? 0.35 : 0.65);
        renderer.render(scene, camera);
      }
      frameId = window.requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      container.classList.toggle("is-visible", visible);
      if (visible) startTime = performance.now() - uniforms.uTime.value * 1000;
    });

    resize();
    observer.observe(container);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", pointerMove, { passive: true });
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [angle, blindCount, distortAmount, mouseDampening, noise, spotlightOpacity, spotlightRadius, spotlightSoftness]);

  return (
    <div className="gradient-blinds-container" ref={containerRef} aria-hidden="true">
      <div className="gradient-blinds-stage" ref={stageRef} />
    </div>
  );
}

export default GradientBlinds;
