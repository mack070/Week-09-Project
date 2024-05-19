import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { auth } from "@clerk/nextjs/server";
import './globals.css';
import { db } from "@/lib/db";

import React from 'react';
import Image from "next/image";


export default async function RootLayout({ children }) {
  const { userId } = auth();
  const profiles = await db.query(
    `SELECT * FROM profiles WHERE clerk_id = '${userId}'`
  );

    if (profiles.rowCount === 0 && userId !== null) {
      await db.query(`INSERT INTO profiles (clerk_id) VALUES ('${userId}')`);
    }

  return (
    <ClerkProvider>
      <html lang="en">
      <body>
          <header><h2 className='parasocial-logo'>Parasocial</h2>
          <h3>For when you just can't let go</h3>

<nav className='layout-nav'>
<a className='home' link href="/">Home</a>
<a className='about-link' link href="/about">About</a>
<a className='posts-link' link href="/posts">Posts</a>
<a className='update-profile-link' link href="/update-profile">update Profile</a>
</nav>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn className="signIn">
              <UserButton />
            </SignedIn>
          </header>
          <main>
          <section>
          </section>
          {children}
          </main>
          <div><footer className='page-footer'>Parasocial 2024</footer></div>
        </body>
      </html>
    </ClerkProvider>
  )
}
