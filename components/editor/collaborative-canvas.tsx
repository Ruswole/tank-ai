"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  MiniMap,
  ReactFlow,
  MarkerType,
} from "@xyflow/react";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useErrorListener,
} from "@liveblocks/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { useMemo, useState } from "react";

import type { CanvasEdge, CanvasNode } from "@/types/canvas";

function CanvasErrorFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-bg-base text-copy-primary">
      <div className="rounded-2xl border border-state-error/40 bg-bg-subtle px-5 py-4 text-center text-sm text-copy-secondary">
        Liveblocks connection issue. Please refresh or try again.
      </div>
    </div>
  );
}

function CanvasRoom({ roomId }: { roomId: string }) {
  const [hasRoomError, setHasRoomError] = useState(false);

  useErrorListener(() => {
    setHasRoomError(true);
  });

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      nodes: { initial: [] as CanvasNode[] },
      edges: { initial: [] as CanvasEdge[] },
      suspense: true,
    });

  const edgeOptions = useMemo(
    () => ({
      type: "smoothstep",
      animated: false,
      markerEnd: { type: MarkerType.ArrowClosed, color: "#f8fafc" },
      style: { stroke: "#f8fafc", strokeWidth: 1.2 },
    }),
    [],
  );

  if (hasRoomError) {
    return <CanvasErrorFallback />;
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes ?? []}
        edges={edges ?? []}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        defaultEdgeOptions={edgeOptions}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="bg-bg-base"
      >
        <Background color="#2a2a30" gap={24} size={1} />
        <MiniMap
          pannable
          zoomable
          bgColor="#111114"
          nodeColor={(node) => {
            const color = (node.data as { color?: string } | undefined)?.color;
            return color ?? "#1F1F1F";
          }}
          maskColor="rgba(17, 17, 20, 0.7)"
          className="!rounded-xl !border !border-surface-border !bg-bg-subtle"
        />
      </ReactFlow>
    </div>
  );
}

export function CollaborativeCanvas({ roomId }: { roomId: string }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <ClientSideSuspense fallback={<div className="h-full w-full bg-bg-base" />}>
          <CanvasRoom roomId={roomId} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
