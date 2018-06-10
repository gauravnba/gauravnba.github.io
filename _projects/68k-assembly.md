---
layout: project
title: "Game made in 6800 Assembly language"
excerpt: "Yep, I was nutty enough to attempt making a game in a dead assembly language. And I would like to make more!"
image: "/images/Projects/68KAssemblyGame/68KAssemblyGame.png"
source: "https://github.com/gauravnba/Easy68K-sample-game"
date: 2018-07-10
---

This game has Boba Fett from Star Wars on Mustafar, picking up blue orbs. It was made wholly by me for the 68000 processor.

The project was entirely coded in the Easy68K application. Hence, I had to use trap codes for rendering the images to screen, pixel by pixel, rather than using a video buffer. For this reason, optimization of the code was a primary concern in this project.

<ul>
    <li>I used double buffering to eliminate screen tearing.</li>
    <li>Fixed point math was needed for physics calculations.</li>
    <li>A custom seven segment number display was used for the score.</li>
</ul>