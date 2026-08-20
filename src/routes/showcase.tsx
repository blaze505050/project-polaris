import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/showcase")({
  component: () => <Navigate to="/about" hash="showcase" replace />,
});
