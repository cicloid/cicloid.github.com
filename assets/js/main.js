// Update copyright year
(function(){
  try{
    document.getElementById('y').textContent = new Date().getFullYear();
  } catch(_) {}
})();

// Email obfuscation (anti-spam protection)
(function(){
  try {
    var emailLink = document.getElementById('email-link');
    if (emailLink) {
      var user = emailLink.getAttribute('data-user');
      var domain = emailLink.getAttribute('data-domain');
      var email = user + '@' + domain;
      emailLink.href = 'mailto:' + email;
      emailLink.textContent = email;
      emailLink.setAttribute('aria-label', 'Send email to ' + email);
    }
  } catch(_) {}
})();

// Rolling circle cycloid (no-slip)
(function(){
  var reduce = false; 
  try {
    reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch(_) {}
  if(reduce) return;

  var svg = document.getElementById('cycloid-svg'); 
  if(!svg) return;
  
  // Get actual SVG dimensions for responsive animation
  function getAnimationParams() {
    var rect = svg.getBoundingClientRect();
    var viewBox = svg.viewBox.baseVal;
    
    // Use viewBox dimensions for consistent mathematical calculations
    var W = viewBox.width;  // 800
    var H = viewBox.height; // 72
    var baseY = H - 8;      // baseline position
    var r = 16;             // wheel radius (constant for proper circle)
    
    // Adjust speed proportionally to actual width
    var scaleFactor = rect.width / W;
    var speed = 120 * Math.max(0.5, scaleFactor); // px/s, minimum speed
    
    return { W: W, H: H, baseY: baseY, r: r, speed: speed };
  }
  
  var params = getAnimationParams();
  var wheel = document.getElementById('wheel');
  var traceDot = document.getElementById('trace-dot');
  var tracePath = document.getElementById('cycloid-trace');

  // Generate ticks using responsive parameters
  var ticks = document.getElementById('ticks'), ns = 'http://www.w3.org/2000/svg';
  if (ticks) {
    while (ticks.firstChild) ticks.removeChild(ticks.firstChild);
    var frag = document.createDocumentFragment();
    var step = Math.PI * params.r; // πr = half-turn
    for (var k = 0, x = 0; x <= params.W + params.r; k++, x = k * step) {
      var line = document.createElementNS(ns, 'line');
      var major = (k % 2 === 0); // even multiples => 0, 2πr, 4πr ... cusps
      line.setAttribute('class', major ? 'tick-major' : 'tick-minor');
      line.setAttribute('x1', x.toFixed(2));
      line.setAttribute('x2', x.toFixed(2));
      line.setAttribute('y1', params.baseY);
      line.setAttribute('y2', major ? (params.baseY - 10) : (params.baseY - 5));
      frag.appendChild(line);
    }
    ticks.appendChild(frag);
  }

  // Cycloid parametric equations using responsive parameters
  function P(t){ 
    return { 
      x: params.r * (t - Math.sin(t)), 
      y: params.baseY - params.r * (1 - Math.cos(t)) 
    }; 
  }
  function C(t){ 
    return { 
      x: params.r * t, 
      y: params.baseY - params.r 
    }; 
  }

  var theta = 0, pathData = '', last = performance.now();
  
  function frame(now){
    var dt = (now - last) / 1000; 
    last = now; 
    var omega = params.speed / params.r; 
    theta += omega * dt;
    
    var c = C(theta), p = P(theta);

    // translate + rotate wheel; local spoke points down (0,+r) -> global (-r sinθ, +r cosθ)
    wheel.setAttribute('transform', 'translate(' + c.x.toFixed(2) + ',' + c.y.toFixed(2) + ') rotate(' + (theta * 180 / Math.PI).toFixed(2) + ')');

    traceDot.setAttribute('cx', p.x.toFixed(2)); 
    traceDot.setAttribute('cy', p.y.toFixed(2));

    if(!pathData) pathData = 'M ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    else pathData += ' L ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    tracePath.setAttribute('d', pathData);

    if(p.x > params.W + params.r){ 
      theta = 0; 
      pathData = ''; 
    } // reset when off-screen
    
    requestAnimationFrame(frame);
  }
  
  // Handle window resize to maintain proper animation
  var resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      params = getAnimationParams();
      // Regenerate ticks for new dimensions
      if (ticks) {
        while (ticks.firstChild) ticks.removeChild(ticks.firstChild);
        var frag = document.createDocumentFragment();
        var step = Math.PI * params.r;
        for (var k = 0, x = 0; x <= params.W + params.r; k++, x = k * step) {
          var line = document.createElementNS(ns, 'line');
          var major = (k % 2 === 0);
          line.setAttribute('class', major ? 'tick-major' : 'tick-minor');
          line.setAttribute('x1', x.toFixed(2));
          line.setAttribute('x2', x.toFixed(2));
          line.setAttribute('y1', params.baseY);
          line.setAttribute('y2', major ? (params.baseY - 10) : (params.baseY - 5));
          frag.appendChild(line);
        }
        ticks.appendChild(frag);
      }
    }, 250);
  }
  
  window.addEventListener('resize', handleResize);
  requestAnimationFrame(frame);
})();