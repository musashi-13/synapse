import PTree from '@/components/PTree'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Chat</h1>
      <p className="mt-2">This is a placeholder for the chat feature.</p>
      <PTree />
    </div>
  )
}
