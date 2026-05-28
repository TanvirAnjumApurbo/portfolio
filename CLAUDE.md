@AGENTS.md

# CLAUDE.md

## Project Identity

This project is a unique single-page cinematic portfolio website for **Tanvir Anjum Apurbo**.

The site should not look like a typical portfolio with a normal navbar, one-side photo, and one-side about text. It should feel like a premium scroll-driven storytelling experience inspired by the smooth cinematic animation style of the GTA VI website, but it must not copy GTA VI branding, colors, assets, layout, or exact animation sequences.

The final website should feel:

- Premium
- Cinematic
- Professional
- Recruiter-facing
- Research-driven
- Technically impressive
- Clean and readable
- Suitable for academic supervisors and recruiters

The site should show that strong design and engineering effort was invested.

---

## User Identity

Name: **Tanvir Anjum Apurbo**

Role/context:

- B.Sc. in Computer Science and Engineering student
- Interested in Machine Learning, Computer Vision, AI research, and full-stack development
- Works with Python, JavaScript, TypeScript, React, Next.js, Django, MySQL, Pandas, NumPy, Scikit-learn, OpenCV, Google Colab, Git/GitHub, VS Code, Overleaf, and PowerShell
- Has both academic research work and practical software/product projects

Use placeholder text where exact information is missing.

---

## Technical Stack

Use this stack unless explicitly instructed otherwise:

- Next.js
- TypeScript
- Tailwind CSS
- GSAP
- GSAP ScrollTrigger
- Lenis smooth scroll
- Lucide React icons if icons are needed

Avoid unnecessary libraries. Do not introduce Three.js unless the user explicitly asks for 3D.

---

## Design Direction

The visual language should be:

- Dark premium theme
- Large typography
- Cinematic composition
- Smooth scroll-driven transitions
- Subtle glow, grain, blur, mask reveal, parallax
- Minimal but impactful cards
- Strong visual hierarchy
- Professional spacing
- No childish game-like UI

Good mood references:

- Cinematic title sequence
- Premium tech portfolio
- Research lab dossier
- Editorial visual storytelling
- GTA VI-inspired scroll smoothness, but fully original

Avoid:

- Normal top navbar
- Generic portfolio layout
- Too many colors
- Too many icons
- Overloaded text
- Animation that hurts readability
- Copying GTA VI exact look
- Heavy 3D
- Random flashy effects

---

## Main Site Structure

The site should be a single-page portfolio with these sections:

1. Cinematic Hero
2. Identity Reveal
3. Work Chapters
4. Selected Projects
5. Research Work
6. Technical Stack Map
7. Timeline / Journey
8. Contact Finale

Use a minimal fixed chapter indicator instead of a traditional navbar.

---

## Section Requirements

### Section 1: Cinematic Hero

Purpose: create the first premium impression.

Content:

- Large name: `Tanvir Anjum Apurbo`
- Subtitle: `CSE Student / ML & Computer Vision Researcher / Full-stack Developer`
- Small scroll instruction

Design:

- Full-screen opening
- Dark cinematic background
- Abstract technical/cinematic visuals
- Large typography
- Subtle parallax
- Optional grain/noise overlay

Animation:

- Pinned hero section
- Name scale/fade on scroll
- Background parallax
- Smooth reveal
- Avoid excessive motion

---

### Section 2: Identity Reveal

Purpose: replace the normal About section.

Content should be short and elegant. Do not create a long biography.

Mention:

- Research-driven software
- Machine Learning
- Computer Vision
- Web Development
- AI/ML interest

Animation:

- Line-by-line text reveal
- Floating keyword layers
- Subtle scroll-based movement

---

### Section 3: Work Chapters

Create three cinematic cards:

1. Machine Learning Research
2. Computer Vision
3. Full-stack Product Development

Each card should have:

- Short title
- 1–2 line description
- Visual direction
- Scroll animation idea

Keep these cards minimal. Do not put long descriptions here.

---

### Section 4: Selected Projects

This section is only for practical software, product, and development projects.

Do not include academic research work here.

Projects:

- Porta: Global Crowd-Shipping Marketplace


Each project card should include only:

- Project title
- One-line description
- Small tech stack tags
- Status tag, for example: Concept / Prototype / Built / In Progress
- CTA links, for example: GitHub, Demo, Case Study, Details
- Visual placeholder idea

Design:

- Horizontal scroll or cinematic project reel
- Premium case-study gallery feel
- Minimal text
- Strong visual cards
- Subtle hover animation
- Pinned horizontal scroll is preferred on desktop
- On mobile, convert to vertical stacked cards

---

### Section 5: Research Work

This section is only for academic/research work.

It must be visually different from the project section. It should feel serious, clean, and academic.

Research works:

- Weighted probabilistic classification
- Bangla handwritten character recognition using CNN/ResNet
- Computer vision / image processing research work

Each research card should include only:

- Research title
- Research area tag, for example: Machine Learning / Computer Vision / Image Processing
- One-line academic summary
- Small keyword or metric tags
- CTA links, for example: Paper, GitHub, Methodology, Summary

Design:

- Minimal research dossier / academic panel style
- Use subtle equation fragments
- Use metric chips
- Use paper-card visuals
- Use graph lines or dataset block visuals
- Do not show too much methodology directly
- Details should be accessible through links

---

### Section 6: Technical Stack Map

Do not create a boring icon grid.

Create a visual “stack map” or “tool constellation”.

Skill groups:

- Languages
- Frontend
- Backend
- ML/Data
- Tools

Skills to include:

- Python
- JavaScript
- TypeScript
- React
- Next.js
- Django
- MySQL
- Pandas
- NumPy
- Scikit-learn
- OpenCV
- Google Colab
- Git/GitHub
- VS Code
- Overleaf
- PowerShell

Keep the section visually interesting but not overloaded.

---

### Section 7: Timeline / Journey

Show academic and learning journey.

Timeline items:

- SSC
- HSC
- B.Sc. in CSE
- Research methodology / thesis work
- Future goal

Use a scroll-drawn timeline.

Keep each timeline item short.

---

### Section 8: Contact Finale

Full-screen ending section.

Main line:

`Let’s build something research-driven.`

Buttons:

- Download CV
- GitHub
- LinkedIn
- Email

Design:

- Polished
- Confident
- Memorable
- Recruiter-friendly
- Clear call-to-action

---

## Content Style

Keep visible text short.

Do not put long explanations directly on the page.

For project and research cards:

- Use short titles
- Use one-line descriptions
- Use small tags
- Use embedded links for details

The portfolio should invite people to click GitHub, paper, demo, case study, or methodology links instead of showing everything on the homepage.

---

## Animation Guidelines

Use GSAP ScrollTrigger and Lenis carefully.

Preferred effects:

- Scroll-scrubbed animation
- Pinned sections
- Parallax layers
- Mask reveal
- Text reveal
- Horizontal project reel
- Subtle hover interactions
- Smooth section transitions

Avoid:

- Too many simultaneous animations
- Text moving too fast
- Scroll jank
- Overly complicated 3D
- Heavy video backgrounds
- Animations that make recruiter scanning difficult

Always support reduced motion.

Use `prefers-reduced-motion` to reduce or disable heavy animation.

---
