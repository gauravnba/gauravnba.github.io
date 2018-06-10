---
layout: post
title:  "Week 6 – Applying Hydrostatic Forces to Boat"
date:   2017-07-19
excerpt: "I finally apply forces to the boat this week. Not quite what I expected."
image:
comments: true
---
Last week, I obtained the fully submerged triangles on the boat’s mesh so that I can apply hydrostatic forces to those triangles. This week, I will apply those forces to the triangles.
The buoyancy force acting on the body is the sum of all hydrostatic forces acting on each fully submerged triangle. As far as the linear force is concerned, we can sum only the vertical component of the hydrostatic force since we have seen that the other forces cancel each other. The force on a submerged triangle is:

<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<div style="text-align: center;">$$\overrightarrow F = -\rho g  h_{center} \overrightarrow n$$</div>
Where,<br>
**_F_** is the hydrostatic force acting on the object,														<br>
**_ρ_** is the density of fluid                                                                             <br>
**_g_** is the gravitational force acting on the body                                                       <br>
**_h_centre_** is the depth of submersion of the centre of the triangle that we are applying the force to   <br>
**_n_** is the Vector normal of the triangle face.                                                          <br>

We can get the height of the centre of the triangle by averaging out the heights below water of each of the vertices. We can find the normal of the triangle by the cross product of two sides. The g component can easily be obtained using Unreal’s physics libraries. Since we have each of the required parameters, we calculate the amount of hydrostatic force to apply to the triangle by using the following:
```
float hCentre = (heights[0] + heights[1] + heights[2]) / 3;	 	 
FVector triNormal = (FVector::CrossProduct(mVertices[submergedTri.Index1] - mVertices[submergedTri.Index2], mVertices[submergedTri.Index2] - mVertices[submergedTri.Index3])).GetSafeNormal();	 	 
if (triNormal.Z GetGravityZ() * mMeshComponent->GetBodyInstance()->GetBodyMass()) // The gravitational force acting on the body.	 	 
 * hCentre	 	 
 * triNormal);	 	 
}	 	 
```
In the case where there is a concave structure of the boat registering as submerged in the water, it needs to be filtered out, hence I’m checking if the Z component of the normal is facing down or up.

Next, we need to apply this force to the triangle. This can be easily done using Unreal’s handy AddImpulseAtLocation method. We need to apply the impulse at the centre of gravity of the triangle, which means the centroid. We can get the centroid by creating a vector of averages of each component of the Triangle.
```
FVector centroid((mVertices[submergedTri.Index1].X + mVertices[submergedTri.Index2].X + mVertices[submergedTri.Index3].X) / 3,	 	 
 (mVertices[submergedTri.Index1].Y + mVertices[submergedTri.Index2].Y + mVertices[submergedTri.Index3].Y) / 3, 	 	 
 (mVertices[submergedTri.Index1].Z + mVertices[submergedTri.Index2].Z + mVertices[submergedTri.Index3].Z) / 3);	 	 
mMeshComponent->AddImpulseAtLocation(hydrostaticForce, centroid);	 	 
```
Since, this does not apply the impulse, but merely adds to its value, it’s a relatively cheap operation and hence we do this for each triangle.
Application of the Hydrostatic forces will result in the following:
<p style="text-align: center;"><i>(aaaaand drumroll)</i></p>

<img style="width: 100%;" src="/images/Posts/2017-07-19/hydrostaticforcesapplication.gif">

As can be seen, the hydrostatic forces are too wild. Nobody is fishing in that boat anytime soon; it’ll be too messy. Hydrodynamic forces need to be applied to the boat, in order to get the necessary damping to make the boat behave in a stable manner. Also, we see there is an extra torque being applied to the boat; this may be a result of the force not acting at the true centre of application of force. Which means, the application of force at the centroid of the triangle may be slightly off.