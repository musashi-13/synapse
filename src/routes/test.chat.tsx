import Conversations from '@/components/Conversations'
import PromptBox from '@/components/PromptBox'
import ReplyNode from '@/components/ReplyNode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='flex relative'>
        <Conversations />
        <div className='relative flex flex-col w-full items-center justify-center'>
            <div className='relative flex flex-col w-full justify-center items-center'>
                <ReplyNode prompt={''} response={''} summary={''} />
            </div>
            <div className='absolute bottom-4 w-full flex justify-center'>
                <PromptBox onSubmit={function (prompt: string): void {
                        throw new Error('Function not implemented.')
                    } } />
            </div>
        </div>
    </div>
}
