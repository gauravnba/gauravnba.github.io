---
layout: project
title: "Data Driven Game Engine"
excerpt: "A data driven game engine written in C++ 11 during my course at FIEA. Utilizes a custom XML scripting interface to build a game world with a game object hierarchy."
source: "https://github.com/gauravnba/MahatmaGameEngine"
date: 2018-07-10
---
This is a Game Engine, I made for our course in FIEA, designed to parse a game world from an XML file. I used the Expat C library to parse XML files.
The primary objectives of this project
<ul>
    <li>To learn how game engines are structured.				</li>
    <li>To learn advanced concepts of C++.                      </li>
    <li>To see how compiler structures are made.                </li>
    <li>To learn asynchronous programming.                      </li>
    <li>To better understand how the STL library is designed.   </li>
    <li>To implement complete unit testing practices.           </li>
</ul>

<ul>
Overview of the Design

    <li>I made custom container classes for Singly Linked List, Vector and Hashmap.																													</li>
    <li>For the engine, I created the Datum structure along with the Scope, to handle data read from XML file.                                                                                      </li>
    <li>These structures are then extended by the World, Sector, Entity, Action hierarchy to allow for definition of structures using the XML scripting system.                                     </li>
    <li>These game objects use the Factory pattern to allow to be named at runtime.                                                                                                                 </li>
    <li>The Action class can be used to create actions that can either extend C++ functionality like a ‘while loop’ or ‘if condition’ or make something specific to the game, like move an entity.  </li>
    <li>An Asynchronous Event system was then made for the engine, that is also accessible by XML.                                                                                                  </li>
</ul>

I have provided more information about the structure and the features of the project on github below.