import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ──────────────────────────────────────────
// 1. DATA, ASSETS & CONFIG
// ──────────────────────────────────────────

// 🔥 IMPORTANT: Paste your YouTube Data API v3 Key here to fetch actual views, titles, and high-res thumbnails!
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; 

const TRUSTED_AVATARS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/men/86.jpg"
];

const REVIEWS_DATA = [
  { 
    name: "Alex Rivera", role: "YouTuber, 1.5M Subs", 
    text: "The retention on my shorts went up by 40% after working with VisWave Media. Insane results.",
    img: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  { 
    name: "Sarah Chen", role: "Course Creator", 
    text: "I used to spend 10 hours editing. Now I just record and upload. Game changer.",
    img: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  { 
    name: "Mark Davis", role: "Tech Reviewer", 
    text: "Quality is unmatched. They actually understand pacing and storytelling.",
    img: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  { 
    name: "Jessica L.", role: "Lifestyle Vlogger", 
    text: "Thumbnails are click magnets. My CTR doubled in the first week.",
    img: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  { 
    name: "Ryan K.", role: "Streamer", 
    text: "Fastest delivery I've seen. The team is super responsive and gets the vibe right.",
    img: "https://randomuser.me/api/portraits/men/18.jpg"
  }
];

const PORTFOLIO_DATA = {
  featured: { id: "feat1", videoId: "p4g5OL8g1M0" },
  longForm: [
    { id: "lf1", videoId: "qMV6c1LLuXA" },
    { id: "lf2", videoId: "57Y6xK0AXII" },
    { id: "lf3", videoId: "DCVwVOmOwls" }
  ],
  shorts: [
    { id: "s1", videoId: "AEjCls-Zs6s" },
    { id: "s2", videoId: "y0UG65Tlndc" },
    { id: "s3", videoId: "5oNF6lqqO8Q" },
    { id: "s4", videoId: "oOkp_3oTyVM" },
    { id: "s5", videoId: "KjV6CJHNN6I" },
    { id: "s6", videoId: "GL4SSanN55Y" }
  ]
};

const VIDEO_TESTIMONIALS = [
  { id: "video1", videoId: "qUyn5aoOpf8", name: "Alex Hormozi", role: "Entrepreneur & Investor" },
  { id: "video2", videoId: "qUyn5aoOpf8", name: "Ali Abdaal", role: "Productivity Expert" },
  { id: "video3", videoId: "qUyn5aoOpf8", name: "Iman Gadzhi", role: "Business Owner" }
];

// ──────────────────────────────────────────
// 2. ICONS & SVGs
// ──────────────────────────────────────────
const SunIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const ArrowRight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const ArrowUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const ChevronDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const CrossIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ff4d4d'}}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{color: '#fff'}}><polyline points="20 6 9 17 4 12"></polyline></svg>;
const StarBullet = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{color: '#ff5c00'}}><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>;
const TwitterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const InstagramIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const LinkedInIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const MailIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const PhoneIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const EyeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const YouTubeLogo = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/></svg>;
const TikTokLogo = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>;

// ──────────────────────────────────────────
// 3. BUTTERY SMOOTH SCROLL HELPER
// ──────────────────────────────────────────
const slowScrollTo = (targetY, duration = 1200) => {
  const startY = window.pageYOffset;
  const difference = targetY - startY;
  let startTime = null;

  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    window.scrollTo(0, startY + difference * easeInOutCubic(progress));

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

// ──────────────────────────────────────────
// 4. ANIMATION & UTILITY HELPERS
// ──────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0)`;
      }
    };

    const handleMouseOver = (e) => {
      if (cursorRef.current) {
        const isClickable = e.target.closest('a, button, .portfolio-card, .trust-pill, .is-row, .faq-item');
        if (isClickable) {
          cursorRef.current.classList.add('hovered');
        } else {
          cursorRef.current.classList.remove('hovered');
        }
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef} />;
}

function AnimatedNumber({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const numericTarget = parseInt(value.replace(/,/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericTarget));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasAnimated, numericTarget, duration]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function formatViews(viewCount) {
  if (!viewCount) return null;
  const views = parseInt(viewCount, 10);
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M Views";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K Views";
  return views + " Views";
}

function UploadVisual() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let animationFrameId;
    const loopDuration = 5000;
    const startLoad = 1500; 
    const endLoad = 4250;   
    const loadTime = endLoad - startLoad;

    const animate = () => {
      const now = Date.now();
      const elapsed = now % loopDuration;

      if (elapsed < startLoad) {
        setProgress(0);
      } else if (elapsed > endLoad) {
        setProgress(100);
      } else {
        const percentage = ((elapsed - startLoad) / loadTime) * 100;
        setProgress(Math.floor(percentage));
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="proc-visual v-grow">
      <div className="file-preview">
        <span>Final_Cut_v2.mp4</span>
      </div>
      <div className="upload-ui">
        <div className="upload-cursor">
          <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24"><path d="M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,0.9l-3.2-7.4l-4.4,4L7,2z" stroke="white" strokeWidth="1"/></svg>
        </div>
        <div className="upload-btn">
          <span className="txt-publish">Publish</span>
          <div className="txt-publishing">
              <span>Publishing...</span>
              <span className="percent-count">{progress}%</span>
          </div>
          <div className="upload-progress">
              <div className="upload-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 5. CONTENT CONSTANTS
// ──────────────────────────────────────────

const SERVICES_DATA = [
  {
    title: "YouTube Shorts Editing",
    desc: "We turn raw clips into high-retention, caption-packed vertical videos that pop on Reels, Shorts, and TikTok. Great for content repurposing and explosive growth.",
    tags: ["Snappy Pacing", "Viral-Ready", "Subtitled"],
    visual: (
      <div className="srv-visual">
         <div className="phone-mockup">
            <div className="shorts-scroll-track">
               <div className="short-item s-item-1">
                  <div className="s-play-center"><PlayIcon /></div>
                  <div className="s-ui">
                     <div className="s-avatar"></div>
                     <div className="s-line"></div>
                     <div className="s-line short"></div>
                  </div>
               </div>
               <div className="short-item s-item-2">
                  <div className="s-play-center"><PlayIcon /></div>
                  <div className="s-ui">
                     <div className="s-avatar"></div>
                     <div className="s-line"></div>
                     <div className="s-line short"></div>
                  </div>
               </div>
               <div className="short-item s-item-3">
                  <div className="s-play-center"><PlayIcon /></div>
                  <div className="s-ui">
                     <div className="s-avatar"></div>
                     <div className="s-line"></div>
                     <div className="s-line short"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    )
  },
  {
    title: "Long Form Edits",
    desc: "From vlogs to deep dives, we trim the fluff, tighten the pacing, and ensure your storytelling keeps viewers engaged from start to finish.",
    tags: ["Retention-Driven", "Storytelling"],
    visual: (
      <div className="srv-visual">
         <div className="editor-window">
            <div className="preview-pane">
                <PlayIcon />
            </div>
            <div className="timeline-mini">
               <div className="t-block" style={{width: '30%'}}/>
               <div className="t-block" style={{width: '20%'}}/>
               <div className="t-block highlight" style={{width: '40%'}}/>
            </div>
         </div>
      </div>
    )
  },
  {
    title: "Thumbnail Design",
    desc: "Stop the scroll with high-CTR thumbnails. We combine psychology and design to make sure your videos get the clicks they deserve.",
    tags: ["Click Magnet", "Custom Art"],
    visual: (
      <div className="srv-visual">
         <div className="thumb-card">
            <div className="thumb-img">
               <div className="ctr-badge">12% CTR <ArrowUp /></div>
            </div>
            <div className="thumb-title-line" />
            <div className="thumb-desc-line" />
         </div>
      </div>
    )
  },
  {
    title: "Content Repurposing",
    desc: "One video, 10 pieces of content — cut into Shorts, Reels, quote cards, and teasers. Perfect for creators who want to stay visible everywhere.",
    tags: ["Multi-Platform", "Batch Delivery"],
    visual: (
      <div className="srv-visual">
         <div className="v-repurpose">
             <svg className="branch-lines" preserveAspectRatio="none" viewBox="0 0 280 180">
                <path d="M 80,90 C 140,90 160,32 236,32" />
                <path d="M 80,90 L 236,90" />
                <path d="M 80,90 C 140,90 160,148 236,148" />
             </svg>
             <div className="source-node">
                <PlayIcon />
             </div>
             <div className="output-nodes">
                <div className="out-node n-yt"><YouTubeLogo /></div>
                <div className="out-node n-ig"><InstagramIcon /></div>
                <div className="out-node n-tk"><TikTokLogo /></div>
             </div>
         </div>
      </div>
    )
  }
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Drop Your Footage",
    desc: "Upload your raw clips via Google Drive, Dropbox, or WeTransfer. We handle the heavy lifting.",
    visual: (
      <div className="proc-visual v-upload">
        <div className="icon-circle"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
        <div className="floating-file f1" />
        <div className="floating-file f2" />
      </div>
    )
  },
  {
    num: "02",
    title: "We Do Our Magic",
    desc: "We cut, trim, color-grade, and add engaging transitions using industry-standard tools.",
    visual: (
      <div className="proc-visual v-magic">
        <div className="magic-timeline">
            <div className="timeline-track t1" />
            <div className="timeline-track t2" />
            <div className="timeline-track t3" />
            <div className="timeline-head" />
        </div>
        <div className="magic-star s1">✦</div>
        <div className="magic-star s2">✦</div>
      </div>
    )
  },
  {
    num: "03",
    title: "Feedback? Easy.",
    desc: "Want something changed? We offer smooth revision rounds to make sure everything is perfect.",
    visual: (
      <div className="proc-visual v-feedback">
        <div className="chat-msg left msg-1">Can we cut the intro?</div>
        <div className="chat-msg right msg-2">Done! Anything else? 🫡</div>
        <div className="chat-msg left msg-3">Perfect! 🔥</div>
      </div>
    )
  },
  {
    num: "04",
    title: "Upload & Grow",
    desc: "We deliver your final video in ready-to-upload format. Just hit publish and watch the views roll in.",
    visual: <UploadVisual />
  }
];

const SOLUTION_DATA = {
  problems: [
    "Editing takes me forever.",
    "I miss uploads trying to finish videos.",
    "I hate editing. I just want to record.",
    "My videos don’t look pro enough.",
    "Captions are a pain to add."
  ],
  solutions: [
    "Done-for-you edits, always on time.",
    "Fast turnaround.",
    "You record. We handle the rest.",
    "Cinematic, clean, and branded.",
    "Burned-in, style-matched captions."
  ]
};

const FAQ_DATA = [
  {
    question: "What types of videos do you edit?",
    answer: "If it’s video, we handle it. Shorts, Reels, TikToks, long-form YouTube, podcasts, or VSLs—we optimize it all for retention and engagement."
  },
  {
    question: "How fast is the delivery?",
    answer: "Fast enough to keep your algorithm happy. Expect 24-48 hours for short-form and 48-72 hours for long-form. We don't miss deadlines."
  },
  {
    question: "Can I request revisions?",
    answer: "We don't stop until you're hyped about the final cut. You get unlimited revisions during the review phase to ensure every frame is perfect."
  },
  {
    question: "Who is this for?",
    answer: "Serious creators and brands ready to scale. Whether you’re a funded startup, a 7-figure entrepreneur, or a growing media company, our workflow adapts to you, not the other way around."
  },
  {
    question: "What is the timeline of results?",
    answer: "Growth isn't magic; it's consistency. Most partners see a significant lift in metrics within 30-60 days. The real viral compounding effect usually kicks in around months 3 to 6."
  },
  {
    question: "Is there any guarantee?",
    answer: "We guarantee top-tier, high-retention assets delivered on time, every time. While we can't control the algorithm, our track record proves that consistent quality is the only 'hack' that actually works."
  }
];

// ──────────────────────────────────────────
// 6. SUB-COMPONENTS
// ──────────────────────────────────────────

function InteractiveServices() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="interactive-services-container">
      <div className="is-left">
        {SERVICES_DATA.map((srv, idx) => (
          <div
            key={idx}
            className={`is-row ${activeIndex === idx ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(idx)}
            onClick={() => setActiveIndex(idx)}
          >
            <div className="is-row-header">
              <div className="is-num">0{idx + 1}</div>
              <h3 className="is-title">{srv.title}</h3>
            </div>
            
            <div className="is-mobile-content">
               <p className="is-desc">{srv.desc}</p>
               <div className="is-tags">
                 {srv.tags.map((tag, i) => (
                   <span key={i} className="service-tag">
                     <span className="tag-dot">✦</span> {tag}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="is-right desktop-only">
        <div className="is-visual-wrapper">
           {SERVICES_DATA.map((srv, idx) => (
             <div key={idx} className={`is-visual-content ${activeIndex === idx ? 'active' : ''}`}>
                <div className="is-img-placeholder">
                  {srv.visual} 
                </div>
                <div className="is-text-content">
                  <p className="is-desc">{srv.desc}</p>
                  <div className="is-tags">
                     {srv.tags.map((tag, i) => (
                       <span key={i} className="service-tag">
                         <span className="tag-dot">✦</span> {tag}
                       </span>
                     ))}
                  </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function DynamicYouTubeCard({ videoId, type = "landscape", showViews = false, showTitle = false, customFallbackTitle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoData, setVideoData] = useState({
     title: customFallbackTitle || "", 
     thumb: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
     views: null
  });

  useEffect(() => {
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === "YOUR_API_KEY_HERE") return;

    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const info = data.items[0];
          setVideoData({
            title: info.snippet.title,
            thumb: info.snippet.thumbnails?.maxres?.url || info.snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            views: info.statistics.viewCount
          });
        }
      })
      .catch(err => console.error("YouTube API Error:", err));
  }, [videoId]);

  const formattedViews = showViews && videoData.views ? formatViews(videoData.views) : null;

  return (
    <div className={`portfolio-card ${type} ${isPlaying ? 'playing' : ''}`} onClick={() => setIsPlaying(true)}>
      {!isPlaying ? (
        <>
          <img src={videoData.thumb} alt={videoData.title} className="p-thumb" />
          
          {formattedViews && (
            <div className="views-badge">
              <EyeIcon /> {formattedViews}
            </div>
          )}

          <div className="play-overlay">
            <div className="play-btn-circle">
              <PlayIcon />
            </div>
          </div>
          
          {showTitle && videoData.title && (
             <div className="p-title-overlay">{videoData.title}</div>
          )}
        </>
      ) : (
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
          title="YouTube video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="p-iframe"
        ></iframe>
      )}
    </div>
  );
}

function WorkPage({ openFaqIndex, toggleFaq }) {
  const [dbVideos, setDbVideos] = useState({ featured: null, longForm: [], shorts: [] });

  useEffect(() => {
    async function loadPortfolio() {
      const { data } = await supabase.from('portfolio_videos').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setDbVideos({
          featured: data.find(v => v.category === 'featured'),
          longForm: data.filter(v => v.category === 'longForm'),
          shorts: data.filter(v => v.category === 'shorts')
        });
      }
    }
    loadPortfolio();
  }, []);

  const activeFeatured = dbVideos.featured || PORTFOLIO_DATA.featured;
  const activeLongForm = dbVideos.longForm.length > 0 ? dbVideos.longForm : PORTFOLIO_DATA.longForm;
  const activeShorts = dbVideos.shorts.length > 0 ? dbVideos.shorts : PORTFOLIO_DATA.shorts;

  return (
    <div className="page-wrapper">
      <section className="work-section page-mode" id="work">
        <div className="work-container">
          <div className="section-header-left">
             <h2 className="work-title">Our Work</h2>
             <p className="work-subtitle">YOU FILM IT. WE SHAPE IT. TOGETHER WE BUILD SOMETHING PEOPLE WANT TO WATCH.</p>
          </div>

          <div className="highlights-grid">
             <div className="feat-video-wrapper">
                <DynamicYouTubeCard 
                   videoId={activeFeatured.video_id || activeFeatured.videoId} 
                   type="featured"
                   showViews={true}
                   showTitle={false}
                />
             </div>
             
             <div className="standard-video-row">
                {activeLongForm.map((vid, index) => (
                   <DynamicYouTubeCard 
                     key={vid.id || index} 
                     videoId={vid.video_id || vid.videoId} 
                     type="landscape" 
                     showViews={true}
                     showTitle={false} 
                   />
                ))}
             </div>
          </div>
        </div>

        <div className="work-container shorts-container">
           <div className="section-header-left">
             <h2 className="work-title">Short Form Content</h2>
             <p className="work-subtitle">HOOK. HOLD. HIT. REELS AND SHORTS THAT DON'T GET SKIPPED.</p>
          </div>
          
          <div className="shorts-grid">
             {activeShorts.map((vid, index) => (
                 <DynamicYouTubeCard 
                   key={vid.id || index} 
                   videoId={vid.video_id || vid.videoId} 
                   type="portrait" 
                   showViews={false}
                   showTitle={false} 
                 />
             ))}
          </div>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-grid">
          <div className="faq-left">
            <div className="faq-pill">
              <span className="rotating-star">✦</span> FAQ
            </div>
            <h2 className="faq-title">Got Questions? <br /> We Got Answers</h2>
            <p className="faq-subtitle">
              Straightforward, no-fluff answers to help you feel confident about working with us.
            </p>
          </div>

          <div className="faq-right">
            {FAQ_DATA.map((item, index) => (
              <FAQItem 
                key={index} 
                question={item.question} 
                answer={item.answer} 
                isOpen={openFaqIndex === index} 
                onClick={() => toggleFaq(index)} 
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="cta-card" style={{ maxWidth: 800, padding: '40px 20px' }}>
          <div className="cta-content">
            <h2 className="cta-title" style={{ fontSize: '36px' }}>Let's Build Your Next Viral Video</h2>
            <a href="https://cal.com/viswavemedia/discovery" target="_blank" rel="noopener noreferrer" className="main-cta white" style={{ textDecoration: 'none' }}>
              Book a Call <div className="cta-circle orange"><ArrowRight /></div>
            </a>
          </div>
          <div className="cta-bg-particles">
             <div className="p-dot d1" /> <div className="p-dot d2" /> <div className="p-dot d3" />
          </div>
        </div>
      </section>
    </div>
  );
}

function HomePage({ handleNavigate, openFaqIndex, toggleFaq }) {
  return (
    <>
      <section className="hero-section" id="hero">
        <div className="hero-content">
          <div className="hero-text-area">
            <div className="trust-pill" onClick={() => handleNavigate('reviews')}>
              <div className="avatar-group">
                {TRUSTED_AVATARS.map((src, i) => (
                  <img key={i} src={src} className="avatar-img" alt="Trusted Creator" />
                ))}
              </div>
              <span>Trusted By 20+ Creators</span>
            </div>
            <h1 className="main-title">
              Video Edits <br /> That <span className="orange-text">Stand Out!</span>
            </h1>
            <p className="sub-text">
              Hook faster. Edit smarter. Grow your audience with scroll-stopping YouTube videos.
            </p>
            <button className="main-cta" onClick={() => handleNavigate('contact')}>
              Book a Call <div className="cta-circle"><ArrowRight /></div>
            </button>
            <p className="caption">No pressure, just possibilities.</p>
          </div>

          <div className="hero-visual-area desktop-only">
             <div className="hero-glow glow-1" />
             <div className="hero-glow glow-2" />

            <div className="floating-card card-1">
              <div className="card-user">
                <div className="user-img" />
                <div>
                    <div style={{fontWeight: 700, fontSize: 14}}>@tomas</div>
                    <div style={{fontSize: 12, opacity: 0.6}}>YouTuber, 1.2M Subs</div>
                </div>
              </div>
              <p>Bestest Edit in 48 hours. 🔥</p>
              <div className="card-actions">
                 <div style={{display:'flex', gap: 10}}><span>👍</span> <span>👎</span></div>
                 <span className="reply">Reply</span>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-user">
                <div className="user-img" />
                <div>
                    <div style={{fontWeight: 700, fontSize: 14}}>@mark_locus</div>
                    <div style={{fontSize: 12, opacity: 0.6}}>Creator, 500k Subs</div>
                </div>
              </div>
              <p>This edit boosted my retention rate by 35%!</p>
              <div className="card-actions">
                 <div style={{display:'flex', gap: 10}}><span>👍</span> <span>👎</span></div>
                 <span className="reply">Reply</span>
              </div>
            </div>
          </div>
        </div>

        <div className="marquee-bar">
          <div className="marquee-track">
            <span>✦ Fast Delivery</span><span>✦ 500+ Videos Delivered</span><span>✦ 2x Engagement Boost</span><span>✦ 4.9 Stars Rating</span>
            <span>✦ Fast Delivery</span><span>✦ 500+ Videos Delivered</span><span>✦ 2x Engagement Boost</span><span>✦ 4.9 Stars Rating</span>
            <span>✦ Fast Delivery</span><span>✦ 500+ Videos Delivered</span><span>✦ 2x Engagement Boost</span><span>✦ 4.9 Stars Rating</span>
            <span>✦ Fast Delivery</span><span>✦ 500+ Videos Delivered</span><span>✦ 2x Engagement Boost</span><span>✦ 4.9 Stars Rating</span>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-pill">
          <span className="rotating-star">✦</span> About 
        </div>
        <h2 className="about-title">
          We’re the Editing Partners Behind the <br />
          Creators Who Actually Grow with <br />
          Results. <span className="orange-text">Fast, Reliable</span> and <span className="orange-text">Obsessed</span>.
        </h2>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number"><AnimatedNumber value="300+" /></div>
            <div className="stat-label">Videos Delivered</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number"><AnimatedNumber value="20+" /></div>
            <div className="stat-label">Creators Served</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number"><AnimatedNumber value="40M+" /></div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="services-pill">
          <span className="rotating-star">✦</span> Services
        </div>
        <h2 className="services-title">What We Do Best</h2>
        <p className="services-subtitle">
          We craft scroll-stopping edits that keep your audience <br />
          hooked and your content looking top-tier.
        </p>
        
        <InteractiveServices />
        
      </section>

      <section className="process-section" id="process">
        <div className="process-pill">
          <span className="rotating-star">✦</span> Process
        </div>
        <h2 className="process-title">How It Works</h2>
        <p className="process-subtitle">
          A quick overview of how we work together to make your <br />
          content best in class.
        </p>

        <div className="process-grid">
          {PROCESS_STEPS.map((step, index) => (
            <div className="process-card" key={index}>
              <div className="step-header">
                <span className="step-num">{step.num}</span>
              </div>
              <div className="step-visual-wrapper">
                {step.visual}
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="solution-section" id="solution">
        <div className="solution-pill">
          <span className="rotating-star">✦</span> Our Solution
        </div>
        <h2 className="solution-title">Why Most Creators Burn Out</h2>
        <p className="solution-subtitle">
          A quick side-by-side of the struggles you shouldn't have to <br />
          deal with and how we make sure you don't.
        </p>

        <div className="comparison-container">
          <div className="comparison-side problem-side">
            <h3 className="side-title">Creators Problem</h3>
            <ul className="comparison-list">
              {SOLUTION_DATA.problems.map((item, i) => (
                <li key={i}>
                  <div className="icon-box cross"><CrossIcon /></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="comparison-side solution-side">
            <h3 className="side-title orange-text">Our Solution</h3>
            <ul className="comparison-list">
              {SOLUTION_DATA.solutions.map((item, i) => (
                <li key={i}>
                  <div className="icon-box check"><CheckIcon /></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="pricing-pill">
          <span className="rotating-star">✦</span> Pricing
        </div>
        <h2 className="pricing-title">Simple Plans</h2>
        <p className="pricing-subtitle">
          Whether you're uploading weekly or scaling fast, we've got <br />
          a plan tailored to your content flow.
        </p>

        <div className="pricing-grid">
          <div className="pricing-card light">
            <div className="plan-header">
              <h3>Starter Plan</h3>
              <div className="price-tag">$899<span className="period">/month</span></div>
              <p className="plan-desc">For growing creators who post 4-6 videos/month</p>
            </div>
            <button className="plan-btn" onClick={() => handleNavigate('contact')}>
              Book a Call <ArrowRight />
            </button>
            <div className="plan-features">
              <span>Features included:</span>
              <ul>
                <li><StarBullet /> Up to 6 Videos/month</li>
                <li><StarBullet /> Revisions 2 per video</li>
                <li><StarBullet /> Basic color grading and audio sync</li>
                <li><StarBullet /> 72 hour turnaround</li>
                <li><StarBullet /> Email support</li>
              </ul>
            </div>
          </div>

          <div className="pricing-card light popular">
            <div className="popular-badge">Popular</div>
            <div className="plan-header">
              <h3>Pro Plan</h3>
              <div className="price-tag">$1599<span className="period">/month</span></div>
              <p className="plan-desc">For scaling creators who need volume & speed</p>
            </div>
            <button className="plan-btn" onClick={() => handleNavigate('contact')}>
              Book a Call <ArrowRight />
            </button>
            <div className="plan-features">
              <span>Features included:</span>
              <ul>
                <li><StarBullet /> Up to 20 Videos/month</li>
                <li><StarBullet /> Revisions 5 per video</li>
                <li><StarBullet /> Advance color grading and audio sync</li>
                <li><StarBullet /> 48 hour turnaround</li>
                <li><StarBullet /> Video Call Support</li>
              </ul>
            </div>
          </div>

          <div className="pricing-card dark full-width">
            <div className="custom-content">
              <div className="plan-header">
                <h3>Custom Plan</h3>
                <div className="price-tag">???<span className="period">/month</span></div>
                <p className="plan-desc">For growing creators who post 4-6 videos/month</p>
                <button className="plan-btn orange" onClick={() => handleNavigate('contact')}>
                  Book a Call <ArrowRight />
                </button>
              </div>
              <div className="plan-features two-col">
                <span>Features included:</span>
                <ul>
                  <li><StarBullet /> Choose from 10 to 40+ Video Edits</li>
                  <li><StarBullet /> 24h / 48h / 72h Delivery</li>
                  <li><StarBullet /> Title, thumbnail, and retention tips</li>
                  <li><StarBullet /> Shorts, Reels, long-form, podcasts</li>
                  <li><StarBullet /> One edit = multi-channel assets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-section" id="reviews">
        <div className="reviews-pill">
          <span className="rotating-star">✦</span> Reviews
        </div>
        <h2 className="reviews-title">Results That Speak For Themselves</h2>
        <p className="reviews-subtitle">
          See why top creators trust us to handle their <br />most important content.
        </p>
        
        <div className="reviews-marquee-container">
          <div className="reviews-track">
             {[...REVIEWS_DATA, ...REVIEWS_DATA, ...REVIEWS_DATA].map((review, i) => (
                <div className="review-card" key={i}>
                   <p className="review-text">"{review.text}"</p>
                   <div className="reviewer-info">
                      {review.img && <img src={review.img} className="reviewer-img" alt={review.name} />}
                      {!review.img && <div className="reviewer-avatar" />}
                      
                      <div>
                         <div className="reviewer-name">{review.name}</div>
                         <div className="reviewer-role">{review.role}</div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="video-testimonials-grid">
          {VIDEO_TESTIMONIALS.map((testimonial, index) => (
            <div className="video-block" key={index}>
              <DynamicYouTubeCard 
                 videoId={testimonial.videoId} 
                 type="portrait" 
                 showViews={false} 
                 showTitle={false}
              />
              <div className="video-info">
                <div className="v-name">{testimonial.name}</div>
                <div className="v-role">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-grid">
          <div className="faq-left">
            <div className="faq-pill">
              <span className="rotating-star">✦</span> FAQ
            </div>
            <h2 className="faq-title">Got Questions? <br /> We Got Answers</h2>
            <p className="faq-subtitle">
              Straightforward, no-fluff answers to help you feel confident about working with us.
            </p>
          </div>

          <div className="faq-right">
            {FAQ_DATA.map((item, index) => (
              <FAQItem 
                key={index} 
                question={item.question} 
                answer={item.answer} 
                isOpen={openFaqIndex === index} 
                onClick={() => toggleFaq(index)} 
              />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" id="contact">
        <div className="cta-card">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Level Up?</h2>
            <p className="cta-subtitle">
              Whether it’s a one-off edit or a full channel transformation, <br />
              we’re ready when you are. Let’s talk ideas.
            </p>
            <a 
              href="https://cal.com/viswavemedia/discovery" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="main-cta white"
              style={{ textDecoration: 'none' }}
            >
              Book a Call <div className="cta-circle orange"><ArrowRight /></div>
            </a>
          </div>
          
          <div className="float-pill p1 dark">From meh to wow!</div>
          <div className="float-pill p2 orange">No Editor? No Problem</div>
          <div className="float-pill p3 dark">Watch Time Wins</div>
          <div className="float-pill p4 orange">Conversion Boost</div>
          <div className="float-pill p5 dark">Low Views? Fixed</div>
          
          <div className="cta-bg-particles">
             <div className="p-dot d1" />
             <div className="p-dot d2" />
             <div className="p-dot d3" />
          </div>
        </div>
      </section>
    </>
  );
}

function Header({ onNavigate, theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="nav-container">
      <div className="nav-wrapper">
        <div className="nav-left" onClick={() => onNavigate("hero")}>
          <span className="brand-name">VisWave <span>Media</span></span>
        </div>

        <div className="nav-center desktop-only">
          <button onClick={() => onNavigate("about")}>About</button>
          <button onClick={() => onNavigate("services")}>Services</button>
          <button onClick={() => onNavigate("work")}>Work</button>
          <button onClick={() => onNavigate("process")}>Process</button>
          <button onClick={() => onNavigate("pricing")}>Pricing</button>
          <button onClick={() => onNavigate("reviews")}>Reviews</button>
          <button onClick={() => onNavigate("faq")}>FAQ</button>
        </div>

        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="nav-cta desktop-only" onClick={() => onNavigate("contact")}>
            Contact <div className="circle-arrow"><ArrowRight /></div>
          </button>
          <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <button onClick={() => {onNavigate("about"); setIsMenuOpen(false)}}>About</button>
          <button onClick={() => {onNavigate("services"); setIsMenuOpen(false)}}>Services</button>
          <button onClick={() => {onNavigate("work"); setIsMenuOpen(false)}}>Work</button>
          <button onClick={() => {onNavigate("process"); setIsMenuOpen(false)}}>Process</button>
          <button onClick={() => {onNavigate("pricing"); setIsMenuOpen(false)}}>Pricing</button>
          <button onClick={() => {onNavigate("reviews"); setIsMenuOpen(false)}}>Reviews</button>
          <button onClick={() => {onNavigate("faq"); setIsMenuOpen(false)}}>FAQ</button>
          <button onClick={() => {onNavigate("contact"); setIsMenuOpen(false)}}>Book a Call</button>
      </div>
    </nav>
  );
}

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={onClick}>
      <div className="faq-question">
        <span>{question}</span>
        <div className={`chevron ${isOpen ? 'rotate' : ''}`}><ChevronDown /></div>
      </div>
      <div className="faq-answer">
        <div className="answer-inner">{answer}</div>
      </div>
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        <div className="footer-top">
          <div className="footer-col brand-col">
            <div className="footer-logo">VisWave <span>Media</span></div>
            <p className="footer-tagline">
              Helping youtubers stand out with pro edits, fast delivery and what not!
            </p>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <div className="footer-links">
              <button onClick={() => onNavigate("hero")}>Home</button>
              <button onClick={() => onNavigate("about")}>About</button>
              <button onClick={() => onNavigate("services")}>Services</button>
              <button onClick={() => onNavigate("work")}>Work</button>
              <button onClick={() => onNavigate("process")}>Process</button>
              <button onClick={() => onNavigate("reviews")}>Reviews</button>
              <button onClick={() => onNavigate("faq")}>FAQ</button>
            </div>
          </div>

          <div className="footer-col">
            <h4>Legal Pages</h4>
            <div className="footer-links">
              <button>Privacy Policy</button>
              <button>Terms of Services</button>
              <button>Refund Policy</button>
            </div>
          </div>

          <div className="footer-col">
            <h4>Socials & Contact</h4>
            <div className="footer-links">
              <a href="#" className="social-link"><TwitterIcon /> Twitter</a>
              <a href="https://www.linkedin.com/company/viswavemedia" className="social-link"><LinkedInIcon /> LinkedIn</a>
              <a href="https://www.instagram.com/viswavemedia/" className="social-link"><InstagramIcon /> Instagram</a>
            </div>
            <div className="contact-details">
              <div className="contact-item"><MailIcon /> <span>hello@viswavemedia.com</span></div>
              <div className="contact-item"><PhoneIcon /> <span>+91 8280669173</span></div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Copyright © 2026 to <a href="https://www.instagram.com/viswavemedia/">VisWave Media</a></span>
          <span>Made with ❤️ by <a href="https://aakaario.com">Aakaar.io</a></span>
        </div>

        <div className="footer-particles">
           <div className="fp d1" />
           <div className="fp d2" />
           <div className="fp d3" />
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button 
      className={`back-to-top ${isVisible ? 'visible' : ''}`} 
      onClick={() => slowScrollTo(0)}
      aria-label="Back to top"
    >
      <ArrowUp />
    </button>
  );
}

function MadeInBadge() {
  return (
    <a 
      href="https://aakaario.com" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="made-in-badge"
    >
      <div className="badge-logo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 19h20L12 2zm0 3.8L18.5 17h-13L12 5.8z" />
        </svg>
      </div>
      <span className="badge-text">Made in Aakaar.io</span>
    </a>
  );
}

function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [videoId, setVideoId] = useState('');
  const [category, setCategory] = useState('longForm');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchVideos();
    });
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const fetchVideos = async () => {
    const { data } = await supabase.from('portfolio_videos').select('*').order('created_at', { ascending: false });
    if (data) setVideos(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    let finalId = videoId;
    if (videoId.includes('v=')) finalId = videoId.split('v=')[1].split('&')[0];
    else if (videoId.includes('youtu.be/')) finalId = videoId.split('youtu.be/')[1].split('?')[0];

    await supabase.from('portfolio_videos').insert([{ video_id: finalId, category }]);
    setVideoId('');
    fetchVideos();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await supabase.from('portfolio_videos').delete().match({ id });
    fetchVideos();
  };

  if (!session) {
    return (
      <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 120 }}>
        <div className="pricing-card dark" style={{ width: 400, maxWidth: '90%' }}>
          <h2 style={{ marginBottom: 20 }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 12, borderRadius: 8, background: '#222', border: '1px solid #333', color: '#fff' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 8, background: '#222', border: '1px solid #333', color: '#fff' }} />
            <button type="submit" className="plan-btn orange" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ paddingTop: 120, paddingBottom: 60, paddingLeft: 24, paddingRight: 24 }}>
      <div className="work-container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
           <h2 className="work-title">Portfolio Manager</h2>
           <button onClick={() => supabase.auth.signOut()} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: 8, cursor: 'pointer' }}>Sign Out</button>
        </div>

        <div className="pricing-card dark" style={{ marginBottom: 40 }}>
          <h3>Add New Video</h3>
          <form onSubmit={handleAddVideo} style={{ display: 'flex', gap: 15, marginTop: 20, flexWrap: 'wrap' }}>
            <input type="text" placeholder="YouTube URL or Video ID" value={videoId} onChange={e => setVideoId(e.target.value)} required style={{ flex: 1, minWidth: 200, padding: 12, borderRadius: 8, background: '#222', border: '1px solid #333', color: '#fff' }} />
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: 12, borderRadius: 8, background: '#222', border: '1px solid #333', color: '#fff' }}>
              <option value="featured">Featured (Big Top Video)</option>
              <option value="longForm">Long Form (Landscape)</option>
              <option value="shorts">Short Form (Portrait)</option>
            </select>
            <button type="submit" className="plan-btn orange" style={{ width: 'auto', margin: 0 }} disabled={loading}>+ Add</button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {videos.map(v => (
            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, background: '#111', border: '1px solid #333', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <img src={`https://i.ytimg.com/vi/${v.video_id}/mqdefault.jpg`} style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 6 }} alt="thumb" />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{v.video_id}</div>
                  <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>{v.category}</div>
                </div>
              </div>
              <button onClick={() => handleDelete(v.id)} style={{ padding: '8px 16px', background: 'rgba(255, 77, 77, 0.15)', color: '#ff4d4d', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 7. MAIN APP COMPONENT (ROUTER)
// ──────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => { 
    document.body.className = theme; 
  }, [theme]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateToPage = (path) => {
    window.scrollTo(0, 0);
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  const handleNavigate = (id) => {
    if (id === 'work') {
      navigateToPage('/our-work');
      return;
    }

    if (currentPath !== '/') {
      navigateToPage('/');
      
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // Fixes the scroll offset so marquee doesn't leak into the next section
          const yOffset = -80; 
          const targetY = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          slowScrollTo(targetY);
        }
      }, 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      // Fixes the scroll offset so marquee doesn't leak into the next section
      const yOffset = -80; 
      const targetY = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      slowScrollTo(targetY);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="app-shell">
      <CustomCursor />
      <GlobalStyles />
      <Header onNavigate={handleNavigate} theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      
      <div className="page-transition" key={currentPath}>
        {currentPath === '/admin' ? (
          <AdminPage />
        ) : currentPath === '/our-work' ? (
          <WorkPage 
             openFaqIndex={openFaqIndex} 
             toggleFaq={toggleFaq} 
          />
        ) : (
          <HomePage 
             handleNavigate={handleNavigate} 
             openFaqIndex={openFaqIndex} 
             toggleFaq={toggleFaq} 
          />
        )}
      </div>
      
      <BackToTop />
      <Footer onNavigate={handleNavigate} />
      <MadeInBadge />

    </div>
  );
}

// ──────────────────────────────────────────
// 8. GLOBAL STYLES
// ──────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      :root {
        --bg: #ffffff; --text: #000000; --text-light: #666; --accent: #ff5c00;
        --grid: rgba(0,0,0,0.02); --header-bg: rgba(255,255,255,0.85);
        --card: #fff; --shadow: 0 20px 40px rgba(0,0,0,0.08);
        --border: #e5e5e5;
      }

      body.dark {
        --bg: #0c0c0c; --text: #ffffff; --text-light: #999;
        --grid: rgba(255,255,255,0.015); --header-bg: rgba(12,12,12,0.85);
        --card: #161616; --shadow: 0 20px 40px rgba(0,0,0,0.4);
        --border: #333;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      
      html { scroll-behavior: auto; cursor: none; }

      body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

      .app-shell {
        background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
        background-size: 10px 10px; 
        background-attachment: fixed;
        min-height: 100vh;
      }

      /* CUSTOM CURSOR */
      .custom-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 12px;
        height: 12px;
        background-color: var(--accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate3d(-100px, -100px, 0);
        transition: transform 0.1s ease-out, width 0.3s ease, height 0.3s ease, margin 0.3s ease, background-color 0.3s ease, border 0.3s ease;
      }

      .custom-cursor.hovered {
        width: 40px;
        height: 40px;
        margin-top: -14px; 
        margin-left: -14px; 
        background-color: var(--accent);
        border: none;
      }

      /* SMOOTH PAGE TRANSITIONS */
      .page-transition {
        animation: smoothFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      @keyframes smoothFade {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Navbar */
      .nav-container { position: fixed; top: 0; width: 100%; height: 80px; background: var(--header-bg); backdrop-filter: blur(12px); z-index: 1000; display: flex; justify-content: center; border-bottom: 1px solid var(--grid); cursor: none;}
      .nav-wrapper { width: 95%; max-width: 1400px; display: flex; justify-content: space-between; align-items: center; }
      .nav-left { display: flex; align-items: center; gap: 10px; cursor: none; }
      .brand-name { font-weight: 800; font-size: 22px; letter-spacing: -0.5px; }
      .brand-name span { color: var(--accent); }
      .nav-center { display: flex; gap: 32px; }
      .nav-center button { background: none; border: none; font-weight: 600; color: var(--text-light); cursor: none; font-size: 14px; transition: 0.2s; }
      .nav-center button:hover { color: var(--accent); }
      .nav-right { display: flex; align-items: center; gap: 16px; }
      .theme-toggle { background: none; border: none; color: var(--text); cursor: none; display: flex; padding: 8px; border-radius: 50%; transition: background 0.3s; }
      .theme-toggle:hover { background: var(--grid); }
      .nav-cta { background: var(--text); color: var(--bg); padding: 10px 20px; border-radius: 50px; display: flex; align-items: center; gap: 10px; font-weight: 700; border: 2px solid transparent; cursor: none; font-size: 14px; transition: all 0.3s ease; }
      .nav-cta:hover { background: var(--accent); color: #fff; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 92, 0, 0.3); }
      .circle-arrow { background: var(--bg); color: var(--text); width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
      .nav-cta:hover .circle-arrow { background: #fff; color: var(--accent); }
      .mobile-toggle { display: none; background: none; border: none; color: var(--text); cursor: none; }
      
      .mobile-menu { 
        position: fixed; top: 80px; left: 0; width: 100%; height: calc(100vh - 80px); background: var(--bg); padding: 40px 24px;
        display: flex; flex-direction: column; gap: 20px; border-top: 1px solid var(--grid);
        transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 999;
      }
      .mobile-menu.open { transform: translateX(0); }
      .mobile-menu button { background: transparent; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 700; color: var(--text); text-align: left; padding: 10px 0; cursor: none; transition: all 0.2s; border-bottom: 1px solid var(--grid); }
      .mobile-menu button:hover { color: var(--accent); padding-left: 10px; }
      .mobile-menu button:last-child { border-bottom: none; }

      .main-cta { background: var(--text); color: var(--bg); padding: 16px 32px; border-radius: 100px; font-size: 16px; font-weight: 700; border: 2px solid transparent; cursor: none; display: flex; align-items: center; gap: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
      .main-cta:hover { background: var(--bg); color: var(--text); border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
      .cta-circle { background: var(--bg); color: var(--text); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
      .main-cta:hover .cta-circle { background: var(--accent); color: #fff; }
      .main-cta.white { background: #fff; color: #000; box-shadow: 0 10px 25px rgba(255,255,255,0.1); }
      .main-cta.white:hover { background: #eee; transform: translateY(-3px); }
      .cta-circle.orange { background: var(--accent); color: #fff; }

      /* Hero Section */
      .hero-section { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; padding-top: 80px; overflow: hidden; }
      .hero-content { width: 100%; max-width: 1100px; display: grid; grid-template-columns: 1fr 400px; gap: 20px; padding: 0 24px; margin-bottom: 40px; align-items: center; }
      
      .trust-pill { background: var(--card); border: 1px solid var(--border); padding: 8px 16px; border-radius: 50px; display: inline-flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 700; margin-bottom: 30px; box-shadow: var(--shadow); cursor: none; transition: transform 0.2s ease; }
      .trust-pill:hover { transform: scale(1.05); }

      .avatar-group { display: flex; }
      .avatar-img { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 2px solid var(--card); margin-left: -10px; }
      .avatar-img:first-child { margin-left: 0; }
      .main-title { font-size: clamp(48px, 6vw, 80px); font-weight: 800; line-height: 1; letter-spacing: -2px; margin-bottom: 24px; }
      .orange-text { color: var(--accent); }
      .sub-text { font-size: 18px; color: var(--text-light); max-width: 480px; line-height: 1.6; margin-bottom: 40px; }
      .caption { font-size: 13px; color: var(--text-light); margin-top: 16px; font-weight: 500; }
      .hero-visual-area { position: relative; height: 400px; width: 400px; }

      .hero-glow {
        position: absolute;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255, 92, 0, 0.4) 0%, rgba(255, 92, 0, 0) 70%);
        border-radius: 50%;
        filter: blur(40px);
        z-index: 0;
        pointer-events: none;
      }
      .glow-1 { top: -50px; right: -20px; animation: pulseGlow 4s infinite alternate ease-in-out; }
      .glow-2 { bottom: 50px; left: 0px; animation: pulseGlow 6s infinite alternate-reverse ease-in-out; }
      @keyframes pulseGlow { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0.8; } }

      .floating-card { position: absolute; background: var(--card); padding: 24px; border-radius: 24px; width: 320px; border: 1px solid var(--border); box-shadow: var(--shadow); animation: floatAnim 6s infinite ease-in-out; z-index: 2; }
      .card-1 { top: 0px; right: 0px; transform: rotate(-3deg); z-index: 2; --r: -3deg; }
      .card-2 { top: 130px; right: 80px; transform: rotate(3deg); animation-delay: 2s; z-index: 1; --r: 3deg; }
      @keyframes floatAnim { 0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); } 50% { transform: translateY(-15px) rotate(var(--r, 0deg)); } }
      .card-user { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
      .user-img { width: 40px; height: 40px; border-radius: 50%; background: #eee; }
      .card-actions { display: flex; justify-content: space-between; margin-top: 16px; font-size: 13px; font-weight: 700; color: var(--text-light); align-items: center; }
      .reply { color: var(--accent); cursor: none; }
      
      .marquee-bar { 
        position: absolute; bottom: 0; width: 100%; border-top: 1px solid var(--bg); padding: 12px 0; background: var(--bg); overflow: hidden; 
        mask-image: linear-gradient(to right, transparent, black 25%, black 85%, transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, black 25%, black 85%, transparent);
      }
      .marquee-track { display: flex; gap: 60px; width: max-content; animation: scrollMarquee 45s linear infinite; }
      .marquee-track span { white-space: nowrap; font-weight: 700; font-size: 14px; color: var(--text-light); text-transform: uppercase; letter-spacing: 2px; }
      @keyframes scrollMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

      /* About Section */
      .about-section { padding: 120px 24px 60px; display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; max-width: 1000px; margin: 0 auto; }
      .about-pill { background: var(--card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--text-light); margin-bottom: 15px; box-shadow: var(--shadow); }
      @keyframes starRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .rotating-star { display: inline-block; color: var(--accent); animation: starRotate 4s linear infinite; margin-right: 4px; }
      .about-title { font-size: clamp(32px, 5vw, 48px); font-weight: 800; line-height: 1.15; letter-spacing: -1px; margin: 10px 0 40px; }
      .stats-container { display: flex; align-items: center; background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 40px 60px; box-shadow: var(--shadow); gap: 60px; }
      .stat-item { display: flex; flex-direction: column; align-items: center; min-width: 140px; }
      .stat-number { font-size: 42px; font-weight: 800; color: var(--accent); line-height: 1; margin-bottom: 8px; }
      .stat-label { font-size: 14px; color: var(--text-light); font-weight: 600; }
      .stat-divider { width: 1px; height: 50px; background: var(--border); }

      /* NEW Interactive Services Section */
      .services-section { padding: 60px 24px 60px; display: flex; flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto; }
      .services-pill { background: var(--card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--text-light); margin-bottom: 20px; box-shadow: var(--shadow); }
      .services-title { font-size: clamp(32px, 5vw, 42px); font-weight: 800; margin-bottom: 15px; }
      .services-subtitle { color: var(--text-light); text-align: center; line-height: 1.5; margin-bottom: 20px; }
      
      .interactive-services-container { display: flex; gap: 60px; width: 100%; align-items: center; margin-top: 40px; }
      .is-left { flex: 1; display: flex; flex-direction: column; }
      
      .is-row { padding: 30px 0; border-bottom: 1px solid var(--border); cursor: none; opacity: 0.5; transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
      .is-row:first-child { border-top: 1px solid var(--border); }
      .is-row.active, .is-row:hover { opacity: 1; transform: translateX(15px); }
      .is-row.active .is-title, .is-row:hover .is-title { color: var(--accent); }
      
      .is-row-header { display: flex; align-items: center; gap: 20px; }
      .is-mobile-content { display: none; }

      .is-num { font-size: 16px; font-weight: 700; color: var(--text-light); }
      .is-title { font-size: clamp(28px, 4vw, 42px); font-weight: 800; letter-spacing: -1px; transition: color 0.3s ease; margin: 0; }
      
      .is-right { flex: 1.2; position: relative; height: 450px; }
      .is-visual-wrapper { position: relative; width: 100%; height: 100%; border-radius: 32px; overflow: hidden; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow); }
      
      .is-visual-content { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.5s ease, transform 0.5s ease; transform: translateY(20px) scale(0.98); }
      .is-visual-content.active { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
      
      .is-img-placeholder { position: absolute; inset: 0; background: #000; z-index: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; }
      body.light .is-img-placeholder { background: #f8f8f8; }

      /* ----- CUSTOM CSS VISUALS FOR SERVICES (Centered with original sizes) ----- */
      .srv-visual { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; margin: 0 auto; }
      
      /* Shorts Feed Scroll */
      .phone-mockup { width: 120px; height: 240px; border: 4px solid #222; border-radius: 20px; background: #000; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .shorts-scroll-track { display: flex; flex-direction: column; width: 100%; animation: scrollShorts 8s infinite cubic-bezier(0.77, 0, 0.17, 1); }
      .short-item { width: 100%; height: 228px; flex-shrink: 0; position: relative; display: flex; flex-direction: column; justify-content: flex-end; padding: 12px; border-bottom: 2px solid #111; }
      .s-item-1 { background: linear-gradient(135deg, #1a1a1a, #333); }
      .s-item-2 { background: linear-gradient(135deg, var(--accent), #ff8c00); }
      .s-item-3 { background: linear-gradient(135deg, #0d324d, #7f5a83); }
      
      .s-play-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: rgba(255,255,255,0.8); }
      .s-play-center svg { width: 24px; height: 24px; }
      .s-ui { display: flex; flex-direction: column; gap: 6px; z-index: 2; }
      .s-avatar { width: 24px; height: 24px; background: rgba(255,255,255,0.5); border-radius: 50%; }
      .s-line { width: 80%; height: 6px; background: rgba(255,255,255,0.4); border-radius: 4px; }
      .s-line.short { width: 50%; }
      
      @keyframes scrollShorts {
        0%, 25% { transform: translateY(0); }
        33%, 58% { transform: translateY(-228px); }
        66%, 91% { transform: translateY(-456px); }
        100% { transform: translateY(0); }
      }

      /* Long Form */
      .editor-window { width: 220px; height: 160px; background: #222; border-radius: 12px; border: 1px solid #333; display: flex; flex-direction: column; padding: 10px; gap: 10px; }
      .preview-pane { flex: 1; background: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--accent); }
      .preview-pane svg { width: 24px; height: 24px; }
      .timeline-mini { height: 30px; display: flex; gap: 5px; }
      .t-block { height: 100%; background: rgba(255,255,255,0.1); border-radius: 4px; transition: background 0.3s; }
      .t-block.highlight { background: var(--accent); animation: pulseBlock 2s infinite; }
      @keyframes pulseBlock { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

      /* Thumbnail */
      .thumb-card { width: 200px; display: flex; flex-direction: column; gap: 10px; }
      .thumb-img { width: 100%; height: 110px; background: #222; border-radius: 12px; border: 1px solid #333; position: relative; display: flex; align-items: center; justify-content: center; }
      .ctr-badge { background: #4fff88; color: #000; padding: 6px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 15px rgba(79, 255, 136, 0.3); animation: bounceBadge 2s infinite; }
      .ctr-badge svg { width: 12px; height: 12px; }
      .thumb-title-line { width: 80%; height: 12px; background: rgba(255,255,255,0.2); border-radius: 4px; }
      .thumb-desc-line { width: 60%; height: 10px; background: rgba(255,255,255,0.1); border-radius: 4px; }
      @keyframes bounceBadge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px) scale(1.05); } }

      /* Content Repurposing (Properly Centered) */
      .v-repurpose { width: 280px; height: 180px; display: flex; align-items: center; justify-content: space-between; position: relative; margin: 0 auto; }
      .branch-lines { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
      .branch-lines path { fill: none; stroke: rgba(255,255,255,0.2); stroke-width: 2; stroke-dasharray: 6; animation: flowDash 20s linear infinite; }
      body.light .branch-lines path { stroke: rgba(0,0,0,0.2); }
      @keyframes flowDash { to { stroke-dashoffset: -400; } }

      .source-node { width: 80px; height: 50px; background: #111; border: 2px solid #333; border-radius: 8px; z-index: 1; display: flex; align-items: center; justify-content: center; color: var(--text-light); position: relative; overflow: hidden; margin: 0; }
      .source-node svg { width: 24px; height: 24px; }
      .source-node::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); animation: shine 3s infinite; }
      @keyframes shine { 100% { left: 200%; } }

      .output-nodes { display: flex; flex-direction: column; justify-content: space-between; height: 100%; z-index: 1; padding: 10px 0; margin: 0; }
      .out-node { width: 44px; height: 44px; background: #111; border: 2px solid #333; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; transition: all 0.3s; animation: floatNode 3s infinite ease-in-out; }
      .out-node svg { width: 20px; height: 20px; }
      .n-yt { color: #ff0000; border-color: rgba(255,0,0,0.3); }
      .n-ig { color: #E1306C; border-color: rgba(225,48,108,0.3); animation-delay: -1s; }
      .n-tk { color: #00f2fe; border-color: rgba(0,242,254,0.3); animation-delay: -2s; }
      @keyframes floatNode { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

      /* Light mode tweaks for visuals */
      body.light .phone-mockup { background: #fff; border-color: #e5e5e5; }
      body.light .editor-window { background: #fff; border-color: #e5e5e5; }
      body.light .preview-pane { background: #f5f5f5; }
      body.light .t-block { background: rgba(0,0,0,0.05); }
      body.light .thumb-img { background: #fff; border-color: #e5e5e5; }
      body.light .thumb-title-line { background: rgba(0,0,0,0.2); }
      body.light .thumb-desc-line { background: rgba(0,0,0,0.1); }
      body.light .source-node { background: #fff; border-color: #ccc; }
      body.light .out-node { background: #fff; }
      /* ------------------------------------------- */

      .is-text-content { position: relative; z-index: 1; padding: 40px; background: linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent); height: 100%; display: flex; flex-direction: column; justify-content: flex-end; }
      body.light .is-text-content { background: linear-gradient(to top, rgba(255,255,255,0.95) 20%, transparent); }
      
      .is-desc { font-size: 16px; color: rgba(255,255,255,0.9); line-height: 1.6; margin-bottom: 24px; font-weight: 500; }
      body.light .is-desc { color: var(--text); }
      
      .is-tags { display: flex; flex-wrap: wrap; gap: 10px; }
      .service-tag { background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
      body.light .service-tag { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1); color: var(--text); }
      .tag-dot { color: var(--accent); font-size: 12px; }

      /* Portfolio / Work Section */
      .page-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
      .work-section { padding: 60px 24px 60px; background: transparent; position: relative; }
      .work-section.page-mode { padding-top: 140px; flex-grow: 1; }
      .work-container { max-width: 1200px; margin: 0 auto; }
      .shorts-container { margin-top: 100px; }
      .section-header-left { margin-bottom: 40px; border-left: 4px solid var(--accent); padding-left: 20px; }
      .work-title { font-size: clamp(32px, 5vw, 56px); font-weight: 800; text-transform: uppercase; letter-spacing: -1px; line-height: 1; margin-bottom: 10px; }
      .work-subtitle { font-size: 14px; font-weight: 700; color: var(--text-light); letter-spacing: 1px; text-transform: uppercase; }
      
      /* Grid Layouts for Portfolio */
      .feat-video-wrapper { width: 100%; aspect-ratio: 16 / 9; border-radius: 24px; overflow: hidden; margin-bottom: 30px; box-shadow: var(--shadow); }
      .standard-video-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
      .shorts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
      @media(min-width: 1024px) { .shorts-grid { grid-template-columns: repeat(6, 1fr); } }

      /* Dynamic YouTube Card Styles */
      .portfolio-card { position: relative; background: #000; overflow: hidden; cursor: none; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.3s ease, border-color 0.3s ease; width: 100%; }
      .portfolio-card:hover { transform: translateY(-5px); border-color: var(--accent); }
      .portfolio-card.landscape { aspect-ratio: 16 / 9; }
      .portfolio-card.featured { width: 100%; height: 100%; border-radius: 0; border: none; }
      .portfolio-card.featured:hover { transform: none; }
      .portfolio-card.portrait { aspect-ratio: 9 / 16; }
      
      .p-thumb { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s; opacity: 0.8; }
      .portfolio-card:hover .p-thumb { opacity: 0.4; }
      
      .play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 2; pointer-events: none; }
      .play-btn-circle { width: 60px; height: 60px; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
      .portfolio-card:hover .play-btn-circle { transform: scale(1.2); background: var(--accent); }
      
      .p-title-overlay { 
         position: absolute; bottom: 0; left: 0; right: 0; 
         padding: 50px 20px 20px;
         background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
         color: white; font-weight: 700; font-size: 16px; 
         z-index: 2; pointer-events: none;
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
         overflow: hidden;
         text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      }
      
      .views-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(5px);
        color: white;
        padding: 6px 12px;
        border-radius: 50px;
        font-size: 12px;
        font-weight: 700;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: 6px;
        border: 1px solid rgba(255,255,255,0.1);
      }

      .p-iframe { width: 100%; height: 100%; border: none; }

      /* Process Section Original Sizing */
      .process-section { padding: 60px 24px 60px; display: flex; flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto; }
      .process-pill { background: var(--card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--text-light); margin-bottom: 20px; box-shadow: var(--shadow); }
      .process-title { font-size: clamp(32px, 5vw, 42px); font-weight: 800; margin-bottom: 15px; }
      .process-subtitle { color: var(--text-light); text-align: center; line-height: 1.5; margin-bottom: 60px; }
      .process-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; width: 100%; }
      .process-card { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 32px; padding: 30px; display: flex; flex-direction: column; min-height: 300px; position: relative; overflow: hidden; transition: transform 0.3s ease, border-color 0.3s ease; }
      body.light .process-card { background: #1a1a1a; }
      .process-card:hover { transform: translateY(-5px); border-color: var(--accent); }
      .step-header { margin-bottom: 20px; }
      .step-num { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 20px; }
      .step-visual-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; min-height: 120px; width: 100%; position: relative; }
      .step-content h3 { font-size: 20px; font-weight: 700; margin-bottom: 10px; color: #fff; }
      .step-content p { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6; }
      
      .proc-visual { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
      .v-upload .icon-circle { width: 50px; height: 50px; background: rgba(255,92,0,0.1); color: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; }
      .floating-file { position: absolute; width: 30px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 6px; }
      .f1 { top: 10px; left: 30%; transform: rotate(-15deg); animation: float 4s infinite ease-in-out; }
      .f2 { bottom: 10px; right: 30%; transform: rotate(15deg); animation: float 5s infinite ease-in-out reverse; }
      
      .v-magic { flex-direction: column; justify-content: center; }
      .magic-timeline { width: 80%; height: 60px; display: flex; flex-direction: column; justify-content: space-evenly; position: relative; }
      .timeline-track { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
      .t1::after { content:''; display:block; width: 40%; height:100%; background: #333; }
      .t2::after { content:''; display:block; width: 70%; height:100%; background: #444; }
      .t3::after { content:''; display:block; width: 50%; height:100%; background: #333; }
      .timeline-head { position: absolute; top:0; bottom:0; width: 2px; background: var(--accent); left: 0; animation: playhead 4s infinite linear; box-shadow: 0 0 10px var(--accent); }
      .magic-star { position: absolute; color: var(--accent); font-size: 18px; animation: spinStar 3s infinite linear; }
      .s1 { top: 0; right: 10%; } .s2 { bottom: 10%; left: 10%; animation-delay: 1.5s; }
      @keyframes playhead { 0% { left: 0; } 100% { left: 100%; } }
      @keyframes spinStar { 0% { transform: rotate(0deg) scale(0.8); opacity: 0.5; } 50% { transform: rotate(180deg) scale(1.2); opacity: 1; } 100% { transform: rotate(360deg) scale(0.8); opacity: 0.5; } }
      
      .v-feedback { flex-direction: column; gap: 10px; align-items: stretch; padding: 0 20px; }
      .chat-msg { padding: 8px 14px; border-radius: 12px; font-size: 12px; font-weight: 600; max-width: 80%; opacity: 0; }
      .left { align-self: flex-start; background: #333; color: #ccc; border-bottom-left-radius: 2px; transform-origin: bottom left; }
      .right { align-self: flex-end; background: var(--accent); color: #fff; border-bottom-right-radius: 2px; transform-origin: bottom right; }
      .msg-1 { animation: fadeMsg1 8s infinite; }
      .msg-2 { animation: fadeMsg2 8s infinite; }
      .msg-3 { animation: fadeMsg3 8s infinite; }
      @keyframes fadeMsg1 { 0% { opacity: 0; transform: translateY(10px) scale(0.9); } 5% { opacity: 1; transform: translateY(0) scale(1); } 85% { opacity: 1; transform: translateY(0) scale(1); } 90%, 100% { opacity: 0; transform: scale(1); } }
      @keyframes fadeMsg2 { 0%, 30% { opacity: 0; transform: translateY(10px) scale(0.9); } 35% { opacity: 1; transform: translateY(0) scale(1); } 85% { opacity: 1; transform: translateY(0) scale(1); } 90%, 100% { opacity: 0; transform: scale(1); } }
      @keyframes fadeMsg3 { 0%, 60% { opacity: 0; transform: translateY(10px) scale(0.9); } 65% { opacity: 1; transform: translateY(0) scale(1); } 85% { opacity: 1; transform: translateY(0) scale(1); } 90%, 100% { opacity: 0; transform: scale(1); } }

      .v-grow .file-preview { background: #222; border: 1px solid #333; padding: 10px 20px; border-radius: 8px; font-family: monospace; font-size: 10px; color: #888; position: absolute; top: 10px; transform: rotate(-3deg); }
      .upload-ui { width: 140px; height: 60px; position: absolute; bottom: 20px; display: flex; align-items: center; justify-content: center; }
      .upload-btn { width: 100px; height: 32px; background: var(--accent); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 12px; position: relative; overflow: hidden; animation: btnState 5s infinite; cursor: none;}
      .txt-publish { position: absolute; animation: hideText 5s infinite; }
      .txt-publishing { position: absolute; display: flex; flex-direction: column; align-items: center; opacity: 0; gap: 2px; animation: showText 5s infinite; }
      .upload-progress { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: rgba(0,0,0,0.2); opacity: 0; animation: showBar 5s infinite; }
      .upload-bar { height: 100%; background: #4fff88; width: 0%; transition: width 0.1s linear; }
      .upload-cursor { position: absolute; bottom: -20px; right: -20px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); animation: cursorAction 5s infinite; z-index: 10; }
      @keyframes cursorAction { 0% { transform: translate(40px, 40px); opacity: 0; } 15% { transform: translate(0, 0); opacity: 1; } 20% { transform: scale(0.8); } 25% { transform: scale(1); opacity: 1; } 35% { transform: translate(-10px, 10px); opacity: 0; } 100% { opacity: 0; } }
      @keyframes btnState { 0%, 20% { width: 100px; background: var(--accent); } 21% { transform: scale(0.95); } 25% { transform: scale(1); width: 120px; background: #333; } 90% { width: 120px; background: #333; } 100% { width: 100px; background: var(--accent); } }
      @keyframes hideText { 0%, 20% { opacity: 1; } 25%, 100% { opacity: 0; } }
      @keyframes showText { 0%, 25% { opacity: 0; } 30%, 90% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes showBar { 0%, 25% { opacity: 0; } 30%, 90% { opacity: 1; } 100% { opacity: 0; } }

      /* Comparison Section */
      .solution-section { padding: 60px 24px 60px; display: flex; flex-direction: column; align-items: center; max-width: 1000px; margin: 0 auto; }
      .solution-pill { background: var(--card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--text-light); margin-bottom: 20px; box-shadow: var(--shadow); }
      .solution-title { font-size: clamp(32px, 5vw, 42px); font-weight: 800; margin-bottom: 15px; }
      .solution-subtitle { color: var(--text-light); text-align: center; line-height: 1.5; margin-bottom: 60px; }
      .comparison-container { display: grid; grid-template-columns: 1fr 1fr; width: 100%; border: 1px solid var(--border); border-radius: 32px; overflow: hidden; background: var(--card); box-shadow: var(--shadow); }
      .comparison-side { padding: 50px 40px; display: flex; flex-direction: column; gap: 25px; }
      .problem-side { background: transparent; }
      .solution-side { background: #111; color: white; position: relative; }
      body.light .solution-side { background: #000; }
      .side-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
      .comparison-list { list-style: none; display: flex; flex-direction: column; gap: 20px; }
      .comparison-list li { display: flex; align-items: center; gap: 15px; font-size: 15px; font-weight: 500; }
      .problem-side li { color: var(--text-light); }
      .solution-side li { color: #eee; }
      .icon-box { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .cross { background: rgba(255, 77, 77, 0.15); color: #ff4d4d; }
      .check { background: var(--accent); color: white; }

      /* Pricing Section */
      .pricing-section { padding: 60px 24px 60px; display: flex; flex-direction: column; align-items: center; max-width: 1100px; margin: 0 auto; }
      .pricing-pill { background: var(--card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--text-light); margin-bottom: 20px; box-shadow: var(--shadow); }
      .pricing-title { font-size: clamp(32px, 5vw, 42px); font-weight: 800; margin-bottom: 15px; }
      .pricing-subtitle { color: var(--text-light); text-align: center; line-height: 1.5; margin-bottom: 60px; }
      .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; width: 100%; }
      .pricing-card { border-radius: 32px; padding: 40px; display: flex; flex-direction: column; transition: transform 0.3s ease; position: relative; }
      .pricing-card:hover { transform: translateY(-5px); }
      .pricing-card.light { background: var(--card); border: 1px solid var(--border); color: var(--text); box-shadow: var(--shadow); }
      .pricing-card.dark { background: #111; color: white; border: 1px solid rgba(255,255,255,0.1); }
      body.light .pricing-card.dark { background: #000; }
      .pricing-card.popular { border: 2px solid var(--accent); }
      .popular-badge { position: absolute; top: -12px; right: 30px; background: var(--accent); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
      .plan-header { margin-bottom: 30px; }
      .plan-header h3 { font-size: 20px; font-weight: 700; margin-bottom: 15px; }
      .price-tag { font-size: 42px; font-weight: 800; letter-spacing: -1px; display: flex; align-items: baseline; }
      .period { font-size: 16px; font-weight: 500; color: var(--text-light); margin-left: 4px; }
      .dark .period { color: rgba(255,255,255,0.6); }
      .plan-desc { font-size: 14px; color: var(--text-light); margin-top: 15px; line-height: 1.5; }
      .dark .plan-desc { color: rgba(255,255,255,0.6); }
      .plan-btn { width: 100%; padding: 14px; border-radius: 50px; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: none; transition: 0.2s; border: none; margin-bottom: 30px; }
      .pricing-card.light .plan-btn { background: #000; color: #fff; }
      body.dark .pricing-card.light .plan-btn { background: #fff; color: #000; }
      .pricing-card.dark .plan-btn { background: #fff; color: #000; }
      .plan-btn.orange { background: var(--accent); color: white; }
      .plan-btn:hover { transform: scale(1.02); }
      .plan-features span { display: block; font-size: 13px; font-weight: 700; margin-bottom: 15px; }
      .plan-features ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
      .plan-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; }
      .pricing-card.full-width { grid-column: span 2; display: flex; }
      .custom-content { display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; width: 100%; align-items: center; }
      .custom-content .plan-header { margin-bottom: 0; }
      .custom-content .plan-btn { margin-top: 20px; margin-bottom: 0; width: auto; display: inline-flex; padding: 12px 30px; }
      .two-col ul { display: grid; grid-template-columns: 1fr 1fr; gap: 15px 30px; }

      /* Reviews Section */
      .reviews-section { padding: 60px 24px 60px; display: flex; flex-direction: column; align-items: center; width: 100%; overflow: hidden; }
      .reviews-pill { background: var(--card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--text-light); margin-bottom: 20px; box-shadow: var(--shadow); }
      .reviews-title { font-size: clamp(32px, 5vw, 42px); font-weight: 800; margin-bottom: 20px; text-align: center; }
      .reviews-subtitle { color: var(--text-light); text-align: center; line-height: 1.5; margin-bottom: 60px; }
      .reviews-marquee-container { width: 100%; overflow: hidden; mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); margin-bottom: 60px; }
      .reviews-track { display: flex; gap: 30px; width: max-content; animation: scrollReviews 40s linear infinite; }
      @media (hover: hover) and (pointer: fine) { .reviews-track:hover { animation-play-state: paused; } }
      .review-card { width: 350px; background: var(--card); border: 1px solid var(--border); padding: 30px; border-radius: 24px; flex-shrink: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 20px; box-shadow: var(--shadow); }
      .review-text { font-size: 15px; line-height: 1.6; font-style: italic; color: var(--text); }
      .reviewer-info { display: flex; align-items: center; gap: 12px; }
      .reviewer-avatar { width: 40px; height: 40px; background: #ddd; border-radius: 50%; }
      .reviewer-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
      .reviewer-name { font-weight: 700; font-size: 14px; }
      .reviewer-role { font-size: 12px; color: var(--text-light); }
      @keyframes scrollReviews { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
      .video-testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; width: 100%; max-width: 1100px; padding: 0 24px; justify-items: center; }
      .video-block { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; width: 100%; max-width: 320px; }
      .v-name { font-weight: 700; font-size: 16px; color: var(--text); }
      .v-role { font-size: 13px; color: var(--text-light); margin-top: 4px; }

      /* FAQ Section */
      .faq-section { padding: 60px 24px 60px; max-width: 1200px; margin: 0 auto; display: flex; justify-content: center; }
      .faq-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; width: 100%; }
      .faq-left { position: sticky; top: 120px; height: fit-content; }
      .faq-pill { background: var(--card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--text-light); margin-bottom: 20px; box-shadow: var(--shadow); display: inline-block; }
      .faq-title { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin-bottom: 20px; line-height: 1.1; }
      .faq-subtitle { font-size: 16px; color: var(--text-light); line-height: 1.6; max-width: 350px; }
      .faq-right { display: flex; flex-direction: column; gap: 15px; }
      .faq-item { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 24px; cursor: none; transition: all 0.3s ease; box-shadow: var(--shadow); overflow: hidden; }
      .faq-item:hover { border-color: var(--accent); }
      .faq-item.open { border-color: var(--accent); background: #1a1a1a; }
      body.light .faq-item.open { background: #fff; }
      .faq-question { display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 16px; }
      .chevron { transition: transform 0.3s ease; }
      .chevron.rotate { transform: rotate(180deg); }
      .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, opacity 0.3s ease; opacity: 0; }
      .faq-item.open .faq-answer { max-height: 200px; opacity: 1; margin-top: 15px; }
      .answer-inner { color: var(--text-light); line-height: 1.6; font-size: 15px; }

      /* CTA Section */
      .cta-section { padding: 60px 24px 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }
      .cta-card { background: #111; color: white; width: 100%; max-width: 1000px; border-radius: 40px; padding: 60px 20px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; }
      .cta-content { position: relative; z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; }
      .cta-title { font-size: clamp(32px, 5vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -1px; }
      .cta-subtitle { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.6; max-width: 600px; }
      .float-pill { position: absolute; padding: 8px 16px; border-radius: 30px; font-size: 12px; font-weight: 700; box-shadow: 0 10px 20px rgba(0,0,0,0.3); animation: floatPill 6s infinite ease-in-out; white-space: nowrap; z-index: 1; }
      .float-pill.dark { background: #222; border: 1px solid #333; color: white; }
      .float-pill.orange { background: var(--accent); color: white; }
      .p1 { bottom: 40px; left: 5%; transform: rotate(-8deg); --r: -8deg; }
      .p2 { bottom: 100px; left: 10%; transform: rotate(5deg); --r: 5deg; animation-delay: 1s; }
      .p3 { bottom: 40px; right: 5%; transform: rotate(8deg); --r: 8deg; animation-delay: 2s; }
      .p4 { bottom: 100px; right: 10%; transform: rotate(-5deg); --r: -5deg; animation-delay: 3s; }
      .p5 { top: 40px; right: 8%; transform: rotate(12deg); --r: 12deg; animation-delay: 1.5s; }
      @keyframes floatPill { 0%, 100% { transform: translateY(0) rotate(var(--r)); } 50% { transform: translateY(-10px) rotate(var(--r)); } }
      .cta-bg-particles { position: absolute; inset: 0; pointer-events: none; opacity: 0.3; }
      .p-dot { position: absolute; width: 4px; height: 4px; background: white; border-radius: 50%; animation: twinkle 3s infinite; }
      .d1 { top: 20%; left: 20%; } .d2 { top: 60%; right: 30%; animation-delay: 1s; } .d3 { top: 30%; right: 10%; animation-delay: 2s; }
      @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }

      /* Footer */
      .footer-section { background: #050505; color: #fff; padding: 80px 24px 40px; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; position: relative; overflow: hidden; }
      .footer-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 60px; position: relative; z-index: 2; }
      .footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 40px; }
      .footer-col h4 { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
      .footer-logo { font-size: 24px; font-weight: 800; letter-spacing: -1px; margin-bottom: 16px; }
      .footer-logo span { color: var(--accent); }
      .footer-tagline { font-size: 14px; color: #888; line-height: 1.6; max-width: 250px; }
      .footer-links { display: flex; flex-direction: column; gap: 12px; }
      .footer-links button, .social-link { background: none; border: none; color: #888; text-align: left; padding: 0; font-size: 14px; cursor: none; transition: 0.2s; display: flex; align-items: center; gap: 8px; text-decoration: none; }
      .footer-links button:hover, .social-link:hover { color: #fff; transform: translateX(3px); }
      .contact-details { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
      .contact-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #ccc; }
      .contact-item svg { color: var(--accent); }
      .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; display: flex; justify-content: space-between; font-size: 13px; color: #666; }
      .footer-particles { position: absolute; inset: 0; pointer-events: none; }
      .fp { position: absolute; width: 2px; height: 2px; background: rgba(255,255,255,0.2); border-radius: 50%; }
      .d1 { top: 20%; left: 10%; } .d2 { top: 50%; right: 20%; } .d3 { bottom: 30%; left: 30%; }

      /* Floating Buttons */
      .back-to-top {
        position: fixed; bottom: 30px; right: 30px; background: var(--text); color: var(--bg);
        width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        cursor: none; border: 2px solid transparent; box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); z-index: 1002;
      }
      .back-to-top.visible { opacity: 1; visibility: visible; transform: translateY(0); }
      .back-to-top:hover { background: var(--accent); color: white; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(255, 92, 0, 0.4); }

      .made-in-badge {
        position: fixed; bottom: 30px; right: 30px; background: var(--card); border: 1px solid var(--border);
        padding: 8px 16px; border-radius: 12px; display: flex; align-items: center; gap: 8px; text-decoration: none;
        z-index: 1001; box-shadow: var(--shadow); transition: all 0.3s ease; cursor: none;
      }
      .back-to-top.visible ~ .made-in-badge { bottom: 95px; }
      .made-in-badge:hover { transform: translateY(-2px); border-color: var(--accent); }
      .badge-logo { display: flex; align-items: center; justify-content: center; color: var(--text); }
      .badge-text { font-size: 13px; font-weight: 700; color: var(--text); white-space: nowrap; }
      .badge-text span { color: var(--accent); }
      .spacing-fix { margin-left: 6px; }

      @media (max-width: 960px) {
        /* Re-enable default cursors on mobile and hide custom cursor */
        html, button, a, .trust-pill, .portfolio-card, .is-row, .faq-item, .nav-container, .nav-left, .nav-center button, .nav-cta, .mobile-toggle, .mobile-menu button, .main-cta, .reply, .footer-links button, .social-link, .back-to-top, .made-in-badge { cursor: auto; }
        .custom-cursor { display: none; }

        .hero-content { grid-template-columns: 1fr; text-align: center; }
        .hero-text-area { display: flex; flex-direction: column; align-items: center; }
        .desktop-only { display: none; }
        .mobile-toggle { display: block; }
        .main-title { font-size: 52px; }
        .hero-section { padding-top: 100px; overflow: hidden; } /* Prevents overflow bugs on mobile */
        
        .standard-video-row { grid-template-columns: 1fr; }
        .shorts-grid { grid-template-columns: repeat(2, 1fr); }
        .work-title { font-size: 32px; }
        .work-section.page-mode { padding-top: 100px; }
        
        .stats-container { flex-direction: column; gap: 30px; padding: 30px; width: 100%; }
        .stat-divider { width: 50px; height: 1px; }
        
        /* Mobile Accordion Overrides */
        .interactive-services-container { flex-direction: column; gap: 0; margin-top: 20px; }
        .is-right.desktop-only { display: none; } /* Hide the right box entirely */
        
        .is-row { opacity: 1; transform: none !important; padding: 24px 0; }
        .is-row.active, .is-row:hover { transform: none !important; }
        .is-row .is-title { font-size: 24px; }
        
        /* Accordion Animation */
        .is-mobile-content { 
          display: block; 
          max-height: 0; 
          overflow: hidden; 
          opacity: 0;
          transition: max-height 0.4s ease, margin-top 0.4s ease, opacity 0.4s ease;
        }
        .is-row.active .is-mobile-content {
          max-height: 400px;
          margin-top: 20px;
          opacity: 1;
        }
        
        .process-grid { grid-template-columns: 1fr; }
        .comparison-container { grid-template-columns: 1fr; }
        .pricing-grid { grid-template-columns: 1fr; }
        .pricing-card.full-width { grid-column: span 1; }
        .custom-content { grid-template-columns: 1fr; text-align: center; }
        .two-col ul { grid-template-columns: 1fr; }
        .video-testimonials-grid { grid-template-columns: 1fr; }
        .faq-grid { grid-template-columns: 1fr; }
        .faq-left { position: static; text-align: center; margin-bottom: 40px; display: flex; flex-direction: column; align-items: center; }
        .footer-top { grid-template-columns: 1fr; }
        .footer-bottom { flex-direction: column; align-items: center; text-align: center; }
        .back-to-top { bottom: 20px; right: 20px; width: 40px; height: 40px; }
        .made-in-badge { bottom: 20px; right: 20px; padding: 6px 12px; }
        .back-to-top.visible ~ .made-in-badge { bottom: 75px; }
      }
    `}</style>
  );
}