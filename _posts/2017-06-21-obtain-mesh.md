---
layout: post
title:  "Week 2 of Development – Obtain mesh data from the GPU"
date:   2017-06-21
excerpt: "Before I get to the physics meat of the project, I need to have a water body to put the boat on."
image: "/images/Posts/2017-06-21/oceancsWireframe.gif"
comments: true
---
Since I am using pre-existing code to simulate a body of water on the GPU, my project is much easier. I am using the DirectX 11 SDK sample by nVidia that implemented Tessendorf waves to showcase GPU Compute on their graphics cards.

I set up the Visual Studio solution such that the OceanCS project will be separate from the project that I create for my simulation. This was done to clearly separate the code that I am writing for the project and the code that came with OceanCS. All I have to do now, is to get the data being processed in the Geometry Shader stage of the sample and use it to find where it intersects with the boat. Well, that’s easier said than done.

It’s day 1 of my 2nd week on this project and I’ve been going through the code of the OceanCS project to figure out where I can capture the Vertex data from. It’s mostly written in C using the DXUT library, which is really old now. The game loop is within the DXUTMainLoop function call which is a part of the DXUT library. Standard callback functions are provided by the library where you can put all your code in. So there is a callback for creating and manipulating each stage of the graphics pipeline.

```
//--------------------------------------------------------------------------------------
// Entry point to the program. Initializes everything and goes into a message processing
// loop. Idle time is used to render the scene.
//--------------------------------------------------------------------------------------
int WINAPI WinMain( HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow )
{
	HRESULT hr;
	V_RETURN(DXUTSetMediaSearchPath(L"..\\Source\\OceanCS"));
	// Enable run-time memory check for debug builds.
	#if defined(DEBUG) | defined(_DEBUG)
	_CrtSetDbgFlag( _CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF );
	#endif
	
	// Disable gamma correction on this sample
	DXUTSetIsInGammaCorrectMode( false );
	
	DXUTSetCallbackDeviceChanging( ModifyDeviceSettings );
	DXUTSetCallbackMsgProc( MsgProc );
	DXUTSetCallbackFrameMove( OnFrameMove );
	
	DXUTSetCallbackD3D11DeviceAcceptable( IsD3D11DeviceAcceptable );
	DXUTSetCallbackD3D11DeviceCreated( OnD3D11CreateDevice );
	DXUTSetCallbackD3D11SwapChainResized( OnD3D11ResizedSwapChain );
	DXUTSetCallbackD3D11FrameRender( OnD3D11FrameRender );
	DXUTSetCallbackD3D11SwapChainReleasing( OnD3D11ReleasingSwapChain );
	DXUTSetCallbackD3D11DeviceDestroyed( OnD3D11DestroyDevice );
	
	InitApp();
	
	// Force create a ref device so that feature level D3D_FEATURE_LEVEL_11_0 is guaranteed
	DXUTInit( true, true ); // Parse the command line, show msgboxes on error, no extra command line params
	
	DXUTSetCursorSettings( true, true ); // Show the cursor and clip it when in full screen
	DXUTCreateWindow( L"DirectCompute Ocean" );
	DXUTCreateDevice( D3D_FEATURE_LEVEL_10_0, true, 1280, 720 );
	DXUTMainLoop(); // Enter into the DXUT render loop
	
	return DXUTGetExitCode();
}
```

That is how the WinMain entrypoint looks. The InitApp() function is a non DXUT function that initializes all the essential components for the program. Delving deeper into the program, I figure out that the render.cpp is running the shader to render to the screen; I realize that this must be the file that controls the Buffer that holds the data of the displacement map. Surely enough, I find the method renderWireframe here and get access to its Vertex Buffer.

Having very little knowledge about graphics programming at this point, I thought that this would suffice for my purposes of accessing the mesh data. It was only when I tried to read out the data to a file for debugging that I realized that wasn’t the case. I approached my professor to ask him about how I can access mesh data from the GPU. It was then that I was told that the Stream Output Stage in the graphics pipeline was what I needed the data from.

<figure style="text-align:center; font-size: 17px;">
	<img src="/images/Posts/2017-06-21/graphics-pipeline_stream-output.jpg"/>
	<figcaption><i>The stream output stage occurs after the shader stages in the graphics pipeline</i></figcaption>
</figure>

Once I figured that out, I found where the displacement map was being updated and placed a buffer there to capture that data to the main memory.

```
#ifdef SO_ENABLE
{ 
    m_pd3dImmediateContext->CopyResource(m_pDebugBuffer, m_pBuffer_Float_Dxyz);
    m_pd3dImmediateContext->Map(m_pDebugBuffer, 0, D3D11_MAP_READ, 0, &mapped_res);
    // Write to main memory D3DXVECTOR3* capturedMesh = (D3DXVECTOR3*)mapped_res.pData; capturedMesh;
    #ifdef SO_FILE_IO 
    //Write to disk 
    FILE* fp; 
    errno_t error = fopen_s(&fp, "Mesh_raw.txt", "w"); 
    if (error) 
    { 
        printf("Error type: %i", error);
    } 
    else 
   {
#ifdef SO_FILE_BINARY 
        fwrite(capturedMesh, 512 * 512 * sizeof(float) * 2 * 3, 1, fp);
#else 
        int verts = 524288; // (512 * 512 * 2 * 3) / 3 
        for (int i = 0; i < verts; ++i) 
        { 
            fprintf(fp, "%f, %f, %f\n", capturedMesh[i].x, capturedMesh[i].y, capturedMesh[i].z); 
        }
#endif 
    } 
    fclose(fp);
#endif 
    m_pd3dImmediateContext->Unmap(m_pDebugBuffer, 0);    
}
#endif
```

The data that I captured was a seemingly accurate list of all the vertices being rendered on the Ocean surface, as was confirmed by the text file that I wrote to. The performance took a huge hit though. I went from getting a steady 400 fps to somewhere between 270 fps and 290 fps (my laptop has an nVidia GTX 980M GPU and I was running it on power supply).

Next week, I’ll be utilizing the rendering pipeline to enable me to add boat objects to the scene.