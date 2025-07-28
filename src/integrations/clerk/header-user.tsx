import {
  SignedIn,
  SignInButton,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'

export default function HeaderUser() {
  return (
    <>
      <SignedIn>
        <UserButton 
        appearance={
            {
                elements: {
                userButtonAvatarBox: 'w-10 h-10 border-2 border-zinc-600/50',
                userButtonAvatar: 'rounded-full',
                userButtonAction: 'hidden',
                },
            }
        }
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-lg bg-zinc-800 border-2 border-zinc-600/50">
                Sign In
            </button>
        </SignInButton>
      </SignedOut>
    </>
  )
}
