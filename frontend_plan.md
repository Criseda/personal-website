# Lofi Station: Comprehensive Frontend Plan

This document details the exact steps, aesthetic, and logic for building the Lofi Station as an integrated part of the `criseda.com` portfolio.

## 1. Visual Identity & Aesthetic
- **Core Theme**: High-end Minimalist Vaporwave.
- **Background**: Shared **Aurora Background** from `criseda.com`.
- **Primary Typography**: Bold, clean (matches "University of Manchester Undergraduate").
- **Component Palette**: 
    - **shadcn/ui**: For technical controls (Sliders, Selects, Toasts).
    - **Aceternity UI**: For the "Wow" factor.
        - [**MovingBorder**](https://ui.aceternity.com/components/moving-border): For the "Enter Station" portal button.
        - [**Background Beams**](https://ui.aceternity.com/components/background-beams): Only visible *inside* the station (gives a technical cockpit feel).
        - [**Typewriter Effect**](https://ui.aceternity.com/components/typewriter-effect): For real-time generation logs.
        - [**Multi-Step Loader**](https://ui.aceternity.com/components/multi-step-loader): While waiting for the Pi to synthesize.

---

## 2. Integrated User Journey
1.  **Portfolio Hub (`criseda.com/projects`)**:
    - A minimalist vertical list of projects.
    - Hovering a project should show a subtle glow or offset.
2.  **Lofi Entry (`criseda.com/projects/lofi_station`)**:
    - **Initial State ("Locked")**: Soft Aurora background. Center text: "Lofi Station". A single button: "Enter Station".
    - **Action**: Click -> Google OAuth popup.
    - **Backend Sync**: Send Google token to `https://api.criseda.com/auth/social`.
    - **Persistence**: Save JWT in `localStorage`.
3.  **Lofi Interface (The "Unlocking")**:
    - After login, the screen "unlocks." 
    - Background Beams fade in.
    - The **Lofi Console** appears via a Framer Motion layout shift.

---

## 3. The Lofi Console: Generation Logic
Users have two ways to generate music:

### A. Manual Mode (Precision Control)
- **UI**: Sliders and dropdowns.
- **Inputs**:
    - `BPM Slider`: 60 to 120.
    - `Mood Selector`: Sunny, Chill, Gloomy, Midnight.
    - `Gloom Slider`: 0.0 to 1.0 (controlling harmonic dissonance).
- **API Call**: `POST /generate` with `manual_params`.

### B. Auto Mode (The "Vibe" Tracker)
- **UI**: A single prominent "Auto Vibe" toggle/button.
- **Logic**:
    1.  Use `navigator.geolocation` to get coordinates.
    2.  Browser fetches city/weather data.
    3.  Frontend sends `POST /generate` with `{"city": "Paris"}`.
- **Aesthetic**: While processing, use the **Typewriter Effect** to show logs like: *"Fetching Paris weather...", "Detected Rain... adding foley...", "Synthesizing melancholic chords..."*

---

## 4. Implementation Steps (Step-by-Step)
1.  **Project Init**: React + Vite + TypeScript. Configure `base: "/projects/lofi_station/"`.
2.  **State Management**: Create `AuthContext` for the JWT and `GeneratorContext` for state (Idle, Generating, Success).
3.  **Setup API Service**: Axios instance pointing to `https://api.criseda.com` with a Bearer token interceptor.
4.  **Build Landing Page**: Implement the Aurora + MovingBorder button login flow.
5.  **Build Console**:
    - Lay out the shadcn Sliders for Manual mode.
    - Implement the Geolocation logic for Auto mode.
    - Integrate Aceternity **Background Beams** inside the console container.
6.  **Polling/Success**: When the API returns a `job_id`, show a "Synthesis Complete" card with download links for WAV, MP3, and MIDI.