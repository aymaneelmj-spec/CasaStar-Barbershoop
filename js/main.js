(function () {
  'use strict';

  const PHONE = '966549785075';
  let currentLang = 'ar';
  let selectedService = null;
  let selectedServiceName = '';
  let selectedServicePrice = '';
  let selectedDate = '';
  let selectedTime = '';
  let selectedClientName = '';

  const chatFlow = {
    massage: {
      label: { ar: 'مساج واسترخاء', en: 'Massage & Relaxation' },
      services: [
        { ar: 'ساعة مساج', en: '1 Hour Massage', price: '120' },
        { ar: 'مساج 45 دقيقة', en: '45 Min Massage', price: '100' },
        { ar: 'مساج 30 دقيقة', en: '30 Min Massage', price: '70' }
      ]
    },
    hammam: {
      label: { ar: 'حمام مغربي', en: 'Moroccan Hammam' },
      services: [
        { ar: 'حمام مغربي ملكي', en: 'Royal Moroccan Hammam', price: '150' },
        { ar: 'حمام مغربي', en: 'Moroccan Hammam', price: '100' },
        { ar: 'حمام مغربي عادي', en: 'Regular Moroccan Hammam', price: '100' }
      ]
    },
    barber: {
      label: { ar: 'الحلاقة', en: 'Barber' },
      services: [
        { ar: 'حلاقة شعر', en: 'Haircut', price: '25' },
        { ar: 'حلاقة شعر VIP', en: 'VIP Haircut', price: '60' },
        { ar: 'حلاقة دقن', en: 'Beard Trim', price: '50' },
        { ar: 'حلاقة دقن VIP', en: 'VIP Beard Trim', price: '45' },
        { ar: 'شعر + دقن', en: 'Hair + Beard', price: '20' },
        { ar: 'غسيل شعر', en: 'Hair Wash', price: '30' },
        { ar: 'ستشوار', en: 'Blow Dry', price: '30' },
        { ar: 'حلاقة أطفال', en: "Kids Haircut", price: '15' }
      ]
    },
    care: {
      label: { ar: 'العناية والتجميل', en: 'Care & Beauty' },
      services: [
        { ar: 'تنظيف بشرة', en: 'Skin Cleansing', price: '99' },
        { ar: 'حمام زيت بالبخار', en: 'Steam Oil Bath', price: '250' },
        { ar: 'بروتين', en: 'Keratin Treatment', price: '550' },
        { ar: 'بديكير أرجل', en: 'Pedicure', price: '70' },
        { ar: 'بديكير أيادي', en: 'Manicure', price: '70' },
        { ar: 'تجهيز عرسان', en: 'Groom Package', price: '120' }
      ]
    }
  };

  function t(el, key) {
    if (!el) return;
    const val = currentLang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (val) el.textContent = val;
  }

  function applyLang() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', currentLang === 'en');

    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      const val = currentLang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (val) el.textContent = val;
    });

    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = currentLang === 'ar' ? 'EN' : 'ع';
  }

  function setWhatsappGreeting() {
    const greetAr = '✨ مرحباً *كازا ستار للإسترخاء* 💈\nأرغب في حجز موعد:\n- *الخدمة المطلوبة:* \n- *الوقت المفضل:* \n- *الاسم:* ';
    const greetEn = "✨ Hello *Casastar Relaxation* 💈\nI'd like to book an appointment:\n- *Service wanted:* \n- *Preferred time:* \n- *Name:* ";
    const greeting = currentLang === 'ar' ? greetAr : greetEn;
    const url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(greeting);

    const floatBtn = document.getElementById('whatsappFloat');
    const contactBtn = document.getElementById('whatsappContactLink');
    if (floatBtn) floatBtn.setAttribute('href', url);
    if (contactBtn) contactBtn.setAttribute('href', url);
  }

  document.getElementById('langToggle').addEventListener('click', function () {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLang();
    setWhatsappGreeting();
  });

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  window.addEventListener('load', function () {
    setTimeout(function () {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
  });

  document.body.style.overflow = 'hidden';

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-section').forEach(function (el) {
    revealObserver.observe(el);
  });

  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const content = document.getElementById('tab-' + tab);
      if (content) content.classList.add('active');
    });
  });

  const overlay = document.getElementById('bookingOverlay');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');

  function openChat() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeChat() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('openChatBtn').addEventListener('click', function () {
    resetChatToCategories();
    openChat();
  });
  document.getElementById('bookNowNav').addEventListener('click', function (e) {
    e.preventDefault();
    resetChatToCategories();
    openChat();
  });
  const bookNowMobile = document.getElementById('bookNowMobile');
  if (bookNowMobile) {
    bookNowMobile.addEventListener('click', function (e) {
      e.preventDefault();
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      resetChatToCategories();
      openChat();
    });
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeChat();
  });

  chatClose.addEventListener('click', closeChat);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeChat();
  });

  function addBotMsg(textAr, textEn) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    const p = document.createElement('p');
    p.textContent = currentLang === 'ar' ? textAr : textEn;
    msg.appendChild(p);
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    return msg;
  }

  function addUserMsg(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg user';
    const p = document.createElement('p');
    p.textContent = text;
    msg.appendChild(p);
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
    return typing;
  }

  function addOptions(options) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-options';
    options.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.className = 'chat-opt';
      btn.textContent = opt.label;
      btn.addEventListener('click', function () {
        opt.action(opt.label);
        wrap.querySelectorAll('.chat-opt').forEach(b => {
          b.disabled = true;
          b.style.opacity = '0.4';
          b.style.pointerEvents = 'none';
        });
        btn.style.opacity = '1';
        btn.style.borderColor = 'var(--gold)';
        btn.style.color = 'var(--gold)';
      });
      wrap.appendChild(btn);
    });
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function delay(ms) {
    return new Promise(function (res) { setTimeout(res, ms); });
  }

  chatBody.addEventListener('click', async function (e) {
    const btn = e.target.closest('.chat-opt[data-step="category"]');
    if (!btn) return;

    const category = btn.getAttribute('data-value');
    const label = currentLang === 'ar' ? btn.getAttribute('data-ar') : btn.getAttribute('data-en');

    btn.closest('.chat-options').querySelectorAll('.chat-opt').forEach(b => {
      b.disabled = true;
      b.style.opacity = '0.4';
      b.style.pointerEvents = 'none';
    });
    btn.style.opacity = '1';
    btn.style.borderColor = 'var(--gold)';
    btn.style.color = 'var(--gold)';

    addUserMsg(label);

    const typing = addTyping();
    await delay(900);
    typing.remove();

    const data = chatFlow[category];
    if (!data) return;

    addBotMsg(
      'ممتاز! اختر الخدمة المطلوبة:',
      'Great! Choose your service:'
    );

    addOptions(data.services.map(function (svc) {
      return {
        label: currentLang === 'ar' ? svc.ar : svc.en,
        action: async function (lbl) {
          selectedService = svc;
          selectedServiceName = currentLang === 'ar' ? svc.ar : svc.en;
          selectedServicePrice = svc.price;

          addUserMsg(lbl);

          const t2 = addTyping();
          await delay(800);
          t2.remove();

          addBotMsg(
            'رائع! ما هو اسمك الكريم؟',
            'Great! What is your name?'
          );

          await delay(300);
          addNameInput();
        }
      };
    }));
  });

  function addNameInput() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:0.5rem;margin-top:0.3rem;';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = currentLang === 'ar' ? 'اكتب اسمك...' : 'Your name...';
    input.style.cssText = 'flex:1;padding:0.5rem 0.8rem;background:var(--card);border:1.5px solid var(--border);border-radius:100px;color:var(--cream);font-family:inherit;font-size:0.85rem;outline:none;transition:border-color 0.3s;';
    input.addEventListener('focus', () => input.style.borderColor = 'var(--gold)');
    input.addEventListener('blur', () => input.style.borderColor = 'var(--border)');

    const send = document.createElement('button');
    send.textContent = currentLang === 'ar' ? 'إرسال' : 'Send';
    send.style.cssText = 'padding:0.5rem 1rem;background:var(--gold);color:var(--black);border-radius:100px;font-size:0.82rem;font-weight:800;font-family:inherit;border:none;cursor:pointer;';

    wrap.appendChild(input);
    wrap.appendChild(send);
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
    input.focus();

    async function submitName() {
      const name = input.value.trim();
      if (!name) { input.style.borderColor = 'red'; return; }

      wrap.remove();
      addUserMsg(name);
      selectedClientName = name;

      const t3 = addTyping();
      await delay(800);
      t3.remove();

      addBotMsg(
        'رائع ' + name + '! ما هو التاريخ والوقت المفضل لموعدك؟',
        'Great ' + name + '! What date and time would you prefer for your appointment?'
      );

      await delay(300);
      addDateTimeInput();
    }

    send.addEventListener('click', submitName);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitName();
    });
  }

  function addDateTimeInput() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:0.5rem;margin-top:0.3rem;';

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:0.5rem;';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    const today = new Date();
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.style.cssText = 'flex:1;padding:0.5rem 0.7rem;background:var(--card);border:1.5px solid var(--border);border-radius:100px;color:var(--cream);font-family:inherit;font-size:0.8rem;outline:none;transition:border-color 0.3s;color-scheme:dark;';
    dateInput.addEventListener('focus', () => dateInput.style.borderColor = 'var(--gold)');
    dateInput.addEventListener('blur', () => dateInput.style.borderColor = 'var(--border)');

    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.style.cssText = 'flex:1;padding:0.5rem 0.7rem;background:var(--card);border:1.5px solid var(--border);border-radius:100px;color:var(--cream);font-family:inherit;font-size:0.8rem;outline:none;transition:border-color 0.3s;color-scheme:dark;';
    timeInput.addEventListener('focus', () => timeInput.style.borderColor = 'var(--gold)');
    timeInput.addEventListener('blur', () => timeInput.style.borderColor = 'var(--border)');

    row.appendChild(dateInput);
    row.appendChild(timeInput);

    const send = document.createElement('button');
    send.textContent = currentLang === 'ar' ? 'تأكيد الحجز وإرسال إلى واتساب' : 'Confirm Booking & Send to WhatsApp';
    send.style.cssText = 'padding:0.6rem 1rem;background:var(--gold);color:var(--black);border-radius:100px;font-size:0.82rem;font-weight:800;font-family:inherit;border:none;cursor:pointer;';

    wrap.appendChild(row);
    wrap.appendChild(send);
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;

    async function submitDateTime() {
      const dateVal = dateInput.value;
      const timeVal = timeInput.value;

      if (!dateVal) { dateInput.style.borderColor = 'red'; return; }
      if (!timeVal) { timeInput.style.borderColor = 'red'; return; }

      const dateObj = new Date(dateVal + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const formattedTime = (function () {
        const [h, m] = timeVal.split(':');
        const hour = parseInt(h, 10);
        const period = currentLang === 'ar' ? (hour >= 12 ? 'مساءً' : 'صباحاً') : (hour >= 12 ? 'PM' : 'AM');
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return hour12 + ':' + m + ' ' + period;
      })();

      selectedDate = formattedDate;
      selectedTime = formattedTime;

      wrap.remove();
      addUserMsg(formattedDate + ' — ' + formattedTime);

      const t4 = addTyping();
      await delay(1000);
      t4.remove();

      addBotMsg(
        'تم! جاري إرسال طلب الحجز الكامل إلى واتساب...',
        'Done! Sending your complete booking request to WhatsApp...'
      );

      await delay(700);
      sendBookingToWhatsapp();
    }

    send.addEventListener('click', submitDateTime);
  }

  function sendBookingToWhatsapp() {
    const name = selectedClientName || '';

    let msgAr = '✨ *كازا ستار للإسترخاء* 💈\n';
    msgAr += '_طلب حجز موعد جديد_\n';
    msgAr += '----------------------\n';
    msgAr += '👤 *الاسم:* ' + name + '\n';
    msgAr += '✂ *الخدمة:* ' + (selectedService ? selectedService.ar : selectedServiceName) + '\n';
    msgAr += '💰 *السعر:* ' + selectedServicePrice + ' ريال سعودي\n';
    msgAr += '📅 *التاريخ:* ' + selectedDate + '\n';
    msgAr += '⏰ *الوقت:* ' + selectedTime + '\n';
    msgAr += '----------------------\n';
    msgAr += '🙏 أرجو تأكيد الموعد، شكراً لكم';

    let msgEn = '✨ *Casastar Relaxation* 💈\n';
    msgEn += '_New Booking Request_\n';
    msgEn += '----------------------\n';
    msgEn += '👤 *Name:* ' + name + '\n';
    msgEn += '✂ *Service:* ' + (selectedService ? selectedService.en : selectedServiceName) + '\n';
    msgEn += '💰 *Price:* ' + selectedServicePrice + ' SAR\n';
    msgEn += '📅 *Date:* ' + selectedDate + '\n';
    msgEn += '⏰ *Time:* ' + selectedTime + '\n';
    msgEn += '----------------------\n';
    msgEn += '🙏 Please confirm the appointment, thank you';

    const finalMsg = currentLang === 'ar' ? msgAr : msgEn;
    const encoded = encodeURIComponent(finalMsg);
    const waUrl = 'https://wa.me/' + PHONE + '?text=' + encoded;

    setTimeout(function () {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  }

  function startServiceBooking(serviceAr, serviceEn, price) {
    selectedService = { ar: serviceAr, en: serviceEn, price: price };
    selectedServiceName = currentLang === 'ar' ? serviceAr : serviceEn;
    selectedServicePrice = price;

    openChat();
    resetChat();
    setTimeout(async function () {
      addBotMsg(
        'مرحباً! لحجز خدمة: ' + serviceAr + ' (' + price + ' ريال). ما هو اسمك؟',
        'Hi! To book: ' + serviceEn + ' (' + price + ' SAR). What is your name?'
      );
      await new Promise(r => setTimeout(r, 300));
      addNameInput();
    }, 200);
  }

  document.querySelectorAll('.btn-book-service').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = btn.closest('.service-card');
      const serviceAr = card.getAttribute('data-service') || '';
      const serviceEn = card.getAttribute('data-en-name') || serviceAr;
      const price = card.getAttribute('data-price') || '';
      startServiceBooking(serviceAr, serviceEn, price);
    });
  });

  document.querySelectorAll('.price-row').forEach(function (row) {
    row.addEventListener('click', function () {
      const serviceAr = row.getAttribute('data-service') || '';
      const serviceEn = row.getAttribute('data-en-name') || serviceAr;
      const price = row.getAttribute('data-price') || '';
      startServiceBooking(serviceAr, serviceEn, price);
    });
  });

  function resetChat() {
    chatBody.innerHTML = '';
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    const p = document.createElement('p');
    p.textContent = currentLang === 'ar'
      ? 'مرحباً بك في كازا ستار للإسترخاء'
      : 'Welcome to Casastar Relaxation';
    msg.appendChild(p);
    chatBody.appendChild(msg);
  }

  function resetChatToCategories() {
    selectedService = null;
    selectedServiceName = '';
    selectedServicePrice = '';
    selectedDate = '';
    selectedTime = '';
    selectedClientName = '';
    chatBody.innerHTML = '';

    addBotMsg(
      'مرحباً بك في كازا ستار للإسترخاء 👋 اختر نوع الخدمة التي تود حجزها:',
      "Welcome to Casastar Relaxation 👋 Select the service type you'd like to book:"
    );

    const categories = [
      { value: 'massage', ar: '♨ مساج واسترخاء', en: '♨ Massage & Relaxation' },
      { value: 'hammam', ar: '🌿 حمام مغربي', en: '🌿 Moroccan Hammam' },
      { value: 'barber', ar: '✂ الحلاقة', en: '✂ Barber' },
      { value: 'care', ar: '✨ العناية والتجميل', en: '✨ Care & Beauty' }
    ];

    const wrap = document.createElement('div');
    wrap.className = 'chat-options';
    categories.forEach(function (cat) {
      const btn = document.createElement('button');
      btn.className = 'chat-opt';
      btn.setAttribute('data-step', 'category');
      btn.setAttribute('data-value', cat.value);
      btn.setAttribute('data-ar', cat.ar);
      btn.setAttribute('data-en', cat.en);
      btn.textContent = currentLang === 'ar' ? cat.ar : cat.en;
      wrap.appendChild(btn);
    });
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  const galleryGrid = document.getElementById('galleryGrid');
  const galleryLoadMore = document.getElementById('galleryLoadMore');
  const galleryLoadMoreWrap = document.getElementById('galleryLoadMoreWrap');

  if (galleryGrid && galleryLoadMore) {
    galleryLoadMore.addEventListener('click', function () {
      galleryGrid.querySelectorAll('.gallery-item[hidden]').forEach(function (item) {
        item.removeAttribute('hidden');
      });
      galleryLoadMoreWrap.style.display = 'none';
    });

    const galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
    let lightboxIndex = 0;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML =
      '<div class="lightbox-img-wrap">' +
      '<button class="lightbox-close" type="button" aria-label="Close">✕</button>' +
      '<button class="lightbox-nav prev" type="button" aria-label="Previous">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 4.5L8 12l7.5 7.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<button class="lightbox-nav next" type="button" aria-label="Next">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 4.5L16 12l-7.5 7.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<img src="" alt="">' +
      '</div>';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-nav.prev');
    const lightboxNext = lightbox.querySelector('.lightbox-nav.next');

    function showLightbox(index) {
      lightboxIndex = index;
      const item = galleryItems[lightboxIndex];
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function navLightbox(direction) {
      let next = lightboxIndex + direction;
      if (next < 0) next = galleryItems.length - 1;
      if (next >= galleryItems.length) next = 0;
      while (galleryItems[next].hasAttribute('hidden')) {
        next = next + direction;
        if (next < 0) next = galleryItems.length - 1;
        if (next >= galleryItems.length) next = 0;
      }
      showLightbox(next);
    }

    galleryItems.forEach(function (item, idx) {
      item.addEventListener('click', function () { showLightbox(idx); });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightboxPrev.addEventListener('click', function () { navLightbox(-1); });
    lightboxNext.addEventListener('click', function () { navLightbox(1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navLightbox(document.documentElement.dir === 'rtl' ? -1 : 1);
      if (e.key === 'ArrowLeft') navLightbox(document.documentElement.dir === 'rtl' ? 1 : -1);
    });
  }

  const reviewsTrack = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('reviewsDots');
  const reviewsPrevBtn = document.getElementById('reviewsPrev');
  const reviewsNextBtn = document.getElementById('reviewsNext');
  let cardCount = 0;

  if (reviewsTrack) {
    const cards = reviewsTrack.querySelectorAll('.review-card');
    cardCount = cards.length;

    cards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.style.cssText = 'width:8px;height:8px;border-radius:50%;border:none;background:' +
        (i === 0 ? 'var(--gold)' : 'var(--border)') + ';transition:background 0.3s,transform 0.3s;cursor:pointer;';
      dot.setAttribute('aria-label', 'Review ' + (i + 1));
      dot.addEventListener('click', function () {
        const cardW = cards[0].offsetWidth + 24;
        reviewsTrack.scrollTo({ left: i * cardW, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });

    reviewsTrack.addEventListener('scroll', function () {
      const cardW = cards[0].offsetWidth + 24;
      const idx = Math.round(Math.abs(reviewsTrack.scrollLeft) / cardW);
      dotsContainer.querySelectorAll('button').forEach(function (d, i) {
        d.style.background = i === idx ? 'var(--gold)' : 'var(--border)';
        d.style.transform = i === idx ? 'scale(1.3)' : 'scale(1)';
      });
    }, { passive: true });

    function scrollByOneCard(direction) {
      const cardW = cards[0].offsetWidth + 24;
      const isRtl = document.documentElement.dir === 'rtl';
      const amount = isRtl ? -direction * cardW : direction * cardW;
      reviewsTrack.scrollBy({ left: amount, behavior: 'smooth' });
    }

    if (reviewsNextBtn) {
      reviewsNextBtn.addEventListener('click', function () { scrollByOneCard(1); });
    }
    if (reviewsPrevBtn) {
      reviewsPrevBtn.addEventListener('click', function () { scrollByOneCard(-1); });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href === '#booking') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  applyLang();
  setWhatsappGreeting();

  (function devtoolsGuard() {
    const consoleStyle1 = 'color:#C9A84C;font-size:20px;font-weight:900;font-family:sans-serif;padding:6px 0;';
    const consoleStyle2 = 'color:#888;font-size:13px;font-family:sans-serif;';
    console.log('%c✨ Casastar Relaxation ✨', consoleStyle1);
    console.log('%cThis website was crafted with care by Ayman El Mjaber Developer ✨', consoleStyle2);
    console.log('%c🚫 This area is reserved for development purposes. Please go back to enjoying the site! 🚫', consoleStyle2);

    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    document.addEventListener('keydown', function (e) {
      const k = e.key;
      const blocked =
        k === 'F12' ||
        (e.ctrlKey && e.shiftKey && (k === 'I' || k === 'i' || k === 'J' || k === 'j' || k === 'C' || k === 'c')) ||
        (e.ctrlKey && (k === 'U' || k === 'u'));
      if (blocked) e.preventDefault();
    });
  })();
})();