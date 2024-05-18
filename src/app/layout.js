import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { auth } from "@clerk/nextjs/server";
import './globals.css';
import { db } from "@/lib/db";

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
          <header><h2>Parasocial</h2>
          <h3>For when you just can't let go</h3>
          <p>Hello and welcome to Parasocial the transcedent new social media platform that allows you to stay in touch with your dearly parted after they've moved on to the next life.</p>

<nav className='layout-nav'>
<a className='home' link href="/">Home</a>
<a className='about-link' link href="/about">About</a>
<a className='posts-link' link href="/posts">Posts</a>
<a className='following-link' link href="/following">Following</a>
</nav>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>
          <section>
            <h2>Hello I'm a section</h2>
          </section>
          <section>
            <h2>Hello I'm another section</h2>
          </section>
            {children}
          </main>
          <footer className='page-footer'>Parasocial 2024</footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
