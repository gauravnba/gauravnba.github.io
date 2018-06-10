---
layout: post
title:  "Week 5 of Development – Submersion of Triangles and surprise bug fixing"
date:   2017-07-12
excerpt: "Surprise debugging and using the mesh primitives to find out which tris are submerged."
image: "/images/Posts/2017-07-19/submergedtris.gif"
comments: true
---
This week, I started development to find out which triangles on the boat mesh were submerged and hence needed to be processed for intersection. To be able to do that, I needed a way to determine whether the triangle was submerged or not. However, for the algorithm to work, I need to know how many edges of the triangle are submerged. A boolean clearly doesn’t work in these cases, hence I went with a simple enumerated class:
```
enum class Submersion
{
	None,
	PartialSingleVertex,
	PartialTwoVertices,
	Full
};
```
I then added a Submersion object to the members of the struct Tri, that I had created to hold the location vectors of each vertex of the triangle. Now, I came across a problem, where I had no way of knowing where each of the corresponding heights of the water surface to the vertex were located inside the WaveworksDisplacements array. I decided that the best way to approach this, was to restructure how I stored the vertices of the triangles. I made a TArray of FVectors that will update every frame, based on the movement of the boat. To access these position vectors, I used a TArray of  Tri that was updated to only store indices into the vertex array; this was populated only once on BeginPlay().

```
// Get array of triangles and the number of triangles in the mesh.
PxTriangleMesh* triMesh = mMeshComponent->GetBodySetup()->TriMeshes[0];

const void* triangles = triMesh->getTriangles();
const int32 numTris = triMesh->getNbTriangles();

// Create an array of all triangles present on the mesh.
for (int32 triIndex = 0; triIndex < numTris; ++triIndex)
{
	const PxU16* indices = static_cast(triangles);

	int32 index1 = indices[(triIndex * 3) + 0];
	int32 index2 = indices[(triIndex * 3) + 1];
	int32 index3 = indices[(triIndex * 3) + 2];
	mTriLocations.Add(Tri(index1, index2, index3));
}

// mMeshComponent is the mesh of the boat hull
FTransform meshTransform = mMeshComponent->GetComponentTransform();

// Get the reference to the Triangle Mesh of the MeshComponent.
auto triMesh = mMeshComponent->GetBodySetup()->TriMeshes[0];
check(triMesh);

mVertices.Reset();
TArray vertexXYPositions;

// Get the number of vertices and the pointer to vertices array.
PxU32 vertexCount = triMesh->getNbVertices();
const PxVec3* vertices = triMesh->getVertices();

// For each vertex, transform the position to match the component Transform 
for (PxU32 i = 0; i < vertexCount; i++)
{
	mVertices.Add(meshTransform.TransformPosition(P2UVector(vertices[i])));
	vertexXYPositions.Add(FVector2D(mVertices[i].X / 100, mVertices[i].Y / 100));
}
```
I also now only store the Z heights of the water surface, instead of FVectors. This enabled me to efficiently process the heights of each of the vertices of the triangles. Each height at index in the WaveworksDisplacements array was perfectly correspondent to the array of triangle vertex position vectors. This meant that I can use the same struct Tri with the indices, to index into each of the arrays at the same value to get the correct results.

<div style="text-align: center;"><img src="/images/Posts/2017-07-19/arrayindexoutofbounds.png"/></div>

As I made these changes, I found a bug in the code, where on seemingly random circumstances, Unreal reports an ‘Array index out of bounds error’ for the displacement array. On further inspection, it seems like a race condition on the waveworks displacement array, where I am trying to read from the array when the Waveworks software is writing to it. I fixed it temporarily by moving the SampleDisplacements query to Waveworks to after reading the array. This way, the thread starts writing to the array after I’m done reading from it. Need to profile to see if a mutex would be a sound solution to this. But for now, this solution seems to work.

Now, since it’s all set to obtain triangles on the mesh and the water heights of their projections on the XY plane, the next step is to obtain a list of submerged triangles. I created an enum class just for this purpose that indicates the submersion of the triangles.
```
enum class Submersion
{
	None,
	PartialSingleVertex,
	PartialTwoVertices,
	Full
};
```
An enum Submersion member was also added to the Tri struct. This will indicate the submersion type of that triangle. To set it, I wrote the following code that checks the submersion of each vertex of each triangle and based on that, will set the submersion.

```
for (auto& tri : mTriLocations)
{
	TArray heights;
	heights.Reserve(3);
	heights.Add(mVertices[tri.Index1].Z - mWaveworksDisplacements[tri.Index1]);
	heights.Add(mVertices[tri.Index2].Z - mWaveworksDisplacements[tri.Index2]);
	heights.Add(mVertices[tri.Index3].Z - mWaveworksDisplacements[tri.Index3]);

	// If all vertices are submerged
	if ((heights[0] < 0.0f) && (heights[1] < 0.0f) && (heights[2] < 0.0f))
	{
		tri.Submerged = Submersion::Full;
	}
	// If any two vertices are submerged
	else if (((heights[0] < 0.0f) && (heights[1] < 0.0f)) || ((heights[1] < 0.0f) && (heights[2] < 0.0f)) || ((heights[2] < 0.0f) && (heights[0] < 0.0f)))
	{
		tri.Submerged = Submersion::PartialTwoVertices;
	}
	// If any one vertex is submerged
	else if ((heights[0] < 0.0f) || (heights[1] < 0.0f) || (heights[2] < 0.0f))
	{
		tri.Submerged = Submersion::PartialSingleVertex;
	}
	// If no vertices are submerged
	else
	{
		tri.Submerged = Submersion::None;
	}
}
```
This gives us a result where the submerged triangles can be obtained and even they are fully or partially submerged. To move on with the project, I decided to use fully submerged triangles only. I can come back and modify the code to get the centre of submerged mass of the partially submerged triangles. Shown below, is the result where only the submerged triangles are drawn to the water surface.

<img style="width:100%;" src="/images/Posts/2017-07-19/submergedtris.gif"/>