import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import LikeButton from '@/app/like-button';
import React from 'react';

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
    <div className="PostsFormDiv">
      <h2>posts</h2>
      <SignedIn className="signIn">
        <h3>Create new post</h3>
        <form className='posts-form' action={handleAddPost}>
          <textarea name="content" placeholder="Is anybody there?"></textarea>
          < LikeButton />
          <button className="submitButton">Submit</button>
        </form>
      </SignedIn>

      <SignedOut>
        <p>You need to sign in to communicate with a spirit.</p>
        <SignInButton />
      </SignedOut>

      <h3>All posts</h3>
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