---
layout: post
title:  "Week 4 of Development – Cutting Algorithm"
date:   2017-07-05
excerpt: "This post focuses on the maths that I will be using in the project. Also, I figure out how to access the mesh primitives from the Unreal Engine and PhysX framework."
image: "/images/Posts/2017-07-05/SimplifiedTriangleCutting.png"
comments: true
---
In the last post, I mentioned that I switched to working on an Nvidia Waveworks integrated Unreal Project. Now, since I have water and meshes up and running (thanks Unreal), I need to get something to apply forces to. The ‘something’ that we need is the triangles of the mesh that are submerged under the water, since the buoyancy force acting on the body is the sum of all hydrostatic forces acting on each fully submerged triangle.

In the above diagram, the water cuts the edge HM at $$I_M$$ and the edge HL at a point $$I_L$$. The edge ML is fully submerged. Since the intersection points lie somewhere on the edges, they can be represented with:

<div style="text-align: center;">$$\overrightarrow {MI_M} = t_M \overrightarrow {MH}$$

and $$\overrightarrow {LI_L} = t_L \overrightarrow {LH}$$
</div>

Where t is the factor with which to multiply the length to get the length of edge submerged. The height of points above water can be used to find suitable value of t.

<div style="text-align: center;">$$t_M = -\frac {h_M}{(h_H – h_M)}$$

and $$t_L = -\frac {h_L}{(h_H – h_L)}$$
</div>

As far as the linear force is concerned, we can sum only the vertical component of the hydrostatic force since we have seen that the other forces cancel each other. The force on a submerged triangle is:

<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<div style="text-align: center;">$$\overrightarrow F = -\rho g  h_{center} \overrightarrow n$$</div>

Where hcenter is the depth under water of the center of the triangle, and n is the normal to the triangle directed outward.

To obtain the triangles of the boat hull mesh fully, or partially submerged under the water, a cutting algorithm has to be employed. The algorithm is outlined below for an example triangle.

Hence, for this, we need to obtain the triangles on the mesh of the boat hull to process this information for each of them. Unreal and PhysX provides us with just the right tools to obtain this data. We can easily obtain the triangle indices of a mesh in Unreal. These can then be resolved to the vertices obtained from the the PhysX library. However, these are local positions and we require world positions. I used the following code to get the world positions of the triangles of a mesh and store them into an array of Tri structs, which hold the three world position vectors that represents the triangle.

```
// mMeshComponent is a UStaticMeshComponent reference to the mesh of the boat hull
FTransform meshTransform = mMeshComponent->GetComponentTransform();
UBodySetup* bodySetup = mMeshComponent->GetBodySetup();

TArray tempVertices;
// Get world positions of each of the vertices on the mesh.
for (PxTriangleMesh* eachTriMesh : bodySetup->TriMeshes)
{ 
    check(eachTriMesh); 
    PxU32 vertexCount = eachTriMesh->getNbVertices();
    
    //Vertex array 
    const PxVec3* vertices = eachTriMesh->getVertices();
    //For each vertex, transform the position to match the component Transform  
    for (PxU32 v = 0; v < vertexCount; v++)      
    {
        tempVertices.Add(meshTransform.TransformPosition(P2UVector(vertices[v])));      
    } 
}
 
// Get array of triangles and the number of triangles in the mesh. 
const void* triangles = bodySetup->TriMeshes[0]->getTriangles();
const int32 numTris = bodySetup->TriMeshes[0]->getNbTriangles();

// Create an array of all triangles present on the mesh.
for (int32 triIndex = 0; triIndex < numTris; ++triIndex)
{ 
    const PxU16* indices = static_cast(triangles);
    FVector vertex1 = tempVertices[indices[(triIndex * 3) + 0]]; 
    FVector vertex2 = tempVertices[indices[(triIndex * 3) + 1]];
    FVector vertex3 = tempVertices[indices[(triIndex * 3) + 2]];
    outputArray.Add(Tri(vertex1, vertex2, vertex3));.
}
```

In this code, I pass in the ‘outputArray’ as an output parameter to the function call. To check if the vertices I obtained are accurate, I drew each triangle as a debug in the scene.

<img width="100%" src="/images/Posts/2017-07-05/RenderMeshTris.gif"/>

Then, from the extracted vertices, I created a 2D map of points on the X,Y plane in Unreal to obtain the Z component (vertical) of the points projected on the Waveworks surface. We do this by calling the SampleDisplacements method and capturing the result in a displacements array using a VectorArrayDelegate.

```
//mPositions are the positions on XY plane to get the displacements for.
//mWaveworksDisplacementDeegate is the FVectorArrayDelegate that the displacements are returned to.

mWaveWorksComponent->SampleDisplacements(mPositions, mWaveworksDisplacementDelegate);
```

<img width="100%" src="/images/Posts/2017-07-05/ProjectMeshTris.gif"/>

Next week, I’ll be covering how the triangle intersection algorithm can be applied to this project.