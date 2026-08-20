import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/aeroforge")({
  component: () => <Navigate to="/projects" replace />,
});
