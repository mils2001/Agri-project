// API URL for the JSON-Server
const apiUrl = "http://localhost:3000/posts";

// DOM Elements
const postForm = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');

// Fetch and display all posts
async function fetchPosts() {
  try {
    const response = await fetch(apiUrl);
    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// Render posts in the DOM
function renderPosts(posts) {
  postsList.innerHTML = ''; // Clear previous content

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'bg-white p-4 rounded shadow-md';

    postElement.innerHTML = `
      <h3 class="text-xl font-bold">${post.title}</h3>
      <p class="mt-2">${post.content}</p>
      <div class="flex space-x-2 mt-4">
        <button class="edit-btn bg-yellow-500 text-white px-4 py-2 rounded" data-id="${post.id}">Edit</button>
        <button class="delete-btn bg-red-500 text-white px-4 py-2 rounded" data-id="${post.id}">Delete</button>
      </div>
    `;

    postsList.appendChild(postElement);
  });

  attachEventListeners();
}

// Create a new post
postForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPost = {
    title: titleInput.value,
    content: contentInput.value,
  };

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    alert('Post added successfully!');
    postForm.reset();
    fetchPosts();
  } catch (error) {
    console.error('Error adding post:', error);
  }
});

// Attach event listeners to edit and delete buttons
function attachEventListeners() {
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const postId = e.target.dataset.id;
      const confirmDelete = confirm('Are you sure you want to delete this post?');

      if (confirmDelete) {
        await deletePost(postId);
      }
    });
  });

  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const postId = e.target.dataset.id;
      const post = await fetchPostById(postId);

      titleInput.value = post.title;
      contentInput.value = post.content;

      postForm.onsubmit = async (e) => {
        e.preventDefault();
        await updatePost(postId, {
          title: titleInput.value,
          content: contentInput.value,
        });

        postForm.onsubmit = null;
        postForm.reset();
        fetchPosts();
      };
    });
  });
}

// Fetch a single post by ID
async function fetchPostById(id) {
  const response = await fetch(`${apiUrl}/${id}`);
  return response.json();
}

// Update a post
async function updatePost(id, updatedPost) {
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost),
    });

    alert('Post updated successfully!');
  } catch (error) {
    console.error('Error updating post:', error);
  }
}

// Delete a post
async function deletePost(id) {
  try {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    alert('Post deleted successfully!');
    fetchPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

// Initialize the app by fetching all posts
document.addEventListener('DOMContentLoaded', fetchPosts);




