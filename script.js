const markdownInput = document.getElementById('markdown');
const preview = document.getElementById('preview');
const saveBtn = document.getElementById('saveBtn');
const updateBtn = document.getElementById('updateBtn');
const titleInput = document.getElementById('title');
const blogList = document.getElementById('blogList');
const modal = document.getElementById('savedBlogs');
const viewBlogsBtn = document.getElementById('viewBlogsBtn');

let currentEditIndex = null;

markdownInput.addEventListener('input', () => {
  preview.innerHTML = marked.parse(markdownInput.value);
});

saveBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const content = markdownInput.value;

  if (!title || !content) {
    showToast('Title and content are required!', 'error');
    return;
  }

  const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  blogs.push({ title, content, date: new Date().toLocaleString() });
  localStorage.setItem('blogs', JSON.stringify(blogs));

  showToast('Blog saved successfully!');
  resetEditor();
});

updateBtn.addEventListener('click', () => {
  const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  if (currentEditIndex !== null && blogs[currentEditIndex]) {
    blogs[currentEditIndex].title = titleInput.value;
    blogs[currentEditIndex].content = markdownInput.value;
    blogs[currentEditIndex].date = new Date().toLocaleString();
    localStorage.setItem('blogs', JSON.stringify(blogs));
    showToast('Blog updated!', 'edit');
    resetEditor();
    closeModal();
  }
});

viewBlogsBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  renderSavedBlogs();
});

function closeModal() {
  modal.classList.add('hidden');
  currentEditIndex = null;
}

function renderSavedBlogs() {
  const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  blogList.innerHTML = '';

  blogs.reverse().forEach((blog, index) => {
    const actualIndex = blogs.length - 1 - index;
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${blog.title} <small>(${blog.date})</small></h3>
      <div>${marked.parse(blog.content)}</div>
      <button class="edit" onclick="editBlog(${actualIndex})">✏️ Edit</button>
      <button onclick="deleteBlog(${actualIndex})">🗑️ Delete</button>
    `;
    blogList.appendChild(li);
  });
}

function editBlog(index) {
  const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  const blog = blogs[index];
  titleInput.value = blog.title;
  markdownInput.value = blog.content;
  preview.innerHTML = marked.parse(blog.content);
  currentEditIndex = index;
  saveBtn.classList.add('hidden');
  updateBtn.classList.remove('hidden');
  modal.classList.add('hidden');
}

function deleteBlog(index) {
  const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
  if (confirm('Are you sure you want to delete this blog?')) {
    blogs.splice(index, 1);
    localStorage.setItem('blogs', JSON.stringify(blogs));
    showToast('Blog deleted!', 'error');
    renderSavedBlogs();
  }
}

function resetEditor() {
  titleInput.value = '';
  markdownInput.value = '';
  preview.innerHTML = '';
  saveBtn.classList.remove('hidden');
  updateBtn.classList.add('hidden');
  currentEditIndex = null;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show`;

  if (type === 'error') toast.classList.add('error');
  if (type === 'edit') toast.classList.add('edit');

  setTimeout(() => {
    toast.classList.remove('show', 'error', 'edit');
  }, 3000);
}