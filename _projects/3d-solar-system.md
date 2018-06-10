---
layout: project
title: "3D Solar System Model"
excerpt: "My first foray into graphics programming using DirectX 11 to render out our Solar System."
image: "/images/Projects/SolarSystem/ViewByTheSun.png"
source: "https://github.com/gauravnba/SolarSystemModel"
date: 2018-07-10
---
As an exercise to learn 3D graphics programming and shader programming, I created a model of our Solar System with the the sun, the 8 planets, Pluto and some select moons. I used a framework to help start the project, created by Dr. Paul Varcholik at https://bitbucket.org/pvarcholik/bespoke.games.framework

<img src="/images/Projects/SolarSystem/Earth.png" width="49%"/> <img src="/images/Projects/SolarSystem/JupiterAndGallileanMoons.png" width="49%"/>

All the celestial bodies are lit by point lighting provided by the sun. The sun itself is unlit, since the point-light resides within the bounds of its mesh. I had to scale down the distances between the planets and their moons so that the model can be observed much more comfortably. I have used Space Engine (http://spaceengine.org/) to obtain the skybox texture I have used. One thing of note: I have not yet added the rings of Saturn (or Uranus or Neptune), since obtaining the mesh for those seems to be a much more difficult task.

In the project I learnt how to
<ul>
    <li>Write a simple vertex shader to render a mesh; in this case, the spheres of the bodies.	</li>
    <li>Write a pixel shader to apply textures to meshes.                                       </li>
    <li>Write a shader for point lighting using the cosine rule.                                </li>
    <li>Apply rotation, translation and scaling to bodies in real-time.							</li>
</ul>