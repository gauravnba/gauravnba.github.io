---
layout: project
title: "Ghost Chamber"
excerpt: "Our attempt at recreating the JARVIS interface from Iron Man. We were only a few million Dollars of hologram short from recreating it."
image: "/images/Projects/GameLab/GhostChamber_V3.jpg"
source: "https://github.com/GhostChamber/autocad-plugin-tests"
---
This was a hardware project created for our GameLab class, with a team of three programmers, one producer and one artist.

We created this application originally for use with AutoCAD, for better presentation of models. We used the Kinect to track gestures of a user to Pan, Rotate and Zoom into a model being displayed. This model was then projected onto a Pepper’s Ghost illusion apparatus to give it a semblance of a hologram. This was achieved by a custom streaming software that we devised to split the image to four sections of a screen. The idea came about while thinking about the movie, Iron Man, and how Tony Stark interfaces with models in his garage.

<img src="/images/Projects/GameLab/GameLabTeam.jpg" width="49%"/> <img src="/images/Projects/GameLab/GhostChamer_V5.jpg" width="49%"/>

We used AutoCAD because of it’s easy availability and a robust extension library. This, coupled with the Kinect, made for a great combo; but we decided to experiment further and build a new interface that can be controlled by cell phone. This interface did not utilize AutoCAD, but a custom mobile application that we made using the Unreal Engine. We used a Raspberry Pi microcomputer to allow the Ghost Chamber to interface with the cell phone. Moreover, this second design was made using projectors, rather than a monitor, to allow for a system where the monitor is not visible.

We fabricated and assembled all hardware on our own with the help of a local maker space called <a href="http://factur.org/">Factur</a>.

<video width="100%" controls>
    <source src="/images/Projects/GameLab/GhostChamber/GhostChamber_DemoVideo.mp4" type="video/mp4">
</video>