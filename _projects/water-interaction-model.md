---
layout: project
title: "Physics Model of a Boat in Water"
excerpt: "Since Physics and Gameplay programming is my primary interest, I started working on this project to understand the nuances involved in going from raw math to application programming."
image: "/images/Projects/WaterInteractionModel/WaterInteractionModelScreen.png"
source: "https://github.com/gauravnba/WaterInteractionModel_UE4"
---
A physics interaction model of a boat in water using Nvidia PhysX, Waveworks and Unreal Engine. Since the UE4 Editor requires Waveworks to be integrated, I used a custom build of Unreal Engine.

This physics model is based on the <a href="https://www.gamasutra.com/view/news/237528/Water_interaction_model_for_boats_in_video_games.php">Gamsutra article</a> by Jaques Kerner, about a Water interaction model for boats in video games. Ideally, the model should work for a boat of any shape in a body of water with any type of behaviour. However, since the model is still in development, it works only for the boat model used.

<img src="/images/Projects/WaterInteractionModel/Latest.gif" width="100%"/>

I used this project to learn how to apply mathematical equations that work in the physical world, to objects in a virtual game world. Some things I picked up were:
<ul>
    <li>Hydrostatic and hydrodynamic forces that act on objects submerged in water.															</li>
    <li>Using Nvidia PhysX in to make physics simulations in the Unreal Engine.                                                             </li>
    <li>Tackling complex geometry problems to isolate forces on faces of the mesh.                                                          </li>
    <li>Creating a generalized physics model that is not specialized to a single type of mesh and should work on multiple types of bodies.  </li>
</ul>

This project, like some of my other projects, is still actively in development. You can also view my development cycle on this project on my <a href="/blog/">blog</a>.