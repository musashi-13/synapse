import {
    Controls,
    ControlButton,
    useReactFlow
} from '@xyflow/react';
import { MinusIcon, PlusIcon, ShrinkIcon, LockIcon } from 'lucide-react';
import { useState } from 'react';

// This component assumes it will be rendered inside a <ReactFlow> component
export default function CustomControls() {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    const [isInteractive, setIsInteractive] = useState(true);

    // This function would need to be connected to the ReactFlow instance's props
    const toggleInteractivity = () => {
        setIsInteractive(prev => !prev);
        // Note: You'll need to pass `isInteractive` to the <ReactFlow> component's props
        // (e.g., nodesDraggable={isInteractive}) for this to have an effect.
        console.log("Toggling interactivity to:", !isInteractive);
    };

    return (
        <Controls
            showZoom={false}
            showFitView={false}
            showInteractive={false}
            position="center-right"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '4px',
                backgroundColor: 'rgba(24, 24, 27, 0.3)', // zinc-800
                borderRadius: '5px',
                border: '2px solid rgba(82, 82, 92, 0.5)', // zinc-600
                
            }}
        >
            <ControlButton
                onClick={() => zoomIn()}
                title="Zoom In"
                style={{ backgroundColor: '#27272a', border: "none", borderRadius: "4px" }}
            >
                <PlusIcon className="w-5 h-5 text-white" />
            </ControlButton>
            <ControlButton
                onClick={() => zoomOut()}
                title="Zoom Out"
                style={{ backgroundColor: '#27272a', border: "none", borderRadius: "4px"}}
            >
                <MinusIcon className="w-5 h-5 text-white" />
            </ControlButton>
            <ControlButton
                onClick={() => fitView()}
                title="Fit View"
                style={{ backgroundColor: '#27272a', border: "none", borderRadius: "4px" }}
            >
                <ShrinkIcon className="w-5 h-5 text-white" />
            </ControlButton>
        </Controls>
    );
}