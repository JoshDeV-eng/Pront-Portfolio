/* ==========================================================================
   Josh_Dev — Hero 3D Scene
   A wireframe icosahedron cluster that drifts on its own and tilts
   toward the pointer. Kept intentionally lightweight (no postprocessing)
   to stay inside a 16ms frame budget on modest hardware.
   ========================================================================== */

(function () {
  var canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // -------- Palette (mirrors css tokens) --------
  var amber = 0xf2b84b;
  var violet = 0x8c7ae6;
  var paper = 0xece9e2;

  var group = new THREE.Group();
  scene.add(group);

  // Core wireframe icosahedron
  var coreGeo = new THREE.IcosahedronGeometry(2.4, 1);
  var coreMat = new THREE.MeshBasicMaterial({ color: paper, wireframe: true, transparent: true, opacity: 0.35 });
  var core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Inner solid-ish accent shape
  var innerGeo = new THREE.OctahedronGeometry(1.1, 0);
  var innerMat = new THREE.MeshBasicMaterial({ color: amber, wireframe: true, transparent: true, opacity: 0.8 });
  var inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  // Orbiting points ring
  var ringGeo = new THREE.TorusGeometry(3.4, 0.01, 8, 120);
  var ringMat = new THREE.MeshBasicMaterial({ color: violet, transparent: true, opacity: 0.5 });
  var ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  // Scattered particles
  var particleCount = 140;
  var positions = new Float32Array(particleCount * 3);
  for (var i = 0; i < particleCount; i++) {
    var radius = 5 + Math.random() * 4;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var particleMat = new THREE.PointsMaterial({ color: paper, size: 0.035, transparent: true, opacity: 0.5 });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // -------- Pointer interaction --------
  var pointer = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };

  function onPointerMove(e) {
    var x = (e.touches ? e.touches[0].clientX : e.clientX);
    var y = (e.touches ? e.touches[0].clientY : e.clientY);
    target.x = (x / window.innerWidth - 0.5) * 2;
    target.y = (y / window.innerHeight - 0.5) * 2;
  }
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    pointer.x += (target.x - pointer.x) * 0.04;
    pointer.y += (target.y - pointer.y) * 0.04;

    var driftSpeed = reduceMotion ? 0.04 : 0.18;

    group.rotation.y = t * driftSpeed + pointer.x * 0.6;
    group.rotation.x = t * (driftSpeed * 0.5) + pointer.y * 0.4;

    inner.rotation.y = -t * (driftSpeed * 1.6);
    inner.rotation.x = t * (driftSpeed * 1.2);

    ring.rotation.z = t * (driftSpeed * 0.7);

    particles.rotation.y = t * 0.02;

    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (-pointer.y * 0.4 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();
