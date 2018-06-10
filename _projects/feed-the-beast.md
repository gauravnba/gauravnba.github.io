---
layout: project
title: "Feed the Beast"
excerpt: "Feed the Beast was a rapid prototype game, made using ActionScript 3.0 in Adobe Animate with a team of two programmers, two artists and one producer."
image: "/images/Projects/FeedTheBeast/FeedTheBeast.png"
source: "https://github.com/gauravnba/FeedTheBeast"
date: 2018-07-10
---

Feed the Beast was a rapid prototype game, made using ActionScript 3.0 in Adobe Animate with a team of two programmers, two artists and one producer. The game allowed you control of a Lion that can feed on prey by making contact with them.

As you consume enough and get past levels, the cat gets fatter. Hence heavier and slower, increasing the challenge.
<div class="image main"><img src="/images/Projects/FeedTheBeast/FeedTheBeastLevel2.png"/></div>

Eventually, you get so fat ...
<div class="image main"><img src="/images/Projects/FeedTheBeast/FeedTheBeastLevel3.png"/></div>
... that you can roll around and catch more prey, faster.
<div class="image main"><img src="/images/Projects/FeedTheBeast/FeedTheBeastLevel3_rolling.png"/></div>

Enabling you to get fatter. All the way, until -
<div class="image main"><img src="/images/Projects/FeedTheBeast/FeedTheBeast_FinalLevel.gif"/></div>

This game was my first foray into ActionScript. It taught me how to program a game with good object oriented design.

A particular challenge we faced while working on the project was how to expose elements of the game to enable the producer to construct levels in the game. We solved this issue by making a LevelData class that simply stores arrays of objects to be loaded onto a particular level. The producer merely had to go into the class and edit the arrays to determine the where and how the objects will spawn. We also added an effect to the game to highlight the passage of time, by tinting the whole game violet as time progresses, to give the feeling of the sun setting.