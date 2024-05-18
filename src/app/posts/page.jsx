import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import LikeButton from '@/app/like-button';

export default async function Posts() {
  const { userId } = auth();
  const posts = await db.query(`SELECT
                posts.id,
                posts.content,
                profiles.username
            FROM posts
            INNER JOIN profiles ON posts.profile_id = profiles.id;`);


  async function handleAddPost(formData) {
    "use server";
    const content = formData.get("content");

    const result = await db.query(
      `SELECT id FROM profiles WHERE clerk_id = '${userId}'`
    );
    const profileId = result.rows[0].id;

    await db.query(
      `INSERT INTO posts (profile_id, content) VALUES (${profileId}, '${content}')`
    );
  }

  return (
    <div>
      <h2>Posts</h2>
      <SignedIn>
        <h3>Create new post</h3>
        <form className='posts-form' action={handleAddPost}>
          <textarea name="content" placeholder="Is anybody there?"></textarea>
          <LikeButton />
          <button>Submit</button>
        </form>
      </SignedIn>

      <SignedOut>
        <p>You need to sign in to communicate with a spirit.</p>
        <SignInButton />
      </SignedOut>

      <h3>Posts</h3>
      <div className="posts">
        {posts.rows.map((post) => {
          return (
            <div key={post.id}>
              <h4>{post.username} conveys...</h4>
              <p>{post.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}