
    //  WORKER DATA

  const WORKERS = [
    {
      id: 1, name: "Murugan Selvam", role: "Senior Plumber", icon: "🔧",
      category: "Plumber", location: "Trichy", availability: "available",
      rating: 4.9, reviews: 128, experience: 10, jobs: 342,
      skills: ["Pipe Fitting","Drainage","Solar Water","Bathroom Fix","Leak Repair"],
      bio: "Experienced plumber with 10+ years of hands-on work across residential and commercial projects. Specialises in drainage systems and solar water heater installations. Known for punctuality and fair pricing.",
      ratingReviews: [
        { stars: 5, text: "Murugan fixed our kitchen pipe leak within an hour. Honest about pricing, no hidden charges.", author: "Priya N., Trichy" },
        { stars: 5, text: "Excellent work on our bathroom renovation. Highly professional and clean.", author: "Karthik R., Trichy" }
      ]
    },
    {
      id: 2, name: "Lakshmi Rajan", role: "Certified Electrician", icon: "⚡",
      category: "Electrician", location: "Madurai", availability: "available",
      rating: 4.8, reviews: 94, experience: 7, jobs: 218,
      skills: ["House Wiring","Solar Panels","MCB Fitting","Fan/AC Install","Short Circuit Fix"],
      bio: "Certified electrician skilled in residential wiring and solar panel setups. Committed to safe, code-compliant work. Over 7 years serving homes and small businesses across Madurai district.",
      ratingReviews: [
        { stars: 5, text: "Got our entire house rewired professionally. No mess, no delays. Outstanding work!", author: "Arjun M., Madurai" },
        { stars: 4, text: "Fixed our short circuit quickly. Reasonable rates and very knowledgeable.", author: "Deepa K., Madurai" }
      ]
    },
    {
      id: 3, name: "Rajan Annamalai", role: "Painter & Decorator", icon: "🎨",
      category: "Painter", location: "Coimbatore", availability: "busy",
      rating: 4.7, reviews: 67, experience: 8, jobs: 193,
      skills: ["Interior Painting","Texture Finish","Waterproofing","Wall Putty","Enamel Work"],
      bio: "Artistic painter specialising in interior decoration and texture finishes. 8 years of experience delivering clean, uniform coats. Works with all paint brands and offers colour consultation.",
      ratingReviews: [
        { stars: 5, text: "Transformed our living room with a beautiful texture finish. Worth every rupee!", author: "Meena S., Coimbatore" },
        { stars: 4, text: "Good quality work but took slightly longer than expected. Final result was perfect.", author: "Vijay P., Coimbatore" }
      ]
    },
    {
      id: 4, name: "Senthil Kumar", role: "Professional Driver", icon: "🚗",
      category: "Driver", location: "Chennai", availability: "available",
      rating: 4.9, reviews: 210, experience: 12, jobs: 580,
      skills: ["City Driving","Highway Trips","Car Care","Night Driving","Outstation"],
      bio: "Licensed driver with 12 years of safe driving record. Familiar with all major Tamil Nadu routes. Available for daily commutes, outstation trips, and special occasions. Clean driving history.",
      ratingReviews: [
        { stars: 5, text: "Reliable, punctual, and very polite. Best driver I've hired through this platform.", author: "Ramya T., Chennai" },
        { stars: 5, text: "Drove us safely for our family trip to Ooty. Excellent knowledge of mountain roads.", author: "Suresh V., Chennai" }
      ]
    },
    {
      id: 5, name: "Geetha Devi", role: "Household Maid", icon: "🏠",
      category: "Maid", location: "Trichy", availability: "available",
      rating: 4.8, reviews: 156, experience: 6, jobs: 430,
      skills: ["House Cleaning","Cooking","Vessel Washing","Laundry","Child Care"],
      bio: "Dependable maid with 6 years of experience in full-time and part-time household work. Trustworthy with keys, careful with valuables. Excellent references from long-term employers.",
      ratingReviews: [
        { stars: 5, text: "Geetha has been working with us for 3 months. Extremely reliable and thorough.", author: "Anitha R., Trichy" },
        { stars: 5, text: "Very honest and hardworking. Takes initiative without being asked. Highly recommend.", author: "Sathya K., Trichy" }
      ]
    },
    {
      id: 6, name: "Pandi Raj", role: "Master Carpenter", icon: "🪵",
      category: "Carpenter", location: "Salem", availability: "available",
      rating: 4.6, reviews: 48, experience: 15, jobs: 164,
      skills: ["Furniture Making","Wardrobe Fit","Door Repair","Wood Polish","Modular Kitchen"],
      bio: "Master carpenter with 15 years crafting custom furniture and doing quality joinery work. Skilled in both traditional woodworking and modern modular setups. Trusted for quality finishes.",
      ratingReviews: [
        { stars: 5, text: "Built a beautiful custom wardrobe for our bedroom. Perfect finish and great price.", author: "Kavitha N., Salem" },
        { stars: 4, text: "Good workmanship. Kitchen cabinet came out exactly as we planned. Happy customer!", author: "Bala S., Salem" }
      ]
    },
    {
      id: 7, name: "Malar Vizhi", role: "Garden & Landscape", icon: "🌿",
      category: "Gardener", location: "Erode", availability: "available",
      rating: 4.7, reviews: 33, experience: 5, jobs: 89,
      skills: ["Garden Design","Plant Care","Lawn Mowing","Composting","Drip Irrigation"],
      bio: "Passionate gardener with expertise in both ornamental and kitchen gardens. Offers complete garden makeovers, regular maintenance visits, and plant health consultation. Eco-friendly methods.",
      ratingReviews: [
        { stars: 5, text: "Transformed our terrace into a beautiful green space. Very knowledgeable about plants.", author: "Nisha M., Erode" },
        { stars: 4, text: "Set up a kitchen garden for us. Very informative about composting and watering schedules.", author: "Rani T., Erode" }
      ]
    },
    {
      id: 8, name: "Chitra Priya", role: "Home Cook", icon: "🍳",
      category: "Cook", location: "Madurai", availability: "available",
      rating: 4.9, reviews: 87, experience: 9, jobs: 256,
      skills: ["South Indian","North Indian","Veg & Non-Veg","Catering","Tiffin Service"],
      bio: "Experienced cook specialising in authentic Tamil home cooking and North Indian cuisine. Available for daily cooking, special occasions, and tiffin services. Hygiene-conscious and adaptable to dietary needs.",
      ratingReviews: [
        { stars: 5, text: "Chitra cooked for our family function. Every dish was excellent, guests kept asking for more!", author: "Murali K., Madurai" },
        { stars: 5, text: "Daily tiffin service is clean, timely and delicious. Best decision we made this year.", author: "Saranya P., Madurai" }
      ]
    },
    {
      id: 9, name: "Babu Krishnan", role: "Electrician", icon: "⚡",
      category: "Electrician", location: "Chennai", availability: "busy",
      rating: 4.5, reviews: 52, experience: 4, jobs: 121,
      skills: ["House Wiring","Switch Repair","Fan Wiring","CCTV Install"],
      bio: "Young, energetic electrician with a solid foundation in residential electrical work. Quick learner, always on time, and keen on delivering tidy, safe work.",
      ratingReviews: [
        { stars: 4, text: "Did a good job fixing our switchboard. Arrived on time and was very polite.", author: "Deepak R., Chennai" },
        { stars: 5, text: "Installed our security cameras neatly. All wires hidden properly. Great work!", author: "Preethi M., Chennai" }
      ]
    },
    {
      id: 10, name: "Velu Murugan", role: "Plumber", icon: "🔧",
      category: "Plumber", location: "Coimbatore", availability: "offline",
      rating: 4.3, reviews: 28, experience: 3, jobs: 74,
      skills: ["Tap Repair","Pipe Fitting","Tank Cleaning"],
      bio: "Efficient plumber handling day-to-day plumbing repairs. Reliable for smaller jobs like tap fixing, pipe connections, and overhead tank maintenance at competitive rates.",
      ratingReviews: [
        { stars: 4, text: "Fixed our bathroom tap quickly. Simple job done well.", author: "Anand V., Coimbatore" }
      ]
    },
    {
      id: 11, name: "Kamala Devi", role: "Maid & Cook", icon: "🏠",
      category: "Maid", location: "Chennai", availability: "available",
      rating: 4.8, reviews: 112, experience: 8, jobs: 310,
      skills: ["Full House Cleaning","Cooking","Baby Sitting","Grocery Help","Laundry"],
      bio: "Multi-skilled domestic worker who combines household cleaning with home cooking. Gentle with children and elderly. Trusted by several long-term families across Chennai.",
      ratingReviews: [
        { stars: 5, text: "Kamala has been amazing with our baby and keeps the house spotless. Can't recommend enough!", author: "Rekha S., Chennai" },
        { stars: 5, text: "Honest, hard-working and genuinely cares. A real gem of a person.", author: "Kiran T., Chennai" }
      ]
    },
    {
      id: 12, name: "Durai Murugan", role: "Professional Driver", icon: "🚗",
      category: "Driver", location: "Trichy", availability: "available",
      rating: 4.6, reviews: 74, experience: 6, jobs: 198,
      skills: ["City Driving","Outstation","Night Driving","Bike Delivery"],
      bio: "Dependable driver covering both local city trips and outstation journeys. Familiar with all major roads across central Tamil Nadu. Available on short notice.",
      ratingReviews: [
        { stars: 5, text: "Drove us to Rameswaram and back safely. Very helpful throughout the trip.", author: "Srinivasan P., Trichy" },
        { stars: 4, text: "Good driver, knows the local routes well. Affordable daily rates.", author: "Jaya K., Trichy" }
      ]
    }
  ];

    //  STATE
  let currentSort   = 'rating';
  let currentView   = 'grid';
  let activeWorker  = null;
  let filteredData  = [...WORKERS];

  /* ════════════════════════════════════════
     INIT
  ════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', () => {
    // Pre-fill from landing page search
    const savedJob  = sessionStorage.getItem('requestedJob');
    const savedLoc  = sessionStorage.getItem('requestedLocation');
    if (savedJob) {
      const cat = document.getElementById('searchCategory');
      const opt = [...cat.options].find(o => o.value.toLowerCase() === savedJob.toLowerCase());
      if (opt) cat.value = opt.value;
    }
    if (savedLoc) document.getElementById('searchLocation').value = savedLoc;

    updateRangeStyle(document.getElementById('expRange'));
    applyFilters();
    renderCards();
  });

  /* ════════════════════════════════════════
     RANGE SLIDER STYLE
  ════════════════════════════════════════ */
  function updateRangeStyle(el) {
    const pct = (el.value - el.min) / (el.max - el.min) * 100;
    el.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, #e8dcc8 ${pct}%, #e8dcc8 100%)`;
  }

  /* ════════════════════════════════════════
     SEARCH (hero bar)
  ════════════════════════════════════════ */
  function applySearch() {
    applyFilters();
  }

  /* ════════════════════════════════════════
     FILTERS
  ════════════════════════════════════════ */
  function applyFilters() {
    const searchCat  = document.getElementById('searchCategory').value.toLowerCase();
    const searchLoc  = document.getElementById('searchLocation').value.trim().toLowerCase();

    // Sidebar checkboxes
    const catChecked  = [...document.querySelectorAll('#categoryFilters input:checked')].map(i => i.value);
    const availChecked = [...document.querySelectorAll('#sidebar input[type="checkbox"][id^="avail"]:checked')].map(i => i.value);
    const minRating   = parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0);
    const minExp      = parseInt(document.getElementById('expRange').value);

    filteredData = WORKERS.filter(w => {
      if (searchCat && !w.category.toLowerCase().includes(searchCat)) return false;
      if (searchLoc && !w.location.toLowerCase().includes(searchLoc)) return false;
      if (catChecked.length && !catChecked.includes(w.category)) return false;
      if (availChecked.length && !availChecked.includes(w.availability)) return false;
      if (w.rating < minRating) return false;
      if (w.experience < minExp) return false;
      return true;
    });

    sortData();
    renderCards();
    updateResultMeta(searchCat, searchLoc, catChecked, availChecked, minRating, minExp);
  }

  /* ════════════════════════════════════════
     SORT
  ════════════════════════════════════════ */
  function sortData() {
    filteredData.sort((a, b) => {
      if (currentSort === 'rating')     return b.rating - a.rating;
      if (currentSort === 'experience') return b.experience - a.experience;
      if (currentSort === 'jobs')       return b.jobs - a.jobs;
      if (currentSort === 'name')       return a.name.localeCompare(b.name);
      return 0;
    });
  }

  function setSort(btn) {
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSort = btn.dataset.sort;
    sortData();
    renderCards();
  }

  /* ════════════════════════════════════════
     VIEW TOGGLE
  ════════════════════════════════════════ */
  function setView(view) {
    currentView = view;
    const grid = document.getElementById('workersGrid');
    grid.classList.toggle('list-view', view === 'list');
    document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
    document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
    renderCards();
  }

  /* ════════════════════════════════════════
     RENDER CARDS
  ════════════════════════════════════════ */
  function renderCards() {
    const grid = document.getElementById('workersGrid');

    if (!filteredData.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No workers found</h3>
          <p>Try adjusting your filters or search in a different area.</p>
        </div>`;
      return;
    }

    const isListView = currentView === 'list';

    grid.innerHTML = filteredData.map((w, i) => {
      const availLabel = { available: 'Available', busy: 'Busy', offline: 'Offline' }[w.availability];
      const stars = '★'.repeat(Math.floor(w.rating)) + (w.rating % 1 >= .5 ? '½' : '');

      if (isListView) {
        return `
        <div class="worker-card" style="animation-delay:${i * 0.04}s" onclick="openModal(${w.id})">
          <div class="card-body">
            <div class="card-top">
              <div class="card-avatar">
                ${w.icon}
                <div class="avatar-status ${w.availability}"></div>
              </div>
            </div>
            <div class="card-info-block" style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
                <span class="card-name">${w.name}</span>
                <span class="card-badge ${w.availability}">
                  <span class="badge-dot"></span>${availLabel}
                </span>
              </div>
              <div class="card-role" style="margin-bottom:6px">${w.role} · ${w.location}</div>
              <div class="card-skills">
                ${w.skills.slice(0,3).map(s => `<span class="skill-tag">${s}</span>`).join('')}
              </div>
            </div>
            <div class="card-footer" style="flex-shrink:0;flex-direction:column;align-items:flex-end;gap:8px">
              <div class="card-rating">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ${w.rating} <span>(${w.reviews})</span>
              </div>
              <button class="btn-hire" onclick="event.stopPropagation();hireDirect(${w.id})">
                Hire
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>`;
      }

      return `
      <div class="worker-card" style="animation-delay:${i * 0.06}s" onclick="openModal(${w.id})">
        <div class="card-body">
          <div class="card-top">
            <div class="card-avatar">
              ${w.icon}
              <div class="avatar-status ${w.availability}"></div>
            </div>
            <div class="card-info">
              <div class="card-name">${w.name}</div>
              <div class="card-role">${w.role}</div>
              <div class="card-rating">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ${w.rating} <span>(${w.reviews} reviews)</span>
              </div>
            </div>
            <div class="card-badge ${w.availability}">
              <span class="badge-dot"></span>${availLabel}
            </div>
          </div>

          <div class="card-skills">
            ${w.skills.slice(0,3).map(s => `<span class="skill-tag">${s}</span>`).join('')}
            ${w.skills.length > 3 ? `<span class="skill-tag">+${w.skills.length - 3}</span>` : ''}
          </div>

          <div class="card-stats">
            <div class="card-stat">
              <div class="stat-val">${w.experience}</div>
              <div class="stat-key">Yrs Exp</div>
            </div>
            <div class="card-stat">
              <div class="stat-val">${w.jobs}</div>
              <div class="stat-key">Jobs Done</div>
            </div>
            <div class="card-stat">
              <div class="stat-val">${w.reviews}</div>
              <div class="stat-key">Reviews</div>
            </div>
          </div>

          <div class="card-footer">
            <span class="card-loc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              ${w.location}
            </span>
            <button class="btn-hire" onclick="event.stopPropagation();hireDirect(${w.id})">
              Hire
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  /* ════════════════════════════════════════
     RESULT META & TAGS
  ════════════════════════════════════════ */
  function updateResultMeta(searchCat, searchLoc, catChecked, availChecked, minRating, minExp) {
    document.getElementById('resultCount').innerHTML =
      `Showing <strong>${filteredData.length}</strong> worker${filteredData.length !== 1 ? 's' : ''}`;

    const tags = [];
    if (searchCat) tags.push({ label: searchCat, key: 'searchCat' });
    if (searchLoc) tags.push({ label: searchLoc, key: 'searchLoc' });
    catChecked.forEach(c  => tags.push({ label: c, key: 'cat_' + c }));
    availChecked.forEach(a => tags.push({ label: a, key: 'avail_' + a }));
    if (minRating > 0)  tags.push({ label: `${minRating}★+`, key: 'rating' });
    if (minExp > 0)     tags.push({ label: `${minExp}+ yrs`, key: 'exp' });

    document.getElementById('activeTags').innerHTML = tags.map(t => `
      <span class="filter-tag" onclick="removeTag('${t.key}')">
        ${t.label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </span>`).join('');
  }

  function removeTag(key) {
    if (key === 'searchCat') document.getElementById('searchCategory').value = '';
    else if (key === 'searchLoc') document.getElementById('searchLocation').value = '';
    else if (key === 'rating') { document.querySelector('input[name="rating"][value="0"]').checked = true; updateStarFilter(); }
    else if (key === 'exp') { const r = document.getElementById('expRange'); r.value = 0; document.getElementById('expLabel').textContent = '0 yrs'; updateRangeStyle(r); }
    else if (key.startsWith('cat_')) {
      const val = key.replace('cat_','');
      const cb = [...document.querySelectorAll('#categoryFilters input')].find(i => i.value === val);
      if (cb) cb.checked = false;
    } else if (key.startsWith('avail_')) {
      const val = key.replace('avail_','');
      const cb = document.getElementById('avail-' + val);
      if (cb) cb.checked = false;
    }
    applyFilters();
  }

  function updateStarFilter() {
    document.querySelectorAll('.star-row').forEach(r => {
      r.classList.toggle('selected', r.querySelector('input').checked);
    });
  }

  document.querySelectorAll('.star-row').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('.star-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
    });
  });

  /* ════════════════════════════════════════
     CLEAR FILTERS
  ════════════════════════════════════════ */
  function clearAllFilters() {
    document.getElementById('searchCategory').value = '';
    document.getElementById('searchLocation').value = '';
    document.querySelectorAll('#sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelector('input[name="rating"][value="0"]').checked = true;
    document.querySelectorAll('.star-row').forEach(r => r.classList.remove('selected'));
    document.querySelector('.star-row[data-val="0"]').classList.add('selected');
    const range = document.getElementById('expRange');
    range.value = 0;
    document.getElementById('expLabel').textContent = '0 yrs';
    updateRangeStyle(range);
    applyFilters();
  }

  /* ════════════════════════════════════════
     MODAL
  ════════════════════════════════════════ */
  function openModal(id) {
    const w = WORKERS.find(x => x.id === id);
    if (!w) return;
    activeWorker = w;

    document.getElementById('mAvatar').textContent = w.icon;
    document.getElementById('mName').textContent   = w.name;
    document.getElementById('mRole').textContent   = w.role;

    const availLabel = { available: 'Available Now', busy: 'Currently Busy', offline: 'Offline' }[w.availability];
    const availColor = { available: '#6b8f6e', busy: '#c9943a', offline: '#8a7a63' }[w.availability];
    document.getElementById('mMeta').innerHTML = `
      <span class="modal-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>${w.location}
      </span>
      <span class="modal-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>${w.rating} (${w.reviews} reviews)
      </span>
      <span class="modal-meta-item" style="color:${availColor}">
        ● ${availLabel}
      </span>`;

    document.getElementById('mStats').innerHTML = `
      <div class="modal-stat-card">
        <div class="modal-stat-val">${w.experience}</div>
        <div class="modal-stat-key">Years Exp.</div>
      </div>
      <div class="modal-stat-card">
        <div class="modal-stat-val">${w.jobs}</div>
        <div class="modal-stat-key">Jobs Done</div>
      </div>
      <div class="modal-stat-card">
        <div class="modal-stat-val">${w.rating}</div>
        <div class="modal-stat-key">Avg Rating</div>
      </div>`;

    document.getElementById('mSkills').innerHTML =
      w.skills.map(s => `<span class="modal-skill-tag">${s}</span>`).join('');

    document.getElementById('mBio').textContent = w.bio;

    document.getElementById('mReviews').innerHTML = w.ratingReviews.map(r => `
      <div class="review-item">
        <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        <div class="review-text">"${r.text}"</div>
        <div class="review-author">— ${r.author}</div>
      </div>`).join('');

    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
  }

  function closeModalDirect() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModalDirect();
  });

  /* ════════════════════════════════════════
     HIRE
  ════════════════════════════════════════ */
  function hireDirect(id) {
    const w = WORKERS.find(x => x.id === id);
    showToast(`Redirecting to hire ${w.name}…`);
    setTimeout(() => window.location.href = 'login.html', 1200);
  }

  function hirePerson() {
    if (!activeWorker) return;
    showToast(`Redirecting to hire ${activeWorker.name}…`);
    setTimeout(() => window.location.href = 'login.html', 1200);
  }

  /* ════════════════════════════════════════
     TOAST
  ════════════════════════════════════════ */
  function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }