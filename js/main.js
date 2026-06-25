(function () {
  'use strict';

  // ── AUDIO: play once on tab load ──────────────────────────
  (function initAudio() {
    var audio = document.getElementById('casastarAudio');
    if (!audio) return;
    var played = false;
    function playOnce() {
      if (played) return;
      played = true;
      audio.volume = 0.55;
      audio.play().catch(function() { played = false; });
    }
    window.addEventListener('load', function() {
      setTimeout(playOnce, 1000);
    });
    ['touchstart','click','keydown'].forEach(function(evt) {
      document.addEventListener(evt, playOnce, { once: true, passive: true });
    });
  })();

  // ── MOBILE FLYING SCISSORS ────────────────────────────────
  (function mobileScissors() {
    var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 900;
    if (!isMobile) return;

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
      var side = Math.floor(Math.random() * 4);
      var startX, startY, endX, endY;
      if (side === 0) { startX = Math.random() * vw; startY = -60; }
      else if (side === 1) { startX = vw + 60; startY = Math.random() * vh; }
      else if (side === 2) { startX = Math.random() * vw; startY = vh + 60; }
      else { startX = -60; startY = Math.random() * vh; }

      endX = vw * 0.3 + Math.random() * vw * 0.4;
      endY = vh * 0.2 + Math.random() * vh * 0.6;

      var rotate = Math.random() * 360;
      var dur = 900 + Math.random() * 600;

      el.style.top = startY + 'px';
      el.style.left = startX + 'px';
      el.style.opacity = '0';
      el.style.transform = 'rotate(' + rotate + 'deg) scale(0.3)';
      el.style.transition = 'none';

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

          setTimeout(function() {
            el.style.opacity = '0';
            el.style.transform = 'rotate(' + (rotate + 300) + 'deg) scale(0.2)';
            setTimeout(function() { if(wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 400);
          }, dur - 200);
        });
      });
    }

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
  var PHONE = '966549785075';
  var TIKTOK_USERNAME = 'casastar1';
  var TIKTOK_URL = 'https://www.tiktok.com/@' + TIKTOK_USERNAME;
  var currentLang = 'ar';
  // selectedPlatform is set by which float button the user clicks:
  // 'whatsapp' when clicking the green WA button
  // 'tiktok'   when clicking the black TT button
  var selectedPlatform = 'whatsapp';
  var selectedService = null;
  var selectedServiceName = '';
  var selectedServicePrice = '';
  var selectedDate = '';
  var selectedTime = '';
  var selectedClientName = '';

  var chatFlow = {
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
        { ar: 'حلاقة أطفال', en: 'Kids Haircut', price: '15' }
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

  function applyLang() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', currentLang === 'en');

    document.querySelectorAll('[data-ar][data-en]').forEach(function(el) {
      var val = currentLang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (val) el.textContent = val;
    });

    var btn = document.getElementById('langToggle');
    if (btn) btn.textContent = currentLang === 'ar' ? 'EN' : '\u0639';
  }

  document.getElementById('langToggle').addEventListener('click', function () {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLang();
  });

  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  window.addEventListener('load', function () {
    setTimeout(function () {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
  });

  document.body.style.overflow = 'hidden';

  var revealObserver = new IntersectionObserver(function (entries) {
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
      var tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
      var content = document.getElementById('tab-' + tab);
      if (content) content.classList.add('active');
    });
  });

  var overlay = document.getElementById('bookingOverlay');
  var chatClose = document.getElementById('chatClose');
  var chatBody = document.getElementById('chatBody');

  function openChat() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeChat() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── openBookingFlow: sets platform then opens chat ─────────
  // platform = 'whatsapp' | 'tiktok'
  function openBookingFlow(platform) {
    selectedPlatform = platform || 'whatsapp';
    setChatHeaderPlatform(selectedPlatform);
    resetChatToCategories();
    openChat();
  }

  // WhatsApp float → whatsapp flow
  var waFloat = document.getElementById('whatsappFloat');
  if (waFloat) waFloat.addEventListener('click', function(e) {
    e.preventDefault();
    openBookingFlow('whatsapp');
  });

  // TikTok float → tiktok flow
  var ttFloat = document.getElementById('tiktokFloat');
  if (ttFloat) ttFloat.addEventListener('click', function(e) {
    e.preventDefault();
    openBookingFlow('tiktok');
  });

  // Nav / hero "Book Now" → whatsapp by default (still shows category pick)
  document.getElementById('openChatBtn').addEventListener('click', function () {
    openBookingFlow('whatsapp');
  });
  document.getElementById('bookNowNav').addEventListener('click', function (e) {
    e.preventDefault();
    openBookingFlow('whatsapp');
  });
  var bookNowMobile = document.getElementById('bookNowMobile');
  if (bookNowMobile) {
    bookNowMobile.addEventListener('click', function (e) {
      e.preventDefault();
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      openBookingFlow('whatsapp');
    });
  }

  // Contact / footer buttons → whatsapp
  ['whatsappContactLink','footerContactLink','footerWaBtn'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function(e) {
      e.preventDefault();
      openBookingFlow('whatsapp');
    });
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeChat();
  });

  chatClose.addEventListener('click', closeChat);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeChat();
  });

  // ── Chat helpers ───────────────────────────────────────────
  function addBotMsg(textAr, textEn) {
    var msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    var p = document.createElement('p');
    p.textContent = currentLang === 'ar' ? textAr : textEn;
    msg.appendChild(p);
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    return msg;
  }

  function addUserMsg(text) {
    var msg = document.createElement('div');
    msg.className = 'chat-msg user';
    var p = document.createElement('p');
    p.textContent = text;
    msg.appendChild(p);
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addTyping() {
    var typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
    return typing;
  }

  function addOptions(options) {
    var wrap = document.createElement('div');
    wrap.className = 'chat-options';
    options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.className = 'chat-opt';
      btn.textContent = opt.label;
      btn.addEventListener('click', function () {
        opt.action(opt.label);
        wrap.querySelectorAll('.chat-opt').forEach(function(b) {
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

  // ── Category click handler ─────────────────────────────────
  chatBody.addEventListener('click', async function (e) {
    var btn = e.target.closest('.chat-opt[data-step="category"]');
    if (!btn) return;

    var category = btn.getAttribute('data-value');
    var label = currentLang === 'ar' ? btn.getAttribute('data-ar') : btn.getAttribute('data-en');

    btn.closest('.chat-options').querySelectorAll('.chat-opt').forEach(function(b) {
      b.disabled = true;
      b.style.opacity = '0.4';
      b.style.pointerEvents = 'none';
    });
    btn.style.opacity = '1';
    btn.style.borderColor = 'var(--gold)';
    btn.style.color = 'var(--gold)';

    addUserMsg(label);

    var typing = addTyping();
    await delay(900);
    typing.remove();

    var data = chatFlow[category];
    if (!data) return;

    addBotMsg('ممتاز! اختر الخدمة المطلوبة:', 'Great! Choose your service:');

    addOptions(data.services.map(function (svc) {
      return {
        label: currentLang === 'ar' ? svc.ar : svc.en,
        action: async function (lbl) {
          selectedService = svc;
          selectedServiceName = currentLang === 'ar' ? svc.ar : svc.en;
          selectedServicePrice = svc.price;

          addUserMsg(lbl);
          var t2 = addTyping();
          await delay(800);
          t2.remove();

          addBotMsg('رائع! ما هو اسمك الكريم؟', 'Great! What is your name?');
          await delay(300);
          addNameInput();
        }
      };
    }));
  });

  // ── Name input ─────────────────────────────────────────────
  function addNameInput() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:0.5rem;margin-top:0.3rem;';

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = currentLang === 'ar' ? 'اكتب اسمك...' : 'Your name...';
    input.style.cssText = 'flex:1;padding:0.5rem 0.8rem;background:var(--card);border:1.5px solid var(--border);border-radius:100px;color:var(--cream);font-family:inherit;font-size:0.85rem;outline:none;transition:border-color 0.3s;';
    input.addEventListener('focus', function() { input.style.borderColor = 'var(--gold)'; });
    input.addEventListener('blur', function() { input.style.borderColor = 'var(--border)'; });

    var send = document.createElement('button');
    send.textContent = currentLang === 'ar' ? 'إرسال' : 'Send';
    send.style.cssText = 'padding:0.5rem 1rem;background:var(--gold);color:var(--black);border-radius:100px;font-size:0.82rem;font-weight:800;font-family:inherit;border:none;cursor:pointer;';

    wrap.appendChild(input);
    wrap.appendChild(send);
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
    input.focus();

    async function submitName() {
      var name = input.value.trim();
      if (!name) { input.style.borderColor = 'red'; return; }

      wrap.remove();
      addUserMsg(name);
      selectedClientName = name;

      var t3 = addTyping();
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

  // ── Date / time input ──────────────────────────────────────
  function addDateTimeInput() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:0.5rem;margin-top:0.3rem;';

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:0.5rem;';

    var dateInput = document.createElement('input');
    dateInput.type = 'date';
    var today = new Date();
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.style.cssText = 'flex:1;padding:0.5rem 0.7rem;background:var(--card);border:1.5px solid var(--border);border-radius:100px;color:var(--cream);font-family:inherit;font-size:0.8rem;outline:none;transition:border-color 0.3s;color-scheme:dark;';
    dateInput.addEventListener('focus', function() { dateInput.style.borderColor = 'var(--gold)'; });
    dateInput.addEventListener('blur', function() { dateInput.style.borderColor = 'var(--border)'; });

    var timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.style.cssText = 'flex:1;padding:0.5rem 0.7rem;background:var(--card);border:1.5px solid var(--border);border-radius:100px;color:var(--cream);font-family:inherit;font-size:0.8rem;outline:none;transition:border-color 0.3s;color-scheme:dark;';
    timeInput.addEventListener('focus', function() { timeInput.style.borderColor = 'var(--gold)'; });
    timeInput.addEventListener('blur', function() { timeInput.style.borderColor = 'var(--border)'; });

    row.appendChild(dateInput);
    row.appendChild(timeInput);

    var send = document.createElement('button');
    send.textContent = currentLang === 'ar' ? 'تأكيد الموعد ←' : 'Confirm Appointment →';
    send.style.cssText = 'padding:0.6rem 1rem;background:var(--gold);color:var(--black);border-radius:100px;font-size:0.82rem;font-weight:800;font-family:inherit;border:none;cursor:pointer;';

    wrap.appendChild(row);
    wrap.appendChild(send);
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;

    async function submitDateTime() {
      var dateVal = dateInput.value;
      var timeVal = timeInput.value;

      if (!dateVal) { dateInput.style.borderColor = 'red'; return; }
      if (!timeVal) { timeInput.style.borderColor = 'red'; return; }

      var dateObj = new Date(dateVal + 'T00:00:00');
      var formattedDate = dateObj.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      var formattedTime = (function () {
        var parts = timeVal.split(':');
        var hour = parseInt(parts[0], 10);
        var m = parts[1];
        var period = currentLang === 'ar' ? (hour >= 12 ? 'مساءً' : 'صباحاً') : (hour >= 12 ? 'PM' : 'AM');
        var hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return hour12 + ':' + m + ' ' + period;
      })();

      selectedDate = formattedDate;
      selectedTime = formattedTime;

      wrap.remove();
      addUserMsg(formattedDate + ' — ' + formattedTime);

      var t4 = addTyping();
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

  // ── Multi-tier services (e.g. Skin Cleansing: عادي / متوسط / VIP) ──
  // A price like "30-50-120" means 3 tiers, in ascending order.
  var TIER_LABELS = [
    { ar: '\u0639\u0627\u062F\u064A', en: 'Basic' },
    { ar: '\u0645\u062A\u0648\u0633\u0637', en: 'Medium' },
    { ar: 'VIP', en: 'VIP' }
  ];

  function isMultiTierPrice(price) {
    return typeof price === 'string' && price.indexOf('-') !== -1 && /^\d+(-\d+)+$/.test(price);
  }

  function getTiersForService(serviceAr, serviceEn, price) {
    var amounts = price.split('-');
    return amounts.map(function (amt, i) {
      var tierLabel = TIER_LABELS[i] || { ar: '\u0641\u0626\u0629 ' + (i + 1), en: 'Tier ' + (i + 1) };
      return {
        ar: serviceAr + ' (' + tierLabel.ar + ')',
        en: serviceEn + ' (' + tierLabel.en + ')',
        price: amt
      };
    });
  }

  // ── startServiceBooking (from service cards / price rows) ──
  function startServiceBooking(serviceAr, serviceEn, price) {
    // Multi-tier service (e.g. "30-50-120") — ask the client to pick a tier first
    if (isMultiTierPrice(price)) {
      startTierSelection(serviceAr, serviceEn, price);
      return;
    }

    selectedService = { ar: serviceAr, en: serviceEn, price: price };
    selectedServiceName = currentLang === 'ar' ? serviceAr : serviceEn;
    selectedServicePrice = price;

    // Default to whatsapp unless already set
    if (!selectedPlatform) selectedPlatform = 'whatsapp';
    setChatHeaderPlatform(selectedPlatform);

    chatBody.innerHTML = '';

    setTimeout(async function () {
      addBotMsg(
        '\uD83D\uDC88 ' + serviceAr + ' \u2014 ' + price + ' \u0631\u064A\u0627\u0644\n\u0645\u0627 \u0647\u0648 \u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0631\u064A\u0645\u061F',
        '\uD83D\uDC88 ' + serviceEn + ' \u2014 ' + price + ' SAR\nWhat is your name?'
      );
      await delay(300);
      addNameInput();
    }, 150);

    openChat();
  }

  // ── startTierSelection — let client choose عادي/متوسط/VIP, then proceed normally ──
  function startTierSelection(serviceAr, serviceEn, price) {
    var tiers = getTiersForService(serviceAr, serviceEn, price);

    // Default to whatsapp unless already set
    if (!selectedPlatform) selectedPlatform = 'whatsapp';
    setChatHeaderPlatform(selectedPlatform);

    chatBody.innerHTML = '';
    openChat();

    setTimeout(async function () {
      addBotMsg(
        '\uD83D\uDC88 ' + serviceAr + '\n\u0627\u062E\u062A\u0631 \u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0643:',
        '\uD83D\uDC88 ' + serviceEn + '\nChoose the tier that suits you:'
      );
      await delay(300);

      addOptions(tiers.map(function (tier) {
        return {
          label: (currentLang === 'ar' ? tier.ar : tier.en) + ' \u2014 ' + tier.price + (currentLang === 'ar' ? ' \u0631\u064A\u0627\u0644' : ' SAR'),
          action: async function (lbl) {
            selectedService = { ar: tier.ar, en: tier.en, price: tier.price };
            selectedServiceName = currentLang === 'ar' ? tier.ar : tier.en;
            selectedServicePrice = tier.price;

            addUserMsg(lbl);
            var t = addTyping();
            await delay(700);
            t.remove();

            addBotMsg(
              '\u0631\u0627\u0626\u0639! \u0645\u0627 \u0647\u0648 \u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0631\u064A\u0645\u061F',
              'Great! What is your name?'
            );
            await delay(300);
            addNameInput();
          }
        };
      }));
    }, 150);
  }

  document.querySelectorAll('.btn-book-service').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.service-card');
      var serviceAr = card.getAttribute('data-service') || '';
      var serviceEn = card.getAttribute('data-en-name') || serviceAr;
      var price = card.getAttribute('data-price') || '';
      startServiceBooking(serviceAr, serviceEn, price);
    });
  });

  document.querySelectorAll('.price-row').forEach(function (row) {
    row.addEventListener('click', function () {
      var serviceAr = row.getAttribute('data-service') || '';
      var serviceEn = row.getAttribute('data-en-name') || serviceAr;
      var price = row.getAttribute('data-price') || '';
      startServiceBooking(serviceAr, serviceEn, price);
    });
  });

  // ── resetChatToCategories (no platform step) ───────────────
  function resetChatToCategories() {
    selectedService = null;
    selectedServiceName = '';
    selectedServicePrice = '';
    selectedDate = '';
    selectedTime = '';
    selectedClientName = '';
    chatBody.innerHTML = '';

    var platformLabel = selectedPlatform === 'tiktok'
      ? (currentLang === 'ar' ? '\uD83C\uDFB5 \u062A\u064A\u0643 \u062A\u0648\u0643' : '\uD83C\uDFB5 TikTok')
      : (currentLang === 'ar' ? '\uD83D\uDCAC \u0648\u0627\u062A\u0633\u0627\u0628' : '\uD83D\uDCAC WhatsApp');

    addBotMsg(
      '\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \uD83D\uDC4B \u0633\u062A\u062A\u0645 \u0645\u062A\u0627\u0628\u0639\u0629 \u062D\u062C\u0632\u0643 \u0639\u0628\u0631 ' + platformLabel + '\n\u0627\u062E\u062A\u0631 \u0646\u0648\u0639 \u0627\u0644\u062E\u062F\u0645\u0629:',
      'Welcome \uD83D\uDC4B Your booking will go through ' + platformLabel + '\nChoose a service type:'
    );

    var categories = [
      { value: 'massage', ar: '\u2668 \u0645\u0633\u0627\u062C \u0648\u0627\u0633\u062A\u0631\u062E\u0627\u0621', en: '\u2668 Massage & Relaxation' },
      { value: 'hammam', ar: '\uD83C\uDF3F \u062D\u0645\u0627\u0645 \u0645\u063A\u0631\u0628\u064A', en: '\uD83C\uDF3F Moroccan Hammam' },
      { value: 'barber', ar: '\u2702\uFE0F \u0627\u0644\u062D\u0644\u0627\u0642\u0629', en: '\u2702\uFE0F Barber' },
      { value: 'care', ar: '\u2728 \u0627\u0644\u0639\u0646\u0627\u064A\u0629 \u0648\u0627\u0644\u062A\u062C\u0645\u064A\u0644', en: '\u2728 Care & Beauty' }
    ];

    var typing = addTyping();
    setTimeout(function() {
      typing.remove();
      var wrap = document.createElement('div');
      wrap.className = 'chat-options';
      categories.forEach(function (cat) {
        var btn = document.createElement('button');
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
    }, 600);
  }

  // ── Header platform icons ──────────────────────────────────
  var ICON_NEUTRAL = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.64 7.64a1 1 0 1 0-2 0 1 1 0 0 0 2 0zM21 4l-9 9M3 21l5.5-5.5M9 14l1.5-1.5M14 9l1.5-1.5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="6" r="3" stroke="white" stroke-width="2" fill="none"/><circle cx="6" cy="18" r="3" stroke="white" stroke-width="2" fill="none"/></svg>';
  var ICON_WHATSAPP = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="white"/></svg>';
  var ICON_TIKTOK = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.16 8.16 0 0 0 4.77 1.52V7.02a4.85 4.85 0 0 1-1-.33z"/></svg>';

  function setChatHeaderPlatform(platform) {
    var headerEl = document.getElementById('chatHeader');
    var avatarEl = document.getElementById('chatAvatar');
    if (!headerEl || !avatarEl) return;
    headerEl.classList.remove('platform-whatsapp', 'platform-tiktok');
    if (platform === 'whatsapp') {
      headerEl.classList.add('platform-whatsapp');
      avatarEl.innerHTML = ICON_WHATSAPP;
    } else if (platform === 'tiktok') {
      headerEl.classList.add('platform-tiktok');
      avatarEl.innerHTML = ICON_TIKTOK;
    } else {
      avatarEl.innerHTML = ICON_NEUTRAL;
    }
  }

  // ── WhatsApp message builder — 100% safe emoji ─────────────
  // Uses only Unicode emoji codepoints, zero legacy symbols
  function buildMsg(lang) {
    var svcAr  = selectedService ? selectedService.ar : selectedServiceName;
    var svcEn  = selectedService ? selectedService.en : selectedServiceName;
    var price  = selectedServicePrice || '-';
    var name   = selectedClientName || '-';
    var dt     = (selectedDate && selectedTime) ? (selectedDate + ' \u2014 ' + selectedTime) : '-';
    var D = '================================';

    var msg = '';
    if (lang === 'ar') {
      msg += '\u2702\uFE0F *\u0643\u0627\u0632\u0627 \u0633\u062A\u0627\u0631 \u0644\u0644\u0625\u0633\u062A\u0631\u062E\u0627\u0621*\n';
      msg += D + '\n';
      msg += '\u2728 *\u062A\u0623\u0643\u064A\u062F \u062D\u062C\u0632 \u0648\u0625\u0634\u0639\u0627\u0631 \u062F\u0641\u0639* \u2705\n';
      msg += D + '\n';
      msg += '\uD83D\uDC64 *\u0627\u0644\u0627\u0633\u0645:* ' + name + '\n';
      msg += '\uD83D\uDC88 *\u0627\u0644\u062E\u062F\u0645\u0629:* ' + svcAr + '\n';
      msg += '\uD83D\uDCB0 *\u0627\u0644\u0645\u0628\u0644\u063A:* ' + price + ' \u0631\u064A\u0627\u0644\n';
      msg += '\uD83D\uDCC5 *\u0627\u0644\u0645\u0648\u0639\u062F:* ' + dt + '\n';
      msg += D + '\n';
      msg += '\u2705 \u0633\u064A\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631\u0629 \u0627\u0644\u0625\u064A\u0635\u0627\u0644 \u2014 \u0634\u0643\u0631\u0627\u064B \u0644\u0643\u0645!';
    } else {
      msg += '\u2702\uFE0F *Casastar Relaxation*\n';
      msg += D + '\n';
      msg += '\u2728 *Booking & Payment Notification* \u2705\n';
      msg += D + '\n';
      msg += '\uD83D\uDC64 *Name:* ' + name + '\n';
      msg += '\uD83D\uDC88 *Service:* ' + svcEn + '\n';
      msg += '\uD83D\uDCB0 *Amount:* ' + price + ' SAR\n';
      msg += '\uD83D\uDCC5 *Appointment:* ' + dt + '\n';
      msg += D + '\n';
      msg += '\u2705 Receipt screenshot will be attached \u2014 thank you!';
    }
    return msg;
  }

  function buildPaymentMsg(lang, methodKey) {
    var svcAr  = selectedService ? selectedService.ar : selectedServiceName;
    var svcEn  = selectedService ? selectedService.en : selectedServiceName;
    var price  = selectedServicePrice || '-';
    var name   = selectedClientName || '-';
    var dt     = (selectedDate && selectedTime) ? (selectedDate + ' \u2014 ' + selectedTime) : '-';
    var D = '================================';

    var msg = '';
    if (lang === 'ar') {
      var methodLabel =
        methodKey === 'bank' ? '\uD83C\uDFE6 \u062A\u062D\u0648\u064A\u0644 \u0628\u0646\u0643\u064A \u2014 \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0623\u0647\u0644\u064A' :
        methodKey === 'stc'  ? '\uD83D\uDCF1 STC Pay' :
        methodKey === 'mada' ? '\uD83D\uDCB3 \u0645\u062F\u0649 / Mada' : '\uD83D\uDCB3 \u0628\u0637\u0627\u0642\u0629';
      msg += '\u2702\uFE0F *\u0643\u0627\u0632\u0627 \u0633\u062A\u0627\u0631 \u0644\u0644\u0625\u0633\u062A\u0631\u062E\u0627\u0621*\n';
      msg += D + '\n';
      msg += '\u2728 *\u062A\u0623\u0643\u064A\u062F \u062D\u062C\u0632 \u0648\u0625\u0634\u0639\u0627\u0631 \u062F\u0641\u0639* \u2705\n';
      msg += D + '\n';
      msg += '\uD83D\uDC64 *\u0627\u0644\u0627\u0633\u0645:* ' + name + '\n';
      msg += '\uD83D\uDC88 *\u0627\u0644\u062E\u062F\u0645\u0629:* ' + svcAr + '\n';
      msg += '\uD83D\uDCB0 *\u0627\u0644\u0645\u0628\u0644\u063A:* ' + price + ' \u0631\u064A\u0627\u0644\n';
      msg += '\uD83D\uDCC5 *\u0627\u0644\u0645\u0648\u0639\u062F:* ' + dt + '\n';
      msg += '\uD83D\uDCB3 *\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639:* ' + methodLabel + '\n';
      if (methodKey === 'bank') msg += '\uD83C\uDFE6 *IBAN:* ' + OWNER_IBAN + '\n';
      if (methodKey === 'stc' || methodKey === 'mada') msg += '\uD83D\uDCDE *\u0631\u0642\u0645 \u0627\u0644\u062A\u062D\u0648\u064A\u0644:* +966549785075\n';
      msg += D + '\n';
      msg += '\u2705 \u0633\u064A\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631\u0629 \u0627\u0644\u0625\u064A\u0635\u0627\u0644 \u2014 \u0634\u0643\u0631\u0627\u064B \u0644\u0643\u0645!';
    } else {
      var mLabel =
        methodKey === 'bank' ? '\uD83C\uDFE6 Bank Transfer \u2014 Al Ahli' :
        methodKey === 'stc'  ? '\uD83D\uDCF1 STC Pay' :
        methodKey === 'mada' ? '\uD83D\uDCB3 Mada Card' : '\uD83D\uDCB3 Card';
      msg += '\u2702\uFE0F *Casastar Relaxation*\n';
      msg += D + '\n';
      msg += '\u2728 *Booking & Payment Notification* \u2705\n';
      msg += D + '\n';
      msg += '\uD83D\uDC64 *Name:* ' + name + '\n';
      msg += '\uD83D\uDC88 *Service:* ' + svcEn + '\n';
      msg += '\uD83D\uDCB0 *Amount:* ' + price + ' SAR\n';
      msg += '\uD83D\uDCC5 *Appointment:* ' + dt + '\n';
      msg += '\uD83D\uDCB3 *Payment Method:* ' + mLabel + '\n';
      if (methodKey === 'bank') msg += '\uD83C\uDFE6 *IBAN:* ' + OWNER_IBAN + '\n';
      if (methodKey === 'stc' || methodKey === 'mada') msg += '\uD83D\uDCDE *Transfer Number:* +966549785075\n';
      msg += D + '\n';
      msg += '\u2705 Receipt screenshot will be attached \u2014 thank you!';
    }
    return msg;
  }

  // Legacy wrappers kept for payment modal calls
  function sendBookingToWhatsapp() {
    var msg = buildMsg(currentLang);
    var waUrl = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    setTimeout(function() { window.open(waUrl, '_blank', 'noopener,noreferrer'); }, 600);
  }

  function buildPaymentWhatsappMsg(method) {
    var methodKey = selectedPayMethod || method;
    return buildPaymentMsg(currentLang, methodKey);
  }

  // ── Gallery ────────────────────────────────────────────────
  var galleryGrid = document.getElementById('galleryGrid');
  var galleryLoadMore = document.getElementById('galleryLoadMore');
  var galleryLoadMoreWrap = document.getElementById('galleryLoadMoreWrap');

  if (galleryGrid) {
    galleryGrid.querySelectorAll('.gallery-item img').forEach(function (img) {
      img.addEventListener('error', function () {
        var item = img.closest('.gallery-item');
        if (item) item.classList.add('gallery-item-missing');
      }, { once: true });
    });
  }

  if (galleryGrid && galleryLoadMore) {
    galleryLoadMore.addEventListener('click', function () {
      galleryGrid.querySelectorAll('.gallery-item[hidden]').forEach(function (item) {
        item.removeAttribute('hidden');
      });
      galleryLoadMoreWrap.style.display = 'none';
    });

    var galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
    var lightboxIndex = 0;

    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML =
      '<div class="lightbox-img-wrap">' +
      '<button class="lightbox-close" type="button" aria-label="Close">\u2715</button>' +
      '<button class="lightbox-nav prev" type="button" aria-label="Previous">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 4.5L8 12l7.5 7.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<button class="lightbox-nav next" type="button" aria-label="Next">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 4.5L16 12l-7.5 7.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<img src="" alt="">' +
      '</div>';
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector('img');
    var lightboxClose = lightbox.querySelector('.lightbox-close');
    var lightboxPrev = lightbox.querySelector('.lightbox-nav.prev');
    var lightboxNext = lightbox.querySelector('.lightbox-nav.next');

    function showLightbox(index) {
      lightboxIndex = index;
      var item = galleryItems[lightboxIndex];
      var img = item.querySelector('img');
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
      var next = lightboxIndex + direction;
      if (next < 0) next = galleryItems.length - 1;
      if (next >= galleryItems.length) next = 0;
      var guard = 0;
      while ((galleryItems[next].hasAttribute('hidden') || galleryItems[next].classList.contains('gallery-item-missing')) && guard < galleryItems.length) {
        next = next + direction;
        if (next < 0) next = galleryItems.length - 1;
        if (next >= galleryItems.length) next = 0;
        guard++;
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

  // ── Reviews carousel ───────────────────────────────────────
  var reviewsTrack = document.getElementById('reviewsTrack');
  var dotsContainer = document.getElementById('reviewsDots');
  var reviewsPrevBtn = document.getElementById('reviewsPrev');
  var reviewsNextBtn = document.getElementById('reviewsNext');

  if (reviewsTrack) {
    var cards = reviewsTrack.querySelectorAll('.review-card');

    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.style.cssText = 'width:8px;height:8px;border-radius:50%;border:none;background:' +
        (i === 0 ? 'var(--gold)' : 'var(--border)') + ';transition:background 0.3s,transform 0.3s;cursor:pointer;';
      dot.setAttribute('aria-label', 'Review ' + (i + 1));
      dot.addEventListener('click', function () {
        var cardW = cards[0].offsetWidth + 24;
        reviewsTrack.scrollTo({ left: i * cardW, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });

    reviewsTrack.addEventListener('scroll', function () {
      var cardW = cards[0].offsetWidth + 24;
      var idx = Math.round(Math.abs(reviewsTrack.scrollLeft) / cardW);
      dotsContainer.querySelectorAll('button').forEach(function (d, i) {
        d.style.background = i === idx ? 'var(--gold)' : 'var(--border)';
        d.style.transform = i === idx ? 'scale(1.3)' : 'scale(1)';
      });
    }, { passive: true });

    function scrollByOneCard(direction) {
      var cardW = cards[0].offsetWidth + 24;
      var isRtl = document.documentElement.dir === 'rtl';
      var amount = isRtl ? -direction * cardW : direction * cardW;
      reviewsTrack.scrollBy({ left: amount, behavior: 'smooth' });
    }

    if (reviewsNextBtn) reviewsNextBtn.addEventListener('click', function () { scrollByOneCard(1); });
    if (reviewsPrevBtn) reviewsPrevBtn.addEventListener('click', function () { scrollByOneCard(-1); });
  }

  // ── Smooth scroll ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#booking') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = navbar.offsetHeight + 16;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  applyLang();

  // ============================================================
  // PAYMENT MODAL
  // ============================================================
  var OWNER_IBAN = 'SA9110000001400020838808';

  var paymentOverlay = document.getElementById('paymentOverlay');
  var paymentClose   = document.getElementById('paymentClose');
  var payStep1       = document.getElementById('payStep1');
  var payStepBank    = document.getElementById('payStepBank');
  var payStepDigital = document.getElementById('payStepDigital');
  var payStepSuccess = document.getElementById('payStepSuccess');
  var selectedPayMethod = null;

  function openPaymentModal() {
    if (!paymentOverlay) return;
    [payStep1, payStepBank, payStepDigital, payStepSuccess].forEach(function(s){ if(s) s.style.display='none'; });
    if(payStep1) payStep1.style.display='block';
    selectedPayMethod = null;
    document.querySelectorAll('.pay-method-btn').forEach(function(b){ b.classList.remove('selected'); });
    if(document.getElementById('payRequiredHint')) document.getElementById('payRequiredHint').style.display='none';
    var oldTtBox = document.getElementById('tiktokMsgBox');
    if (oldTtBox) oldTtBox.remove();

    var svcName = selectedService ? (currentLang === 'ar' ? selectedService.ar : selectedService.en) : selectedServiceName;
    var price   = selectedServicePrice || '\u2014';
    var dateTime = (selectedDate && selectedTime) ? (selectedDate + ' \u2014 ' + selectedTime) : '\u2014';

    setText('summaryService', svcName);
    setText('summaryName', selectedClientName || '\u2014');
    setText('summaryDateTime', dateTime);
    setAmountText('summaryAmount', price);
    setAmountText('bankAmount', price);
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
    var sarLabel = currentLang === 'ar' ? '\u0631\u064A\u0627\u0644' : 'SAR';
    el.innerHTML = '<span style="font-size:1.4em;color:var(--gold-light);">' + price + '</span> <span style="font-size:0.8em;opacity:0.7;">' + sarLabel + '</span>';
  }

  if(paymentClose) paymentClose.addEventListener('click', closePaymentModal);
  if(paymentOverlay) paymentOverlay.addEventListener('click', function(e){ if(e.target===paymentOverlay) closePaymentModal(); });

  document.querySelectorAll('.pay-method-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.pay-method-btn').forEach(function(b){ b.classList.remove('selected'); });
      btn.classList.add('selected');
      selectedPayMethod = btn.getAttribute('data-method');
      if(document.getElementById('payRequiredHint')) document.getElementById('payRequiredHint').style.display='none';
    });
  });

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
    } else {
      var icon  = document.getElementById('digitalMethodIcon');
      var title = document.getElementById('digitalMethodTitle');
      var sub   = document.getElementById('digitalMethodSub');
      var step1 = document.getElementById('digitalStep1Ar');
      if(selectedPayMethod === 'stc') {
        if(icon)  icon.textContent = '\uD83D\uDCF1';
        if(title) title.textContent = 'STC Pay';
        if(sub)   sub.textContent = currentLang==='ar' ? '\u062A\u062D\u0648\u064A\u0644 \u0633\u0631\u064A\u0639 \u0639\u0628\u0631 STC Pay' : 'Fast transfer via STC Pay';
        if(step1) step1.textContent = currentLang==='ar' ? '\u0627\u0641\u062A\u062D \u062A\u0637\u0628\u064A\u0642 STC Pay \u0639\u0644\u0649 \u062C\u0648\u0627\u0644\u0643' : 'Open the STC Pay app on your phone';
      }
      if(selectedPayMethod === 'mada') {
        if(icon)  icon.textContent = '\uD83D\uDCB3';
        if(title) title.textContent = '\u0645\u062F\u0649 / Mada';
        if(sub)   sub.textContent = currentLang==='ar' ? '\u062F\u0641\u0639 \u0645\u0628\u0627\u0634\u0631 \u0639\u0628\u0631 \u0628\u0637\u0627\u0642\u0629 \u0645\u062F\u0649' : 'Pay via Mada debit card';
        if(step1) step1.textContent = currentLang==='ar' ? '\u0627\u0641\u062A\u062D \u062A\u0637\u0628\u064A\u0642 \u0645\u0635\u0631\u0641\u0643 \u0648\u0627\u062F\u062E\u0644 \u062E\u062F\u0645\u0629 \u0627\u0644\u062A\u062D\u0648\u064A\u0644' : 'Open your bank app and go to Transfer';
      }
      payStepDigital.style.display = 'block';
    }
  });

  ['payBackBank','payBackDigital'].forEach(function(id) {
    var el = document.getElementById(id);
    if(el) el.addEventListener('click', function() {
      [payStepBank, payStepDigital].forEach(function(s){ if(s) s.style.display='none'; });
      payStep1.style.display = 'block';
    });
  });

  var copyIbanBtn = document.getElementById('copyIban');
  if(copyIbanBtn) copyIbanBtn.addEventListener('click', function() {
    var ibanEl = document.getElementById('ibanValue');
    if(!ibanEl) return;
    var ibanText = ibanEl.textContent.replace(/\s/g,'');
    if(navigator.clipboard) {
      navigator.clipboard.writeText(ibanText).then(function() {
        copyIbanBtn.innerHTML = '\u2705';
        setTimeout(function() {
          copyIbanBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        }, 2000);
      });
    }
  });

  var copyMobileBtn = document.getElementById('copyMobile');
  if(copyMobileBtn) copyMobileBtn.addEventListener('click', function() {
    var num = '+966549785075';
    if(navigator.clipboard) {
      navigator.clipboard.writeText(num).then(function() {
        copyMobileBtn.innerHTML = '\u2705';
        setTimeout(function() {
          copyMobileBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        }, 2000);
      });
    }
  });

  // ── Payment send buttons ───────────────────────────────────
  function sendPaymentWhatsapp(method) {
    if (selectedPlatform === 'tiktok') {
      sendPaymentTikTok(method);
      return;
    }
    var msg = buildPaymentWhatsappMsg(method);
    var url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    setTimeout(function() { window.open(url, '_blank', 'noopener,noreferrer'); }, 300);
    [payStepBank, payStepDigital].forEach(function(s){ if(s) s.style.display='none'; });
    if(payStepSuccess) payStepSuccess.style.display = 'block';
  }

  function sendPaymentTikTok(method) {
    var msg = buildPaymentWhatsappMsg(method);
    [payStepBank, payStepDigital].forEach(function(s){ if(s) s.style.display='none'; });
    showTikTokMessageBox(msg);
  }

  function showTikTokMessageBox(msg) {
    if(!payStepSuccess) return;
    payStepSuccess.style.display = 'block';

    var existing = document.getElementById('tiktokMsgBox');
    if (existing) existing.remove();

    var box = document.createElement('div');
    box.id = 'tiktokMsgBox';
    box.className = 'tiktok-msg-box';
    box.innerHTML =
      '<p class="tiktok-msg-instructions">' +
        (currentLang === 'ar'
          ? '\uD83D\uDCCB \u0627\u0646\u0633\u062E \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u0648\u0623\u0631\u0633\u0644\u0647\u0627 \u0644\u0646\u0627 \u0639\u0628\u0631 \u062A\u064A\u0643 \u062A\u0648\u0643 \u0644\u062A\u0623\u0643\u064A\u062F \u062D\u062C\u0632\u0643 \u0648\u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631\u0629 \u0627\u0644\u0625\u064A\u0635\u0627\u0644:'
          : '\uD83D\uDCCB Copy the message below and send it to us on TikTok to confirm your booking and attach your receipt screenshot:') +
      '</p>' +
      '<textarea id="tiktokMsgText" class="tiktok-msg-text" readonly dir="auto"></textarea>' +
      '<div class="tiktok-msg-actions">' +
        '<button type="button" class="pay-confirm-btn tiktok-copy-btn" id="tiktokCopyBtn">' +
          (currentLang === 'ar' ? '\uD83D\uDCCB \u0646\u0633\u062E \u0627\u0644\u0631\u0633\u0627\u0644\u0629' : '\uD83D\uDCCB Copy Message') +
        '</button>' +
        '<a href="' + TIKTOK_URL + '" target="_blank" rel="noopener noreferrer" class="pay-confirm-btn tiktok-open-btn" id="tiktokOpenBtn">' +
          (currentLang === 'ar' ? '\uD83C\uDFB5 \u0641\u062A\u062D \u062A\u064A\u0643 \u062A\u0648\u0643' : '\uD83C\uDFB5 Open TikTok') +
        '</a>' +
      '</div>';

    var successBlock = payStepSuccess.querySelector('.pay-success');
    var doneBtn = document.getElementById('payDoneBtn');
    if (successBlock && doneBtn) {
      successBlock.insertBefore(box, doneBtn);
    } else if (successBlock) {
      successBlock.appendChild(box);
    } else {
      payStepSuccess.appendChild(box);
    }

    var textarea = document.getElementById('tiktokMsgText');
    if (textarea) textarea.value = msg;

    var copyBtn = document.getElementById('tiktokCopyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        if (navigator.clipboard && textarea) {
          navigator.clipboard.writeText(textarea.value).then(function() {
            copyBtn.textContent = currentLang === 'ar' ? '\u2705 \u062A\u0645 \u0627\u0644\u0646\u0633\u062E' : '\u2705 Copied';
            setTimeout(function() {
              copyBtn.textContent = currentLang === 'ar' ? '\uD83D\uDCCB \u0646\u0633\u062E \u0627\u0644\u0631\u0633\u0627\u0644\u0629' : '\uD83D\uDCCB Copy Message';
            }, 2000);
          });
        } else if (textarea) {
          textarea.select();
          document.execCommand('copy');
        }
      });
    }

    var openBtn = document.getElementById('tiktokOpenBtn');
    if (openBtn) {
      openBtn.addEventListener('click', function() {
        if (textarea && navigator.clipboard) {
          navigator.clipboard.writeText(textarea.value).catch(function(){});
        }
      });
    }
  }

  var bankWaBtn = document.getElementById('bankWhatsappBtn');
  if(bankWaBtn) bankWaBtn.addEventListener('click', function() { sendPaymentWhatsapp('bank'); });

  var digitalWaBtn = document.getElementById('digitalWhatsappBtn');
  if(digitalWaBtn) digitalWaBtn.addEventListener('click', function() { sendPaymentWhatsapp('digital'); });

  var payDoneBtn = document.getElementById('payDoneBtn');
  if(payDoneBtn) payDoneBtn.addEventListener('click', closePaymentModal);

  // ============================================================
  // DEV NOTES IN CONSOLE
  // ============================================================
  var consoleStyle1 = 'color:#C9A84C;font-size:20px;font-weight:900;font-family:sans-serif;padding:6px 0;';
  var consoleStyle2 = 'color:#888;font-size:13px;font-family:sans-serif;';
  console.log('%c\u2728 Casastar Relaxation \u2728', consoleStyle1);
  console.log('%cThis website was crafted with care by Ayman El Mjaber Developer \u2728', consoleStyle2);
  console.log('%c\uD83D\uDEAB This area is reserved for development purposes. Please go back to enjoying the site! \uD83D\uDEAB', consoleStyle2);

  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    var blocked =
      k === 'F12' ||
      (e.ctrlKey && e.shiftKey && (k === 'I' || k === 'i' || k === 'J' || k === 'j' || k === 'C' || k === 'c')) ||
      (e.ctrlKey && (k === 'U' || k === 'u'));
    if (blocked) e.preventDefault();
  });

})();