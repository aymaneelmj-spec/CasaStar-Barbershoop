(function () {
  'use strict';

  // ── AUDIO: play once on tab load ──────────────────────────
  (function initAudio() {
    var audio = document.getElementById('casastarAudio');
    if (!audio) return;
    // Browsers block autoplay without user interaction; we try on load,
    // then fall back to first user gesture (touch/click) — plays only 1 time.
    var played = false;
    function playOnce() {
      if (played) return;
      played = true;
      audio.volume = 0.55;
      audio.play().catch(function() { played = false; }); // allow retry if blocked
    }
    window.addEventListener('load', function() {
      // short delay so it doesn't clash with loader animation
      setTimeout(playOnce, 800);
    });
    // Fallback: first user interaction unlocks autoplay on mobile
    ['touchstart','click','keydown'].forEach(function(evt) {
      document.addEventListener(evt, playOnce, { once: true, passive: true });
    });
  })();

  // ── MOBILE FLYING SCISSORS (continuous, JS-driven) ────────
  (function mobileScissors() {
    var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 900;
    if (!isMobile) return; // desktop already has CSS animation on loader

    var loader = document.getElementById('loader');
    if (!loader) return;

    var SCISSOR_SVG = function(color, size) {
      return '<svg viewBox="0 0 120 120" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:fixed;pointer-events:none;z-index:9998;will-change:transform,opacity;filter:drop-shadow(0 0 10px ' + color + '88);">' +
        '<g><circle cx="35" cy="35" r="12" fill="none" stroke="' + color + '" stroke-width="4"/>' +
        '<line x1="43" y1="43" x2="90" y2="90" stroke="' + color + '" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="47" y1="38" x2="95" y2="75" stroke="' + color + '" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="85" cy="35" r="12" fill="none" stroke="' + color + '" stroke-width="4"/>' +
        '<line x1="77" y1="43" x2="30" y2="90" stroke="' + color + '" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="73" y1="38" x2="25" y2="75" stroke="' + color + '" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="60" cy="60" r="5" fill="' + color + '"/></g></svg>';
    };

    var colors = ['#C9A84C','#E8C96A','#F5D376','#C9A84C','#8B6914','#E8C96A'];
    var sizes  = [44, 36, 52, 40, 34, 48];

    function launchScissor(index) {
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;z-index:9998;';
      wrap.innerHTML = SCISSOR_SVG(colors[index % colors.length], sizes[index % sizes.length]);
      document.body.appendChild(wrap);

      var el = wrap.querySelector('svg');
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      // Random start from one of 4 sides
      var side = Math.floor(Math.random() * 4);
      var startX, startY, endX, endY;
      if (side === 0) { startX = Math.random() * vw; startY = -60; }
      else if (side === 1) { startX = vw + 60; startY = Math.random() * vh; }
      else if (side === 2) { startX = Math.random() * vw; startY = vh + 60; }
      else { startX = -60; startY = Math.random() * vh; }

      // Head toward center ± randomness
      endX = vw * 0.3 + Math.random() * vw * 0.4;
      endY = vh * 0.2 + Math.random() * vh * 0.6;

      var rotate = Math.random() * 360;
      var dur = 900 + Math.random() * 600; // ms in flight

      el.style.top = startY + 'px';
      el.style.left = startX + 'px';
      el.style.opacity = '0';
      el.style.transform = 'rotate(' + rotate + 'deg) scale(0.3)';
      el.style.transition = 'none';

      // Trigger animation via rAF
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          el.style.transition =
            'top ' + dur + 'ms cubic-bezier(0.16,1,0.3,1),' +
            'left ' + dur + 'ms cubic-bezier(0.16,1,0.3,1),' +
            'opacity 300ms ease,' +
            'transform ' + dur + 'ms cubic-bezier(0.16,1,0.3,1)';
          el.style.top = endY + 'px';
          el.style.left = endX + 'px';
          el.style.opacity = '1';
          el.style.transform = 'rotate(' + (rotate + 180) + 'deg) scale(1)';

          // Fade out before removing
          setTimeout(function() {
            el.style.opacity = '0';
            el.style.transform = 'rotate(' + (rotate + 300) + 'deg) scale(0.2)';
            setTimeout(function() { if(wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 400);
          }, dur - 200);
        });
      });
    }

    // Staggered launch: fire 6 scissors with slight delays, then repeat while loader visible
    var loaderHidden = false;
    var scissorTimer;

    function scheduleBatch() {
      if (loaderHidden) return;
      for (var i = 0; i < 6; i++) {
        (function(idx) {
          setTimeout(function() {
            if (!loaderHidden) launchScissor(idx);
          }, idx * 160);
        })(i);
      }
      scissorTimer = setTimeout(scheduleBatch, 1800);
    }

    // Watch for loader hiding
    var loaderEl = document.getElementById('loader');
    if (loaderEl) {
      var obs = new MutationObserver(function() {
        if (loaderEl.classList.contains('hidden')) {
          loaderHidden = true;
          clearTimeout(scissorTimer);
          obs.disconnect();
        }
      });
      obs.observe(loaderEl, { attributes: true, attributeFilter: ['class'] });
    }

    scheduleBatch();
  })();

  // ───────────────────────────────────────────────────────────
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
    const footerBtn = document.getElementById('footerContactLink');
    if (floatBtn) floatBtn.setAttribute('href', url);
    if (contactBtn) contactBtn.setAttribute('href', url);
    if (footerBtn) footerBtn.setAttribute('href', url);
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
        'تم! اختر طريقة الدفع لإتمام حجزك...',
        'Done! Choose a payment method to complete your booking...'
      );

      await delay(700);
      closeChat();
      openPaymentModal();
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

  // ============================================================
  // PAYMENT MODAL
  // ============================================================
  // 🔧 IBAN CONFIG — replace the value below when you receive the IBAN
  var OWNER_IBAN = 'SA00 0000 0000 0000 0000 0000'; // <-- REPLACE WITH REAL IBAN

  var paymentOverlay = document.getElementById('paymentOverlay');
  var paymentClose  = document.getElementById('paymentClose');
  var payStep1      = document.getElementById('payStep1');
  var payStepBank   = document.getElementById('payStepBank');
  var payStepDigital= document.getElementById('payStepDigital');
  var payStepCash   = document.getElementById('payStepCash');
  var payStepSuccess= document.getElementById('payStepSuccess');
  var selectedPayMethod = null;

  function openPaymentModal() {
    if (!paymentOverlay) return;
    // Reset to step 1
    [payStep1, payStepBank, payStepDigital, payStepCash, payStepSuccess].forEach(function(s){ if(s) s.style.display='none'; });
    if(payStep1) payStep1.style.display='block';
    selectedPayMethod = null;
    document.querySelectorAll('.pay-method-btn').forEach(function(b){ b.classList.remove('selected'); });
    if(document.getElementById('payRequiredHint')) document.getElementById('payRequiredHint').style.display='none';

    // Fill summary
    var svcName = selectedService ? (currentLang === 'ar' ? selectedService.ar : selectedService.en) : selectedServiceName;
    var price   = selectedServicePrice || '—';
    var dateTime = (selectedDate && selectedTime) ? (selectedDate + ' — ' + selectedTime) : '—';

    setText('summaryService', svcName);
    setText('summaryName', selectedClientName || '—');
    setText('summaryDateTime', dateTime);
    setAmountText('summaryAmount', price);
    setAmountText('bankAmount', price);
    setAmountText('cashAmount', price);
    setText('cashService', svcName);
    setText('cashName', selectedClientName || '—');
    if(document.getElementById('ibanValue')) document.getElementById('ibanValue').textContent = OWNER_IBAN;
    setAmountText('digitalAmount', price);

    paymentOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePaymentModal() {
    if(!paymentOverlay) return;
    paymentOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if(el) el.textContent = val;
  }

  function setAmountText(id, price) {
    var el = document.getElementById(id);
    if(!el) return;
    var sarLabel = currentLang === 'ar' ? 'ريال' : 'SAR';
    el.innerHTML = '<span style="font-size:1.4em;color:var(--gold-light);">' + price + '</span> <span style="font-size:0.8em;opacity:0.7;">' + sarLabel + '</span>';
  }

  if(paymentClose) paymentClose.addEventListener('click', closePaymentModal);
  if(paymentOverlay) paymentOverlay.addEventListener('click', function(e){ if(e.target===paymentOverlay) closePaymentModal(); });

  // Method selection
  document.querySelectorAll('.pay-method-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.pay-method-btn').forEach(function(b){ b.classList.remove('selected'); });
      btn.classList.add('selected');
      selectedPayMethod = btn.getAttribute('data-method');
      if(document.getElementById('payRequiredHint')) document.getElementById('payRequiredHint').style.display='none';
    });
  });

  // Proceed button
  var payProceedBtn = document.getElementById('payProceedBtn');
  if(payProceedBtn) payProceedBtn.addEventListener('click', function() {
    if(!selectedPayMethod) {
      var hint = document.getElementById('payRequiredHint');
      if(hint) { hint.style.display='block'; hint.style.animation='none'; void hint.offsetWidth; hint.style.animation=''; }
      return;
    }
    payStep1.style.display = 'none';
    if(selectedPayMethod === 'bank') {
      if(document.getElementById('ibanValue')) document.getElementById('ibanValue').textContent = OWNER_IBAN;
      payStepBank.style.display = 'block';
    } else if(selectedPayMethod === 'cash') {
      payStepCash.style.display = 'block';
    } else {
      var icon  = document.getElementById('digitalMethodIcon');
      var title = document.getElementById('digitalMethodTitle');
      var sub   = document.getElementById('digitalMethodSub');
      var step1 = document.getElementById('digitalStep1Ar');
      if(selectedPayMethod === 'stc') {
        if(icon)  icon.textContent  = '📱';
        if(title) title.textContent = 'STC Pay';
        if(sub)   { sub.setAttribute('data-ar','تحويل سريع عبر STC Pay'); sub.setAttribute('data-en','Fast transfer via STC Pay'); sub.textContent = currentLang==='ar'?'تحويل سريع عبر STC Pay':'Fast transfer via STC Pay'; }
        if(step1) step1.textContent = currentLang==='ar'?'افتح تطبيق STC Pay على جوالك':'Open the STC Pay app on your phone';
      }
      if(selectedPayMethod === 'mada') {
        if(icon)  icon.textContent  = '💳';
        if(title) title.textContent = 'مدى / Mada';
        if(sub)   { sub.setAttribute('data-ar','دفع مباشر عبر بطاقة مدى'); sub.setAttribute('data-en','Pay via Mada debit card'); sub.textContent = currentLang==='ar'?'دفع مباشر عبر بطاقة مدى':'Pay via Mada debit card'; }
        if(step1) step1.textContent = currentLang==='ar'?'افتح تطبيق مصرفك وادخل خدمة التحويل':'Open your bank app and go to Transfer';
      }
      payStepDigital.style.display = 'block';
    }
  });

  // Back buttons
  ['payBackBank','payBackDigital','payBackCash'].forEach(function(id) {
    var el = document.getElementById(id);
    if(el) el.addEventListener('click', function() {
      [payStepBank, payStepDigital, payStepCash].forEach(function(s){ if(s) s.style.display='none'; });
      payStep1.style.display = 'block';
    });
  });

  // Copy IBAN
  var copyIbanBtn = document.getElementById('copyIban');
  if(copyIbanBtn) copyIbanBtn.addEventListener('click', function() {
    var ibanEl = document.getElementById('ibanValue');
    if(!ibanEl) return;
    var ibanText = ibanEl.textContent.replace(/\s/g,'');
    if(navigator.clipboard) {
      navigator.clipboard.writeText(ibanText).then(function() {
        copyIbanBtn.innerHTML = '✅';
        setTimeout(function() {
          copyIbanBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        }, 2000);
      });
    }
  });

  // Copy mobile number (STC/Mada)
  var copyMobileBtn = document.getElementById('copyMobile');
  if(copyMobileBtn) copyMobileBtn.addEventListener('click', function() {
    var num = '+966549785075';
    if(navigator.clipboard) {
      navigator.clipboard.writeText(num).then(function() {
        copyMobileBtn.innerHTML = '✅';
        setTimeout(function() {
          copyMobileBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        }, 2000);
      });
    }
  });

  // WhatsApp send for bank transfer
  var bankWaBtn = document.getElementById('bankWhatsappBtn');
  if(bankWaBtn) bankWaBtn.addEventListener('click', function() {
    sendPaymentWhatsapp('bank');
  });

  // WhatsApp send for digital (placeholder)
  var digitalWaBtn = document.getElementById('digitalWhatsappBtn');
  if(digitalWaBtn) digitalWaBtn.addEventListener('click', function() {
    sendPaymentWhatsapp('digital');
  });

  // Confirm cash
  var cashConfirmBtn = document.getElementById('cashConfirmBtn');
  if(cashConfirmBtn) cashConfirmBtn.addEventListener('click', function() {
    sendPaymentWhatsapp('cash');
  });

  // Done button
  var payDoneBtn = document.getElementById('payDoneBtn');
  if(payDoneBtn) payDoneBtn.addEventListener('click', closePaymentModal);

  function buildPaymentWhatsappMsg(method) {
    var svcAr   = selectedService ? selectedService.ar : selectedServiceName;
    var svcEn   = selectedService ? selectedService.en : selectedServiceName;
    var price   = selectedServicePrice || '—';
    var name    = selectedClientName || '—';
    var dt      = (selectedDate && selectedTime) ? (selectedDate + ' — ' + selectedTime) : '—';
    var methodKey = selectedPayMethod || method;

    if(currentLang === 'ar') {
      var methodLabel = methodKey === 'bank' ? '🏦 تحويل بنكي — البنك الأهلي' :
                        methodKey === 'cash' ? '💵 نقداً عند الوصول' :
                        methodKey === 'stc'  ? '📱 STC Pay' :
                        methodKey === 'mada' ? '💳 مدى / Mada' : '💳 بطاقة';
      var receiptLine = (methodKey === 'bank' || methodKey === 'stc' || methodKey === 'mada')
        ? '📎 سيتم إرفاق صورة الإيصال\n'
        : '🙏 أرجو تأكيد الحجز، شكراً لكم\n';
      return '✨ *كازا ستار للإسترخاء* 💈\n' +
        '_تأكيد حجز وإشعار دفع_\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        '👤 *الاسم:* ' + name + '\n' +
        '✂ *الخدمة:* ' + svcAr + '\n' +
        '💰 *المبلغ:* ' + price + ' ريال\n' +
        '📅 *الموعد:* ' + dt + '\n' +
        '💳 *طريقة الدفع:* ' + methodLabel + '\n' +
        (methodKey === 'bank' ? '🔢 *IBAN المُحوَّل إليه:* ' + OWNER_IBAN + '\n' : '') +
        (methodKey === 'stc' || methodKey === 'mada' ? '📱 *رقم التحويل:* +966549785075\n' : '') +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        receiptLine;
    } else {
      var mLabel = methodKey === 'bank' ? '🏦 Bank Transfer — Al Ahli' :
                   methodKey === 'cash' ? '💵 Cash on Arrival' :
                   methodKey === 'stc'  ? '📱 STC Pay' :
                   methodKey === 'mada' ? '💳 Mada Card' : '💳 Card';
      var rLine = (methodKey === 'bank' || methodKey === 'stc' || methodKey === 'mada')
        ? '📎 Receipt screenshot will be attached\n'
        : '🙏 Please confirm the appointment, thank you\n';
      return '✨ *Casastar Relaxation* 💈\n' +
        '_Booking & Payment Notification_\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        '👤 *Name:* ' + name + '\n' +
        '✂ *Service:* ' + svcEn + '\n' +
        '💰 *Amount:* ' + price + ' SAR\n' +
        '📅 *Appointment:* ' + dt + '\n' +
        '💳 *Payment Method:* ' + mLabel + '\n' +
        (methodKey === 'bank' ? '🔢 *IBAN Used:* ' + OWNER_IBAN + '\n' : '') +
        (methodKey === 'stc' || methodKey === 'mada' ? '📱 *Transfer Number:* +966549785075\n' : '') +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        rLine;
    }
  }

  function sendPaymentWhatsapp(method) {
    var msg = buildPaymentWhatsappMsg(method);
    var url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    setTimeout(function() { window.open(url, '_blank', 'noopener,noreferrer'); }, 300);
    [payStepBank, payStepDigital, payStepCash].forEach(function(s){ if(s) s.style.display='none'; });
    if(payStepSuccess) payStepSuccess.style.display = 'block';
  }

  // ============================================================
  // END PAYMENT MODAL
  // ============================================================


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