import { matches } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Format date properly
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', options).toUpperCase();
  };

  // Render a single match card
  const createMatchCard = (match) => {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    // Generate TV MX HTML
    let tvMxHtml = '';
    if (match.mexicoTV.free.length > 0) {
      match.mexicoTV.free.forEach(ch => {
        tvMxHtml += `<span class="tag free"><i class="fa-solid fa-tv"></i> ABIERTO: ${ch}</span>`;
      });
    }
    if (match.mexicoTV.pay.length > 0) {
      match.mexicoTV.pay.forEach(ch => {
        tvMxHtml += `<span class="tag pay"><i class="fa-solid fa-lock"></i> PAGO: ${ch}</span>`;
      });
    }
    if (!tvMxHtml) tvMxHtml = '<span class="tag" style="opacity:0.5">Por confirmar</span>';

    // Generate VPN HTML
    let vpnHtml = '';
    match.vpnOptions.forEach(opt => {
      vpnHtml += `<span class="tag vpn"><i class="fa-solid fa-globe"></i> ${opt.country}: ${opt.platforms.join(', ')}</span>`;
    });
    if (!vpnHtml) vpnHtml = '<span class="tag" style="opacity:0.5">Por confirmar</span>';

    card.innerHTML = `
      <div class="match-header">
        <span class="stage">${match.stage}</span>
        <span class="date"><i class="fa-regular fa-calendar"></i> ${formatDate(match.date)}</span>
      </div>
      
      <div class="match-teams">
        <div class="team">
          <span class="team-flag">${match.flag1}</span>
          <span class="team-name">${match.team1}</span>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          <span class="team-flag">${match.flag2}</span>
          <span class="team-name">${match.team2}</span>
        </div>
      </div>
      
      <div class="match-header" style="border:none; padding:0; margin-bottom:1rem; justify-content:center;">
        <span class="stadium"><i class="fa-solid fa-location-dot"></i> ${match.stadium}</span>
      </div>

      <div class="match-info-grid">
        <div class="info-box tv-mexico">
          <h4><i class="fa-solid fa-satellite-dish"></i> TV México</h4>
          <div class="tag-list">
            ${tvMxHtml}
          </div>
        </div>
        
        <div class="info-box tv-vpn">
          <h4><i class="fa-solid fa-shield-halved"></i> Opciones VPN Gratis</h4>
          <div class="tag-list">
            ${vpnHtml}
          </div>
        </div>
      </div>
    `;
    
    return card;
  };

  // Render all matches based on filter
  const renderMatches = (filter = 'all') => {
    scheduleContainer.innerHTML = '';
    
    let filteredMatches = matches;
    
    if (filter === 'mexico') {
      filteredMatches = matches.filter(m => m.team1 === 'México' || m.team2 === 'México');
    } else if (filter === 'free') {
      filteredMatches = matches.filter(m => m.mexicoTV.free.length > 0);
    }
    
    // Sort by date
    filteredMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (filteredMatches.length === 0) {
      scheduleContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:2rem;">No hay partidos que coincidan con este filtro.</p>';
      return;
    }

    filteredMatches.forEach((match, index) => {
      const card = createMatchCard(match);
      card.style.animationDelay = `${index * 0.1}s`;
      scheduleContainer.appendChild(card);
    });
  };

  // Setup filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked
      e.target.classList.add('active');
      
      // Filter and render
      renderMatches(e.target.dataset.filter);
    });
  });

  // Initial render
  renderMatches();
});
