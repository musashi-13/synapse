import { Link } from '@tanstack/react-router'

import ClerkHeader from '../integrations/clerk/header-user.tsx'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">   
        <h1>Synapse</h1>
        <div className="px-2 font-bold">
            <Link to="/chat">Chat</Link>
        </div>
      </nav>

      <div>
        <ClerkHeader />
      </div>
    </header>
  )
}
