---
layout: post
title:  "Week 3 of Development – Displaying 3D objects in the scene"
date:   2017-06-22
excerpt: "Struggling with my meagre knowledge of graphics programming and a major pivot in the project."
image:
comments: true
---

Last week was crazy with the other projects that I’m working on at FIEA. I barely had enough time to work on this project. What’s worse, it seems like this will snowball into next week’s work with all the projects; note to self – need to manage time better.

This week, I decided to work on getting a simple mesh rendered to screen. This will have to be done in a class ‘RenderableObject’, which will hold the world, view and projection matrices, along with the vertex shader and pixel shader required and the X, Y and Z positions to use for translation. The vertex shader and the pixel shader will be static and shared across all the instances of this class.

The class member functions will be simply Initialize(), Update() and Draw(). In addition to these, we’ll have to overload the operators new and delete using _mm_alloc() and _mm_free(), since the DirectX::XMMATRIX is 16 byte aligned. The outline looks like this:

```
class RenderableObject
{
public:
	RenderableObject();

	void* operator new(size_t obj);

	void operator delete(void* obj);

	virtual ~RenderableObject();

	RenderableObject(const RenderableObject& obj) = default;

	RenderableObject(RenderableObject&& obj) = default;

	HRESULT Initialize(std::wstring textureName, ID3D11Device* DXDevice);

	void Update(float deltaSeconds);

	void Draw(float deltaSeconds);

private:
	float					mTranslateX;
	float					mTranslateY;
	float					mTranslateZ;
	ID3D11VertexShader*			mVertexShader;
	ID3D11PixelShader*			mPixelShader;
	ID3D11InputLayout*			mVertexLayout;
	CDXUTSDKMesh				mMesh;
	ID3D11Buffer*				mCBNeverChanges;
	ID3D11Buffer*				mCBChangesEveryFrame;
	ID3D11SamplerState*			mSamplerLinear;
	DirectX::XMMATRIX			mWorldMatrix;
	DirectX::XMMATRIX			mViewMatrix;
	DirectX::XMMATRIX			mProjectionMatrix;
};
```

In the Initialize() method, I follow the drill to set up the graphics pipeline:
<ol>
    <li>Compile and store the vertex shader		</li>
    <li>Create the Input layout                 </li>
    <li>Compile and store the pixel shader      </li>
    <li>Create the constant buffer              </li>
    <li>Load the mesh                           </li>
    <li>Initialize the world and view matrices  </li>
    <li>Create the sample state          </li>
</ol>
The Update() is present to update the position every frame. It is designed to be used to have the calculations of the physics in there. The plan is to use a Physics class that will be a member of the RenderableObject.

The Draw() method will set up the buffers and render the mesh.

Now that the RenderableObject class has the code in it, I create a vector of unique pointers to objects of RenderableObject in the main file, and add a single object to it in the Initialize. I then set up the calls to Initialize() and the Draw() from the respective callback functions set up for DXUT. I don’t need to call the Update() for this test. Now comes the moment of truth – I start the program and it shows me a failure message.

<figure style="text-align:center; font-size: 17px;">
	<img src="/images/Posts/2017-06-22/failedtoinitializerenderableobject.png"/>
	<figcaption><i>The error message on run</i></figcaption>
</figure>

The culprit is this chunk of code:

```
// Create the constant buffers
D3D11_BUFFER_DESC bd;
ZeroMemory(&bd, sizeof(bd));
bd.Usage = D3D11_USAGE_DYNAMIC;
bd.ByteWidth = sizeof(mCBChangesEveryFrame);
bd.BindFlags = D3D11_BIND_CONSTANT_BUFFER;
bd.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;
V_RETURN(d3dDevice->CreateBuffer(&bd, nullptr, &mCBChangesEveryFrame));
```

It can’t seem to set the Constant Buffer. I need to look into why that may be.

__**Major Update:**__ I decided to switch to working with an Unreal project instead. Working in a limited time frame, that seems to be the best way to cut scope and keep the focus on physics and learn graphics programming at another time.

<img width="100%" src="/images/Posts/2017-06-22/usingwaveworks.gif"/>

I’m using nVidia’s Waveworks integrated into Unreal to get the water and apply it to a boat. I made a rudimentary component class to utilize the Waveworks library and apply linear floatation to the root of any Actor it is attached to. This is what the tick looks like:

```
void UFloatingComponent::TickComponent( float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction )
{
	Super::TickComponent( DeltaTime, TickType, ThisTickFunction );

	TArray samplePoints;
	FVector2D samplePos(InitialPosition.X / 100.0f, InitialPosition.Y / 100.0f);
	samplePoints.Add(samplePos);
	
	WaveWorksComponent->SampleDisplacements(samplePoints, WaveWorksRecieveDisplacementDelegate);
	
	FVector newActorPosition;
	newActorPosition.X = WaveWorksOutDisplacement.X * 100.0f + InitialPosition.X;
	newActorPosition.Y = WaveWorksOutDisplacement.Y * 100.0f + InitialPosition.Y;
	newActorPosition.Z = WaveWorksOutDisplacement.Z * 100.0f + WaveWorksComponent->SeaLevel;
	GetOwner()->SetActorLocation(newActorPosition);
}
```

Over the next week, I’ll be applying the cutting algorithm to this project.