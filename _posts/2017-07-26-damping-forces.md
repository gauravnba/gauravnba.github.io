---
layout: post
title:  "Week 7 – Application of Damping Forces"
date:   2017-07-26
excerpt: "I add the remaining forces to the boat. Finally getting to the meat of the project."
image: 	"/images/Posts/2017-07-19/hydrostaticforcesapplication.gif"
comments: true
---
The image above is what we had last week. I had managed to apply hydrostatic forces to the boat as it was submerged in water. As we saw, it left the model in need of more forces to make it look less goofy. So, the next step is to apply Hydrodynamic forces to the boat, i.e., the application of damping forces.

Since there will be many different forces acting on the boat, and there have to be different math calculations to extrapolate geometrical data, I decided to create a separate utility class of static functions for math and physics calculations. The class is named BoatPhysicsUtil. The calculations for area of a triangle, triangle velocity, normal of a triangle and centroid of a triangle are moved to this class.
```
FVector BoatPhysicsUtil::TriangleVelocity(UStaticMeshComponent* boatMesh, const FVector& triangleCentre)
{
	// velocity at a point on body = velocity in centre of body + (angular velocity of body ^ vector between centre and the point)
	return (boatMesh->GetComponentVelocity() + (boatMesh->GetPhysicsAngularVelocity() ^ (triangleCentre - boatMesh->GetCenterOfMass())));
}
float BoatPhysicsUtil::TriangleArea(const FVector& vertex1, const FVector& vertex2, const FVector& vertex3)
{
	// area = 1/2 * base * height
	return (0.5 * FVector::Dist(vertex2, vertex3) * FMath::PointDistToLine(vertex1, vertex2 - vertex3, vertex2));
}

FVector BoatPhysicsUtil::CentroidOfTriangle(const FVector& vertex1, const FVector& vertex2, const FVector& vertex3)
{
	// centroid of triangle = Vector composed of the average of the x, y and z components of the vertices.
	return FVector((vertex1.X + vertex2.X + vertex3.X)/3,
	(vertex1.Y + vertex2.Y + vertex3.Y) / 3,
	(vertex1.Z + vertex2.Z + vertex3.Z) / 3);
}
FVector BoatPhysicsUtil::TriangleNormal(const FVector& vertex1, const FVector& vertex2, const FVector& vertex3)
{
	return ((vertex1 - vertex2) ^ (vertex2 - vertex3)).GetSafeNormal();
}
```
The first hydrostatic force to apply will be viscous water resistance.
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<div style="text-align: center;">$$\overrightarrow {F_{vi}} = \frac{1}{2} \rho \frac {0.075}{(log_{10} R_n - 2)^2} S_i v_{fi} \overrightarrow {v_{fi}}$$</div>
**_ρ_** = density of water																																												<br>
**_R<sub>n</sub>_** = Reynold’s number, which is the result of division of the product of speed of the body and the length along the body that the fluid has to traverse by the viscosity of the fluid   	<br>
**_S<sub>i</sub>_** = The surface area of the triangle                                                                                                                                                   	<br>
**_v<sub>fi</sub>_** = The relative velocity of the flow at the centre of the triangle                                                                                                                   	<br>

This uses the viscosity of the water to approximate a force applied to the submerged body. The trickiest part in this equation is to get the Reynold’s number, we need to find the length of the submerged body, along the length of the flow of the fluid. For this, I decided to use an approximation of the length of the boat, which is calculated on construction. This is calculated between the two extreme points of the mesh. I suspect this will cause the behaviour to be incorrect, but it will have to do for now.

<img style="width: 100%;" src="/images/Posts/2017-07-26/appliedviscouswaterresistance.gif"/>

As we can see, the boat looks slightly more stable on the first few bounces, before going awry. This is because the forces are still stronger than the entry forces, i.e., they are stronger than the gravity applied to the body.

So next, we need to apply pressure drag forces. This force is applied based on the direction of the Z (vertical) movement of the body. If the boat is moving downwards, pressure drag forces are applied to push the body upwards, otherwise, suction forces are applied to let the boat stick to the surface of the water.

<div style="text-align: center;">\(\overrightarrow {F_{Di}} = -(C_{PD1} \frac {v_i}{v_r} + C_{PD2} (\frac {v_i}{v_r})^2) S_i (cos \theta _i)^{f_p} \overrightarrow n_i\), if \(cos \theta _i\) is positive.</div>

<div style="text-align: center;">\(\overrightarrow {F_{Di}} = -(C_{SD1} \frac {v_i}{v_r} + C_{SD2} (\frac {v_i}{v_r})^2) S_i (cos \theta _i)^{f_s} \overrightarrow n_i\), if \(cos \theta _i\) is positive.</div>

**_C<sub>PD1/SD1</sub>_** = Linear drag forces											<br>
**_C<sub>PD2/SD2</sub>_** = Quadratic drag forces                                       <br>
**_v<sub>i</sub>_** = Velocity of the body                                              <br>
**_v<sub>r</sub>_** = Reference speed to help tune the forces                           <br>
**_cosθ<sub>i</sub>_** = Dot product of the direction of velocity and triangle normal   <br>
**_f<sub>P/S</sub>_** = Falloff power for either pressure or suction                    <br>
**_n<sub>i</sub>_** = Triangle normal                                                   <br>

For the Linear and Quadratic drag forces, I used 2500 as values, after some playtesting and tuning. The result was as below:

<img style="width: 100%;" src="/images/Posts/2017-07-26/appliedpressuredragforces.gif">

The model looks quite stable with just these forces. However, if the boat is dropped from a height, it will bounce too high before settling. This is because there are no slamming forces added to the model. The slamming forces simulate the forces when a body tries to breach the surface of water.

Additionally, the lateral roll of the boat is minimal. I suspect that this is because, earlier, the partially submerged triangles were ignored and excluded from all calculations.