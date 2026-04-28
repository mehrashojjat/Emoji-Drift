# Emoji Drift 🐍✨

> **Built as a live demonstration for a university lecture on Game Development with AI.**  
> The entire game — from concept to code — was designed and implemented with the assistance of AI tools, showcasing how modern AI can accelerate game development.

Emoji Drift is a browser-based snake game set in an infinite, procedurally generated emoji universe. Steer your snake across a boundless space, collect emojis to grow your body, and unlock rare treasures — all without installing anything.

---

## Gameplay

- **Steer** your snake by clicking / tapping and dragging in any direction.
- **Collect** emojis floating in the world — each one becomes a new body segment.
- **Avoid** running into your own tail; the longer you get, the more dangerous it becomes.
- The world is infinite and procedurally populated — there is no edge and no finish line.
- Your speed increases gradually over time and with the length of your snake.

---

## Features

| Feature | Details |
|---|---|
| 🌍 Infinite world | Emojis spawn and despawn dynamically around the snake |
| 🎭 500+ unique emojis | Drawn from faces, food, animals, nature, objects and symbols |
| ⭐ Rarity system | Common → Uncommon → Rare → Epic → **Legendary** |
| 🎒 Persistent collection | Every emoji you collect is saved in your browser |
| 🐍 Custom snake head | Type or paste any emoji as your snake's head in Settings |
| 👺 Secret power | Collect the legendary Goblin to transform your head |
| 📱 Mobile-friendly | Virtual joystick + touch controls; runs on phone and desktop |
| ⏸ Pause / Resume | Pause at any time without losing your progress |

---

## Rarity Tiers

| Tier | Colour | Relative frequency |
|---|---|---|
| Common | ⚪ Grey | Base rate |
| Uncommon | 🟢 Green | 5× rarer |
| Rare | 🔵 Blue | ~22× rarer |
| Epic | 🟣 Purple | ~125× rarer |
| **Legendary** | 🟡 Gold | **1 000× rarer** |

Rare-and-above objects emit a glowing aura in the world. Legendary emojis pulse with light.

---

## Controls

| Input | Action |
|---|---|
| Click / tap + drag | Steer the snake toward the drag direction |
| Release | Snake drifts in the last set direction |
| ⏸ button (top-right) | Pause / Resume |

---

## How to Play

1. Open `index.html` in any modern browser — no build step, no dependencies.
2. Press **▶ Start** from the main menu.
3. Drag to steer; collect emojis to grow.
4. Check **🎒 My Collection** from the menu to browse every emoji you have found.
5. Visit **⚙️ Settings** to customise your snake's head emoji.

---

## Project Structure

```
index.html          ← Shell: HTML markup + CSS styles
js/
  game.js           ← Entry point: game loop, state transitions, boot
  config.js         ← All tunable constants (speed, spawn radius, etc.)
  data.js           ← Emoji pools, display names, rarity tables
  state.js          ← Shared mutable state + high-performance trail ring-buffer
  render.js         ← Canvas setup and per-frame rendering
  update.js         → (logic lives in game.js)
  world.js          ← Procedural spawn / despawn of world objects
  input.js          ← Virtual joystick and pointer/touch event handling
  ui.js             ← Panel management, collection grid, settings UI
  persist.js        ← localStorage save/load with debounced writes
  utils.js          ← Shared helpers (distance, grapheme parsing)
```

The game is written in plain ES modules — no frameworks, no bundler required.

---

## About — Generative AI and Prompt Engineering @ Media University

This project was created as a **live demonstration** for the *Generative AI and Prompt Engineering* lecture at **Media University**.  
It illustrates how conversational AI tools can be used throughout the full development cycle:

- **Concept & design** — brainstorming mechanics, rarity systems, and progression loops
- **Implementation** — generating, reviewing, and refactoring JavaScript code in real time
- **Performance** — identifying bottlenecks (e.g. O(n) trail insertion, GPU filter cost) and applying fixes
- **Refactoring** — restructuring a monolithic 1 400-line file into clean, maintainable ES modules
- **Documentation** — writing this README

The goal is to show students that AI is a powerful *collaborator* in creative and technical work — not a replacement for understanding, but a tool that dramatically accelerates it.
