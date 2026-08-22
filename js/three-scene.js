/* ==========================================================================
   Josh_Dev — Hero 3D Scene ("Drafting Room")
   A pure-wireframe geometry cluster — paper-white core, cyan accent shape,
   redline dimension rings — that drifts on its own and tilts toward the
   pointer, like a live blueprint render. No filled surfaces, on purpose.
   Kept lightweight (no postprocessing) to stay inside a 16ms frame budget.
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

  // -------- Palette (mirrors css tokens: blueprint wireframe only) --------
  var paper = 0xe4ebf0;
  var cyan = 0x6fd6e8;
  var red = 0xe4572e;

  var group = new THREE.Group();
  scene.add(group);

  // Core wireframe icosahedron — the "drawn" geometry
  var coreGeo = new THREE.IcosahedronGeometry(2.4, 1);
  var coreMat = new THREE.MeshBasicMaterial({ color: paper, wireframe: true, transparent: true, opacity: 0.4 });
  var core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Inner cyan wireframe accent shape
  var innerGeo = new THREE.OctahedronGeometry(1.1, 0);
  var innerMat = new THREE.MeshBasicMaterial({ color: cyan, wireframe: true, transparent: true, opacity: 0.75 });
  var inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  // Orbiting ring — thin redline, like a dimension circle
  var ringGeo = new THREE.TorusGeometry(3.4, 0.008, 8, 120);
  var ringMat = new THREE.MeshBasicMaterial({ color: red, transparent: true, opacity: 0.55 });
  var ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  // Secondary dashed-feel guide ring in cyan
  var ring2Geo = new THREE.TorusGeometry(4.3, 0.006, 6, 90);
  var ring2Mat = new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.3 });
  var ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 1.8;
  group.add(ring2);

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
    ring2.rotation.z = -t * (driftSpeed * 0.5);

    particles.rotation.y = t * 0.02;

    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (-pointer.y * 0.4 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();
