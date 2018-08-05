---
layout: project
title: "Gravity Gun Prototype UE4"
excerpt: "A prototype in Unreal Engine 4 of the Gravity Gun from Half-Life 2."
image: "/images/Projects/GravityGunTest/Screen.png"
source: "https://github.com/gauravnba/gravity-gun-prototype-UE4"
---

As the title says, this is a prototype of the gravity gun from Half-Life 2, made using Unreal Engine 4.

Jumping right into it - The Gravity Gun is declared in the C++ class ``AGravityGun``, which is derived from the ``AWeapon`` class. I made the ``AWeapon`` class so that it can be used for any weapons that I decide to prototype at a later date. It has two virtual overrideable methods that use the ``PURE_VIRTUAL`` decorator offered by UE4 C++ - ``Fire()`` and ``SecondaryFire()``. ``Fire()`` is called from the player character ``BP_GordonFreeman`` when the **left click** is pressed and ``SecondaryFire()`` on **right click**. Any weapon derived from ``AWeapon`` can be picked up and dropped by ``BP_GordonFreeman`` using the **E** key.

The Gravity Gun itself works in the same manner as the original game, where **right click** pulls an object towards the gun and levitates it or 'gravitizes' it and **left click** launches it. Pressing the **left click** without anything levitating, shoots the beam. Pressing the **right click** when an object is already gravitized, drops it. The sound and particle effects systems are called from the corresponding functions themselves.

<div class="yt-player"><iframe src="https://www.youtube.com/embed/-xHItnCfwwE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div><br/>

I also made an event handler ``UGlobalEventHandler`` that can be accessed from the global singleton static method ``AGameSingleton::GetEventHandler()``, also accessible in blueprints. The primary purpose for using this was to update the crosshair in the ``GordonFreemanHUD``. The crosshair changes when the gravity gun is equipped and highlights when a gravitizable object is in range.

<a href="https://drive.google.com/open?id=1MlR4lLFx1HOAZoFAWdW64DFMj-XkjxZp" class="button fit">Play Demo (Executable in Zip file)</a>