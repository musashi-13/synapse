import { Link } from '@tanstack/react-router'

import ClerkHeader from '../integrations/clerk/header-user.tsx'

export default function Header() {
  return (
    <header className="absolute top-0 z-50 w-full p-2 flex gap-2 justify-between">
      <nav className="flex flex-row">   
        <h1 className='flex font-bold items-center gap-2 text-lg'>
          <svg width="28" height="28" aria-label="Logo">
            <image href="/logo.svg" width="28" height="28" style={{ filter: 'invert(1)' }} />
          </svg>
          Synapse
        </h1>
      </nav>

      <div>
        <ClerkHeader />
      </div>
    </header>
  )
}
