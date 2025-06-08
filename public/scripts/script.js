const API_BASE_URL = 'http://localhost:3000/api';

// Load habits on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('habitList')) {
    loadHabits();
  }
});

// Open/close habit popup
function openHabitPopup() {
  document.getElementById('createHabitPopup').style.display = 'flex';
  loadCategories();
}

function closeHabitPopup() {
  document.getElementById('createHabitPopup').style.display = 'none';
  document.getElementById('habitForm').reset();
}

// Open/close category popup
function openCategoryPopup() {
  document.getElementById('createCategoryPopup').style.display = 'flex';
}

function closeCategoryPopup() {
  document.getElementById('createCategoryPopup').style.display = 'none';
  document.getElementById('categoryName').value = '';
}

// Load categories from API
async function loadCategories() {
  const select = document.getElementById('habitCategory');
  if (!select) return; // Avoid errors if not on habits page
  select.innerHTML = '<option value="">Select a category</option>';

  try {
    const response = await fetch(`${API_BASE_URL}/category`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const categories = await response.json();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.category_type;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
    alert('Failed to load categories');
  }
}

// Create a new category
async function createCategory() {
  const category_type = document.getElementById('categoryName').value.trim();
  if (!category_type) {
    alert('Category type is required');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_type })
    });
    if (response.ok) {
      closeCategoryPopup();
      loadCategories();
    } else {
      const error = await response.text();
      console.error('Failed to create category:', error);
      alert(`Failed to create category: ${error}`);
    }
  } catch (error) {
    console.error('Error creating category:', error);
    alert('Error creating category');
  }
}

// Create a new habit
async function createHabit() {
  const title = document.getElementById('habitName').value.trim();
  const category_id = document.getElementById('habitCategory').value;
  const more_info = document.getElementById('habitDescription').value.trim();
  const frequency = Array.from(document.querySelectorAll('.days input:checked')).map(input => input.value).join(',');

  if (!title || !category_id) {
    alert('Habit title and category are required');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/habit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category_id, frequency, more_info })
    });
    if (response.ok) {
      closeHabitPopup();
      loadHabits();
    } else {
      const error = await response.text();
      console.error('Failed to create habit:', error);
      alert(`Failed to create habit: ${error}`);
    }
  } catch (error) {
    console.error('Error creating habit:', error);
    alert('Error creating habit');
  }
}

// Toggle habit completion status
async function toggleHabitDone(habitId, done) {
  const current_day = new Date().toISOString().split('T')[0];
  try {
    const response = await fetch(`${API_BASE_URL}/habit/${habitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_day, done })
    });
    if (response.ok) {
      loadHabits(); // Refresh habit list
    } else {
      const error = await response.text();
      console.error('Failed to update habit status:', error);
      alert(`Failed to update habit status: ${error}`);
    }
  } catch (error) {
    console.error('Error updating habit status:', error);
    alert('Error updating habit status');
  }
}

// Load and display habits
async function loadHabits() {
  try {
    const response = await fetch(`${API_BASE_URL}/habit`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const habits = await response.json();
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    const isTrackerPage = window.location.pathname === '/tracker';
    habits.forEach(habit => {
      const done = habit.tracker && habit.tracker.done ? 'checked' : '';
      const habitCard = document.createElement('div');
      habitCard.className = 'habit-card';
      habitCard.innerHTML = `
        <h3>${habit.title}</h3>
        <p>Category: ${habit.category ? habit.category.category_type : 'None'}</p>
        <p>Frequency: ${habit.frequency}</p>
        ${habit.more_info ? `<p>Description: ${habit.more_info}</p>` : ''}
        ${isTrackerPage ? `
          <label>
            <input type="checkbox" ${done} onchange="toggleHabitDone('${habit.id}', this.checked)">
            Done today
          </label>
        ` : ''}
      `;
      habitList.appendChild(habitCard);
    });
  } catch (error) {
    console.error('Error loading habits:', error);
    alert('Failed to load habits. Please check the server.');
  }
}