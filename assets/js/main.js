// Update copyright year
(function(){
  try{
    document.getElementById('y').textContent = new Date().getFullYear();
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
  
  var W = 800, baseY = 64, r = 16, speed = 120; // px/s
  var wheel = document.getElementById('wheel');
  var traceDot = document.getElementById('trace-dot');
  var tracePath = document.getElementById('cycloid-trace');

  // Generate ticks
  var ticks = document.getElementById('ticks'), ns = 'http://www.w3.org/2000/svg';
  if (ticks) {
    while (ticks.firstChild) ticks.removeChild(ticks.firstChild);
    var frag = document.createDocumentFragment();
    var step = Math.PI * r; // πr = half-turn
    for (var k = 0, x = 0; x <= W + r; k++, x = k * step) {
      var line = document.createElementNS(ns, 'line');
      var major = (k % 2 === 0); // even multiples => 0, 2πr, 4πr ... cusps
      line.setAttribute('class', major ? 'tick-major' : 'tick-minor');
      line.setAttribute('x1', x.toFixed(2));
      line.setAttribute('x2', x.toFixed(2));
      line.setAttribute('y1', baseY);
      line.setAttribute('y2', major ? (baseY - 10) : (baseY - 5));
      frag.appendChild(line);
    }
    ticks.appendChild(frag);
  }

  // Cycloid parametric equations
  function P(t){ 
    return { 
      x: r * (t - Math.sin(t)), 
      y: baseY - r * (1 - Math.cos(t)) 
    }; 
  }
  function C(t){ 
    return { 
      x: r * t, 
      y: baseY - r 
    }; 
  }

  var theta = 0, pathData = '', last = performance.now();
  
  function frame(now){
    var dt = (now - last) / 1000; 
    last = now; 
    var omega = speed / r; 
    theta += omega * dt;
    
    var c = C(theta), p = P(theta);

    // translate + rotate wheel; local spoke points down (0,+r) -> global (-r sinθ, +r cosθ)
    wheel.setAttribute('transform', 'translate(' + c.x.toFixed(2) + ',' + c.y.toFixed(2) + ') rotate(' + (theta * 180 / Math.PI).toFixed(2) + ')');

    traceDot.setAttribute('cx', p.x.toFixed(2)); 
    traceDot.setAttribute('cy', p.y.toFixed(2));

    if(!pathData) pathData = 'M ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    else pathData += ' L ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    tracePath.setAttribute('d', pathData);

    if(p.x > W + r){ 
      theta = 0; 
      pathData = ''; 
    } // reset when off-screen
    
    requestAnimationFrame(frame);
  }
  
  requestAnimationFrame(frame);
})();