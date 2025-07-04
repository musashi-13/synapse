import PTree from '@/components/PTree'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="text-white">
      <div className='flex'>
        <div className='w-64 shrink-0 bg-zinc-900'>
            <h2>Conversations</h2>
        </div>
        <PTree />
      </div>
    </div>
  )
}
