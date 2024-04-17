import React, { useState } from "react";
import Constants from "./utilities/Constants";
import PostCreateForm from "./components/PostCreateForm";
import PostUpdateForm from "./components/PostUpdateForm";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] =
    useState(false);
    const [postCurrentlyBeginUpdated, setPostCurrentlyBeginUpdated] =
    useState(null);

  function getPosts() {
    const url = Constants.API_URL_GET_ALL_POSTS;

    fetch(url, {
      method: "GET"
    })
      .then(response => response.json())
      .then((postFromServer) => {
        setPosts(postFromServer);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  
  function deletePost(id){
    const url = `${Constants.API_URL_DELETE_POST_BY_ID}?id=${id}`;

    fetch(url, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then((responseFromServer) => {
        console.log(responseFromServer);
        onPostDeleted(id);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {(showingCreateNewPostForm === false && postCurrentlyBeginUpdated === null) && (
            <div>
              <h1>ASP.Net Core React Tutorial</h1>
              <div className="mt-5">
                <button
                  onClick={getPosts}
                  className="btn btn-lg btn-dark w-100"
                >
                  Get Posts From Server
                </button>
                <button
                  onClick={() => setShowingCreateNewPostForm(true)}
                  className="btn btn-lg btn-secondary w-100 mt-4"
                >
                  Create New Post
                </button>
              </div>
            </div>
          )}

          {(posts.length > 0 && 
            showingCreateNewPostForm === false && postCurrentlyBeginUpdated === null ) &&
            renderPostsTable()}

          {showingCreateNewPostForm && 
            <PostCreateForm onPostCreated={onPostCreated} />
          }

          {postCurrentlyBeginUpdated !== null && <PostUpdateForm post={postCurrentlyBeginUpdated} onPostUpdated={onPostUpdated} />}
        </div>
      </div>
    </div>
  );

  function renderPostsTable() {
    return (
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Title</th>
              <th scope="col">Content</th>
              <th scope="col">CRUD Operation</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <th scope="row">{post.id}</th>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>
                  <button className="btn btn-dark mx-3 my-3" onClick={()=>setPostCurrentlyBeginUpdated(post)}>Update</button>
                  <button className="btn btn-danger mx-3 my-3" onClick={()=> {if(window.confirm(`Are you sure you want to delete the post titled "${post.title}"?`)) deletePost(post.id)}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setPosts([])} className="btn btn-dark w-100 ">
          Empty React Post
        </button>
      </div>
    );
  }

  function onPostCreated(createdPost) {
    setShowingCreateNewPostForm(false);

    if (createdPost === null) {
      return;
    }

    alert(
      `Post successfully created . After clicking OK , your new post titled "${createdPost.title}" will show up in the table below.`
    );

    getPosts();
  }

  function onPostUpdated(updatePost) {
    setPostCurrentlyBeginUpdated(null);

    if(updatePost === null){
      return;
    }

    let postsCoppy = [...posts];

    const index = postsCoppy.findIndex((postsCoppyPost, currentIndex) => {
      if(postsCoppyPost.id === updatePost.id){
        return true;
      }
    });

    if(index !== -1){
      postsCoppy[index] = updatePost;
    }

    setPosts(postsCoppy);

    alert(`Post successffully updated . After clicking OK , look for the post with title "${updatePost.title}" in the table below to see the update.`);
  }

  function onPostDeleted(deletedPostId) {
    
    let postsCoppy = [...posts];

    const index = postsCoppy.findIndex((postsCoppyPost, currentIndex) => {
      if(postsCoppyPost.id === deletedPostId){
        return true;
      }
    });

    if(index !== -1){
      postsCoppy.splice(index, 1);
    }

    setPosts(postsCoppy);

    alert(`Post successffully deleted . After clicking OK , look at the table below to see your post disappear.`);
  }

}
