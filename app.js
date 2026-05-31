const posters = {
  dark: { src: "assets/poster-dark.png", label: "暗色海报" },
  light: { src: "assets/poster-light.png", label: "亮色海报" },
};

const scenes = [
  {
    index: "01 返回地球",
    quote: "“我们不是回来考古的。是回来认祖。”",
    text: "这不是一次普通的科考任务，而是人类在百年之后重新面对自己的来处。",
    video: "assets/scene-01.mp4",
    alt: "返回地球片段",
  },
  {
    index: "02 废墟中的汉字",
    quote: "家，不只是血缘共同体。春，不只是季节单位。",
    text: "AI 和林舟可以解释字义，却无法解释这些字背后的生活温度。",
    video: "assets/scene-04.mp4",
    alt: "废墟中的汉字片段",
  },
  {
    index: "03 地下祠堂",
    quote: "文明不只在博物馆里，也在一顿饭、一盏灯、一次等待里。",
    text: "他们发现的不是宏大历史，而是普通人一代一代留下的生活痕迹。",
    video: "assets/scene-03.mp4",
    alt: "地下祠堂片段",
  },
  {
    index: "04 一炷香",
    quote: "“不叫未知行为。叫祭祖。”",
    text: "这一刻，林舟不再只是文明记录员，而成为了真正的后人。",
    video: "assets/scene-02.mp4",
    alt: "一炷香片段",
  },
];

const shots = Array.from({ length: 42 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const extension = number === "04" ? "jpg" : "png";
  return [number, "分镜", "保持原始横向画幅。", `assets/storyboard-${number}.${extension}`];
});

function setPoster(mode) {
  const poster = posters[mode] || posters.dark;
  const posterImage = document.getElementById("posterImage");
  const preludeBlur = document.getElementById("preludeBlur");
  const posterModeText = document.getElementById("posterModeText");
  const posterSwitch = document.getElementById("posterSwitch");

  if (posterImage) posterImage.src = poster.src;
  if (preludeBlur) preludeBlur.src = poster.src;
  if (posterModeText) posterModeText.textContent = poster.label;
  if (posterSwitch) {
    posterSwitch.checked = mode === "light";
    posterSwitch.setAttribute("aria-label", mode === "light" ? "切换为暗色海报" : "切换为亮色海报");
  }
}

function initPosterPrelude() {
  const prelude = document.getElementById("prelude");
  const posterSwitch = document.getElementById("posterSwitch");
  const enterButton = document.getElementById("enterButton");
  const skipIntro = new URLSearchParams(window.location.search).get("skipIntro") === "1";
  const firstMode = Math.random() > 0.5 ? "light" : "dark";

  setPoster(firstMode);
  if (skipIntro) {
    if (prelude) prelude.style.display = "none";
    document.body.classList.remove("is-locked");
  }

  posterSwitch?.addEventListener("change", () => setPoster(posterSwitch.checked ? "light" : "dark"));
  enterButton?.addEventListener("click", () => {
    prelude?.classList.add("is-hidden");
    document.body.classList.remove("is-locked");
  });
}

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  nodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 28, 220)}ms`;
    observer.observe(node);
  });
}

function initActiveNav() {
  const links = document.querySelectorAll(".site-nav a[href^='#']");
  const sections = document.querySelectorAll("section[id]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.42 });

  sections.forEach((section) => observer.observe(section));
}

function initScriptHall() {
  const buttons = document.querySelectorAll("[data-scene]");
  const sceneIndex = document.getElementById("sceneIndex");
  const sceneQuote = document.getElementById("sceneQuote");
  const sceneText = document.getElementById("sceneText");
  const sceneVideo = document.getElementById("sceneVideo");
  const copy = document.querySelector(".script-copy");
  const visual = document.querySelector(".scene-visual");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const scene = scenes[Number(button.dataset.scene)] || scenes[0];
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      copy?.classList.add("switching");
      visual?.classList.add("switching");

      window.setTimeout(() => {
        if (sceneIndex) sceneIndex.textContent = scene.index;
        if (sceneQuote) sceneQuote.textContent = scene.quote;
        if (sceneText) sceneText.textContent = scene.text;
        if (sceneVideo) {
          sceneVideo.pause();
          sceneVideo.src = scene.video;
          sceneVideo.removeAttribute("poster");
          sceneVideo.setAttribute("aria-label", `${scene.alt}视频`);
          sceneVideo.load();
        }
        copy?.classList.remove("switching");
        visual?.classList.remove("switching");
      }, 220);
    });
  });

  sceneVideo?.addEventListener("click", () => {
    if (sceneVideo.paused) {
      sceneVideo.play();
    } else {
      sceneVideo.pause();
    }
  });
}

function initPersonArchive() {
  const cards = document.querySelectorAll(".person-card[data-person-image]");
  const modal = document.getElementById("personModal");
  const cometCard = document.getElementById("personCometCard");
  const image = document.getElementById("personModalImage");
  const title = document.getElementById("personModalTitle");
  const role = document.getElementById("personModalRole");
  const keywords = document.getElementById("personModalKeywords");
  const arc = document.getElementById("personModalArc");
  const close = modal?.querySelector(".person-modal-close");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!modal || !cometCard || !image || !title || !role || !keywords || !arc) return;

  function resetPersonTilt() {
    modal.style.setProperty("--person-tilt-x", "0deg");
    modal.style.setProperty("--person-tilt-y", "0deg");
    modal.style.setProperty("--person-tilt-tx", "0px");
    modal.style.setProperty("--person-tilt-ty", "0px");
    modal.style.setProperty("--person-spot-x", "50%");
    modal.style.setProperty("--person-spot-y", "50%");
  }

  function updatePersonTilt(event) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const rect = cometCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const centeredX = x - 0.5;
    const centeredY = y - 0.5;
    modal.style.setProperty("--person-tilt-x", `${(-centeredY * 7).toFixed(2)}deg`);
    modal.style.setProperty("--person-tilt-y", `${(centeredX * 9).toFixed(2)}deg`);
    modal.style.setProperty("--person-tilt-tx", `${(centeredX * 10).toFixed(2)}px`);
    modal.style.setProperty("--person-tilt-ty", `${(centeredY * 8).toFixed(2)}px`);
    modal.style.setProperty("--person-spot-x", `${(x * 100).toFixed(1)}%`);
    modal.style.setProperty("--person-spot-y", `${(y * 100).toFixed(1)}%`);
  }

  function openPerson(card) {
    image.src = card.dataset.personImage || "";
    image.alt = `${card.dataset.personTitle || ""}人物档案`;
    title.textContent = card.dataset.personTitle || "";
    role.textContent = card.dataset.personRole || "";
    keywords.textContent = card.dataset.personKeywords || "";
    arc.textContent = card.dataset.personArc || "";
    resetPersonTilt();
    document.body.classList.add("lightbox-open");
    modal.showModal();
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openPerson(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPerson(card);
      }
    });
  });

  close?.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    resetPersonTilt();
  });
  cometCard.addEventListener("pointermove", updatePersonTilt);
  cometCard.addEventListener("pointerleave", resetPersonTilt);
}

function initPlanCards() {
  const cards = document.querySelectorAll(".plan-card[data-plan-card]");
  const modal = document.getElementById("planModal");
  const cometCard = document.getElementById("planCometCard");
  const image = document.getElementById("planModalImage");
  const close = modal?.querySelector(".plan-modal-close");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!modal || !cometCard || !image) return;

  function resetPlanTilt() {
    modal.style.setProperty("--plan-tilt-x", "0deg");
    modal.style.setProperty("--plan-tilt-y", "0deg");
    modal.style.setProperty("--plan-tilt-tx", "0px");
    modal.style.setProperty("--plan-tilt-ty", "0px");
    modal.style.setProperty("--plan-spot-x", "50%");
    modal.style.setProperty("--plan-spot-y", "50%");
  }

  function updatePlanTilt(event) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const rect = cometCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const centeredX = x - 0.5;
    const centeredY = y - 0.5;
    modal.style.setProperty("--plan-tilt-x", `${(-centeredY * 7).toFixed(2)}deg`);
    modal.style.setProperty("--plan-tilt-y", `${(centeredX * 9).toFixed(2)}deg`);
    modal.style.setProperty("--plan-tilt-tx", `${(centeredX * 10).toFixed(2)}px`);
    modal.style.setProperty("--plan-tilt-ty", `${(centeredY * 8).toFixed(2)}px`);
    modal.style.setProperty("--plan-spot-x", `${(x * 100).toFixed(1)}%`);
    modal.style.setProperty("--plan-spot-y", `${(y * 100).toFixed(1)}%`);
  }

  function openPlan(card) {
    image.src = card.dataset.planCard || "";
    image.alt = `${card.dataset.planTitle || ""}计划卡片`;
    resetPlanTilt();
    document.body.classList.add("lightbox-open");
    modal.showModal();
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openPlan(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPlan(card);
      }
    });
  });

  close?.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    resetPlanTilt();
  });
  cometCard.addEventListener("pointermove", updatePlanTilt);
  cometCard.addEventListener("pointerleave", resetPlanTilt);
}

function initShotGallery() {
  const grid = document.getElementById("shotGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const close = lightbox?.querySelector(".lightbox-close");
  const caption = document.getElementById("galleryCaption");
  const counter = document.getElementById("galleryCounter");
  const prev = document.getElementById("galleryPrev");
  const next = document.getElementById("galleryNext");
  if (!grid) return;

  let activeIndex = 0;
  let startX = 0;
  let dragDelta = 0;
  let pointerDown = false;
  let moved = false;
  const stepAngle = 14;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resetLightboxTilt() {
    lightbox?.style.setProperty("--tilt-x", "0deg");
    lightbox?.style.setProperty("--tilt-y", "0deg");
    lightbox?.style.setProperty("--tilt-tx", "0px");
    lightbox?.style.setProperty("--tilt-ty", "0px");
    lightbox?.style.setProperty("--spot-x", "50%");
    lightbox?.style.setProperty("--spot-y", "50%");
  }

  function updateLightboxTilt(event) {
    if (prefersReducedMotion || !lightboxImage || event.pointerType === "touch") return;
    const rect = lightboxImage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const centeredX = x - 0.5;
    const centeredY = y - 0.5;
    lightbox?.style.setProperty("--tilt-x", `${(-centeredY * 7).toFixed(2)}deg`);
    lightbox?.style.setProperty("--tilt-y", `${(centeredX * 9).toFixed(2)}deg`);
    lightbox?.style.setProperty("--tilt-tx", `${(centeredX * 10).toFixed(2)}px`);
    lightbox?.style.setProperty("--tilt-ty", `${(centeredY * 8).toFixed(2)}px`);
    lightbox?.style.setProperty("--spot-x", `${(x * 100).toFixed(1)}%`);
    lightbox?.style.setProperty("--spot-y", `${(y * 100).toFixed(1)}%`);
  }

  function openLightbox(index) {
    const [number, title, , src] = shots[index];
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    resetLightboxTilt();
    lightboxImage.src = src;
    lightboxImage.alt = `${title} ${number}`;
    lightboxCaption.textContent = `${title} ${number}`;
    document.body.classList.add("lightbox-open");
    lightbox.showModal();
  }

  function setActive(index) {
    activeIndex = (index + shots.length) % shots.length;
    const [number, title, description] = shots[activeIndex];
    grid.querySelectorAll(".circular-card").forEach((card, cardIndex) => {
      const raw = cardIndex - activeIndex;
      let offset = raw;
      if (offset > shots.length / 2) offset -= shots.length;
      if (offset < -shots.length / 2) offset += shots.length;
      const abs = Math.abs(offset);
      const rotate = offset * stepAngle;
      const translateX = offset * 345;
      const translateY = abs * 20;
      const translateZ = -abs * 92;
      const scale = Math.max(0.64, 1 - abs * 0.085);
      const opacity = abs > 4 ? 0 : Math.max(0.2, 1 - abs * 0.16);
      const blur = Math.min(abs * 0.75, 3.2);
      card.classList.toggle("is-active", cardIndex === activeIndex);
      card.style.zIndex = String(100 - abs);
      card.style.opacity = String(opacity);
      card.style.filter = `blur(${blur}px) saturate(${cardIndex === activeIndex ? 1 : 0.72})`;
      card.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${-rotate}deg) scale(${scale})`;
    });
    if (caption) {
      caption.innerHTML = `<span>${number}</span><b>${title}</b><p>${description}</p>`;
    }
    if (counter) {
      counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${shots.length}`;
    }
  }

  shots.forEach(([number, title, , src], index) => {
    const button = document.createElement("button");
    button.className = "circular-card";
    button.type = "button";
    button.innerHTML = `<img src="${src}" alt="${title} ${number}" /><span>${number}</span>`;
    button.addEventListener("click", () => {
      if (moved) return;
      setActive(index);
      openLightbox(index);
    });
    grid.appendChild(button);
  });

  function shift(direction) {
    setActive(activeIndex + direction);
  }

  prev?.addEventListener("click", () => shift(-1));
  next?.addEventListener("click", () => shift(1));

  grid.addEventListener("wheel", (event) => {
    event.preventDefault();
    shift(event.deltaY > 0 || event.deltaX > 0 ? 1 : -1);
  }, { passive: false });

  grid.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    moved = false;
    dragDelta = 0;
    startX = event.clientX;
    grid.classList.add("is-dragging");
    grid.setPointerCapture?.(event.pointerId);
  });

  grid.addEventListener("pointermove", (event) => {
    if (!pointerDown) return;
    dragDelta = event.clientX - startX;
    if (Math.abs(dragDelta) > 8) moved = true;
  });

  grid.addEventListener("pointerup", (event) => {
    if (!pointerDown) return;
    pointerDown = false;
    grid.classList.remove("is-dragging");
    grid.releasePointerCapture?.(event.pointerId);
    if (Math.abs(dragDelta) > 48) {
      shift(dragDelta < 0 ? 1 : -1);
    }
    window.setTimeout(() => {
      moved = false;
    }, 0);
  });

  grid.addEventListener("pointercancel", () => {
    pointerDown = false;
    moved = false;
    grid.classList.remove("is-dragging");
  });

  close?.addEventListener("click", () => lightbox?.close());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    resetLightboxTilt();
  });
  lightboxImage?.addEventListener("pointermove", updateLightboxTilt);
  lightboxImage?.addEventListener("pointerleave", resetLightboxTilt);
  setActive(0);
}

function initSymbolGalaxy() {
  const section = document.getElementById("symbol");
  const canvas = document.getElementById("symbolsGalaxy");
  if (!section || !canvas) return;

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let active = false;
  let animationId = 0;
  let time = 0;
  const pointer = { x: 0.28, y: 0.42, tx: 0.28, ty: 0.42, inside: false };
  const stars = [];

  function buildStars() {
    stars.length = 0;
    const count = Math.min(460, Math.max(240, Math.floor((width * height) / 4300)));
    for (let i = 0; i < count; i += 1) {
      const arm = i % 4;
      const radius = Math.pow(Math.random(), 0.58);
      const angle = radius * 5.9 + arm * Math.PI * 0.5 + (Math.random() - 0.5) * 0.72;
      stars.push({
        radius,
        angle,
        size: 0.55 + Math.random() * 1.85,
        speed: 0.0012 + Math.random() * 0.0028,
        alpha: 0.28 + Math.random() * 0.72,
        hue: Math.random() > 0.78 ? "gold" : "blue",
        twinkle: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 18,
      });
    }
  }

  function resize() {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function drawStar(x, y, size, alpha, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 8);
    gradient.addColorStop(0, color === "gold" ? `rgba(223,184,110,${alpha})` : `rgba(170,210,255,${alpha})`);
    gradient.addColorStop(0.24, color === "gold" ? `rgba(185,147,87,${alpha * 0.42})` : `rgba(96,156,255,${alpha * 0.42})`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color === "gold" ? `rgba(255,232,180,${alpha})` : `rgba(235,248,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function render() {
    if (!active) return;
    time += prefersReducedMotion ? 0.0015 : 0.0045;
    pointer.x += (pointer.tx - pointer.x) * 0.055;
    pointer.y += (pointer.ty - pointer.y) * 0.055;
    section.style.setProperty("--galaxy-x", `${(pointer.x * 100).toFixed(1)}%`);
    section.style.setProperty("--galaxy-y", `${(pointer.y * 100).toFixed(1)}%`);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 2, 8, 0.34)";
    ctx.fillRect(0, 0, width, height);

    const cx = width * (0.24 + pointer.x * 0.16);
    const cy = height * (0.36 + pointer.y * 0.14);
    const maxRadius = Math.max(width, height) * 0.78;
    const pullX = pointer.x * width;
    const pullY = pointer.y * height;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    stars.forEach((star) => {
      const rotation = time * (0.16 + star.speed * 36);
      const angle = star.angle + rotation + Math.sin(time + star.twinkle) * 0.045;
      const r = star.radius * maxRadius;
      const spiralX = Math.cos(angle) * r * 1.08;
      const spiralY = Math.sin(angle) * r * 0.34 + star.drift;
      let x = cx + spiralX;
      let y = cy + spiralY;
      const dx = pullX - x;
      const dy = pullY - y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const influence = pointer.inside ? Math.max(0, 1 - distance / 560) : 0;
      x += dx * influence * 0.2;
      y += dy * influence * 0.2;
      const pulse = 0.72 + Math.sin(time * 2.6 + star.twinkle) * 0.28;
      const alpha = star.alpha * pulse * (0.55 + influence * 0.78);
      drawStar(x, y, star.size * (1 + influence * 0.45), alpha, star.hue);
    });

    const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.42);
    coreGradient.addColorStop(0, "rgba(118,174,255,0.46)");
    coreGradient.addColorStop(0.34, "rgba(75,130,255,0.16)");
    coreGradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy, maxRadius * 0.48, maxRadius * 0.18, -0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    animationId = window.requestAnimationFrame(render);
  }

  function start() {
    if (active) return;
    active = true;
    animationId = window.requestAnimationFrame(render);
  }

  function stop() {
    active = false;
    window.cancelAnimationFrame(animationId);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });
  }, { threshold: 0.08 });

  section.addEventListener("pointermove", (event) => {
    const rect = section.getBoundingClientRect();
    pointer.tx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    pointer.ty = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    pointer.inside = true;
  }, { passive: true });

  section.addEventListener("pointerleave", () => {
    pointer.inside = false;
    pointer.tx = 0.28;
    pointer.ty = 0.42;
  });

  window.addEventListener("resize", resize);
  resize();
  observer.observe(section);
}

function initSiteNavLabels() {
  const brand = document.querySelector(".site-nav .brand");
  const nav = document.querySelector(".site-nav nav");
  if (brand) brand.textContent = "归土 Project";
  if (!nav) return;
  nav.setAttribute("aria-label", "主导航");
  nav.innerHTML = `
    <a href="#home">概览</a>
    <a href="#worldview">世界观</a>
    <a href="#archive">档案</a>
    <a href="#script">剧本</a>
    <a href="#storyboard">分镜</a>
    <a href="#screening">放映</a>
  `;
}

function initFullFilmPlayer() {
  const player = document.getElementById("filmPlayer");
  const video = document.getElementById("fullFilmVideo");
  const centerPlay = document.getElementById("filmPlayCenter");
  const toggle = document.getElementById("filmToggle");
  const progress = document.getElementById("filmProgress");
  const current = document.getElementById("filmCurrent");
  const duration = document.getElementById("filmDuration");
  const mute = document.getElementById("filmMute");
  const caption = document.getElementById("filmCaption");
  const fullscreen = document.getElementById("filmFullscreen");
  const subtitle = document.getElementById("filmSubtitle");
  const controls = document.getElementById("filmControls");
  if (!player || !video || !centerPlay || !toggle || !progress || !current || !duration || !mute || !caption || !fullscreen || !subtitle || !controls) return;

  const subtitleLines = [
    "百年以后，人类重返死寂地球。",
    "他们寻找被遗忘的文明遗存，也寻找自己从哪里来。",
    "家，不只是血缘共同体。春，不只是季节单位。",
    "文明不只在博物馆里，也在一顿饭、一盏灯、一次等待里。",
    "不叫未知行为。叫祭祖。",
    "文明不是被带走才得以保存，而是被记得，才没有消失。",
  ];
  let hideTimer = 0;
  let seeking = false;

  function formatTime(value) {
    if (!Number.isFinite(value)) return "00:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function showControls() {
    player.classList.add("controls-visible");
    window.clearTimeout(hideTimer);
    if (!video.paused) {
      hideTimer = window.setTimeout(() => {
        player.classList.remove("controls-visible");
      }, 2600);
    }
  }

  function updateSubtitle() {
    const total = video.duration || 180;
    const ratio = total ? video.currentTime / total : 0;
    const index = Math.min(subtitleLines.length - 1, Math.floor(ratio * subtitleLines.length));
    subtitle.textContent = subtitleLines[index] || "";
  }

  function updateProgress() {
    const total = video.duration || 180;
    if (!seeking) {
      progress.value = String(Math.round((video.currentTime / total) * 1000) || 0);
    }
    current.textContent = formatTime(video.currentTime);
    duration.textContent = formatTime(total);
    updateSubtitle();
  }

  async function playFilm() {
    try {
      await video.play();
    } catch {
      player.classList.remove("is-playing");
    }
  }

  function togglePlayback() {
    if (video.paused) {
      playFilm();
    } else {
      video.pause();
    }
  }

  centerPlay.addEventListener("click", togglePlayback);
  toggle.addEventListener("click", togglePlayback);
  video.addEventListener("click", togglePlayback);

  video.addEventListener("play", () => {
    player.classList.add("is-playing", "controls-visible");
    player.classList.remove("has-ended");
    toggle.textContent = "Ⅱ";
    showControls();
  });

  video.addEventListener("pause", () => {
    player.classList.remove("is-playing");
    player.classList.add("controls-visible");
    toggle.textContent = "▶";
    window.clearTimeout(hideTimer);
  });

  video.addEventListener("loadedmetadata", updateProgress);
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("ended", () => {
    player.classList.remove("is-playing");
    player.classList.add("has-ended", "controls-visible");
    toggle.textContent = "▶";
    window.clearTimeout(hideTimer);
  });

  progress.addEventListener("input", () => {
    seeking = true;
    const total = video.duration || 180;
    video.currentTime = (Number(progress.value) / 1000) * total;
    updateProgress();
  });
  progress.addEventListener("change", () => {
    seeking = false;
    updateProgress();
  });

  mute.addEventListener("click", () => {
    video.muted = !video.muted;
    mute.classList.toggle("active", video.muted);
    mute.textContent = video.muted ? "MUTE" : "VOL";
    showControls();
  });

  caption.addEventListener("click", () => {
    player.classList.toggle("is-caption-on");
    caption.classList.toggle("active", player.classList.contains("is-caption-on"));
    showControls();
  });

  fullscreen.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      player.requestFullscreen?.();
    }
    showControls();
  });

  player.addEventListener("pointermove", showControls);
  player.addEventListener("pointerenter", showControls);
  controls.addEventListener("pointermove", showControls);
  updateProgress();
}

document.addEventListener("DOMContentLoaded", () => {
  initSiteNavLabels();
  initPosterPrelude();
  initReveal();
  initActiveNav();
  initScriptHall();
  initPersonArchive();
  initPlanCards();
  initShotGallery();
  initSymbolGalaxy();
  initFullFilmPlayer();

  const section = new URLSearchParams(window.location.search).get("section");
  if (section) {
    window.setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ block: "start" });
    }, 250);
  }
});
