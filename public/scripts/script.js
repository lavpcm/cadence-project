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
      let errorBody;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${JSON.stringify(errorBody)}`);
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
          <div class="habit-actions">
            <button onclick="openEditHabitPopup('${habit.id}', '${habit.title}', '${habit.category ? habit.category.id : ''}', '${habit.frequency}', '${habit.more_info || ''}')">Edit</button>
            <button onclick="deleteHabit('${habit.id}')">Delete</button>
          </div>
        ` : ''}
      `;
      habitList.appendChild(habitCard);
    });
  } catch (error) {
    console.error('Error loading habits:', {
      message: error.message,
      stack: error.stack
    });
    // Avoid alert to prevent duplicate error messages
    // alert('Failed to load habits. Please check the server.');
  }
}

// Open edit habit popup
function openEditHabitPopup(id, title, category_id, frequency, more_info) {
  document.getElementById('editHabitName').value = title;
  document.getElementById('editHabitDescription').value = more_info;
  document.getElementById('editHabitPopup').style.display = 'flex';
  document.querySelector('#editHabitForm button[type="submit"]').setAttribute('onclick', `updateHabit('${id}')`);

  // Load categories
  loadCategoriesForEdit(category_id);

  // Set frequency checkboxes
  const frequencyDays = frequency ? frequency.split(',').map(day => day.trim()) : [];
  document.querySelectorAll('#editHabitForm .days input').forEach(checkbox => {
    checkbox.checked = frequencyDays.includes(checkbox.value);
  });
}

// Load categories for edit popup
async function loadCategoriesForEdit(selectedCategoryId) {
  const select = document.getElementById('editHabitCategory');
  if (!select) return;
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
      if (category.id == selectedCategoryId) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
    alert('Failed to load categories');
  }
}

// Close edit habit popup
function closeEditHabitPopup() {
  document.getElementById('editHabitPopup').style.display = 'none';
  document.getElementById('editHabitForm').reset();
}

// Update a habit
async function updateHabit(habitId) {
  const title = document.getElementById('editHabitName').value.trim();
  const category_id = document.getElementById('editHabitCategory').value;
  const more_info = document.getElementById('editHabitDescription').value.trim();
  const frequency = Array.from(document.querySelectorAll('#editHabitForm .days input:checked')).map(input => input.value).join(',');
  const active = true; // Ensure active is sent to satisfy NOT NULL constraint

  if (!title || !category_id) {
    alert('Habit title and category are required');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/habit/${habitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category_id, frequency, more_info, active })
    });

    // Log response details for debugging
    let responseBody;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = await response.text();
    }
    console.log('Update habit response:', { status: response.status, ok: response.ok, body: responseBody });

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      closeEditHabitPopup();
      await loadHabits(); // Reload habits to confirm update
      alert('Habit updated successfully'); // Confirm success
    } else {
      const errorMessage = responseBody.message || JSON.stringify(responseBody) || `HTTP error ${response.status}`;
      console.error('Failed to update habit:', { status: response.status, message: errorMessage });
      alert(`Failed to update habit: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error updating habit:', { message: error.message, stack: error.stack });
    // Verify if update was applied despite fetch error
    await loadHabits(); // Attempt to reload habits
    const habitList = document.getElementById('habitList').innerHTML;
    if (habitList.includes(title)) {
      closeEditHabitPopup();
      alert('Habit updated successfully (confirmed via reload)');
    } else {
      alert(`Error updating habit: ${error.message || 'Network or server error'}`);
    }
  }
}

// Delete a habit
async function deleteHabit(habitId) {
  if (!confirm('Are you sure you want to delete this habit?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/habit/${habitId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      loadHabits();
    } else {
      let errorMessage = 'Unknown error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP error ${response.status}`;
      }
      console.error('Failed to delete habit:', { status: response.status, message: errorMessage });
      alert(`Failed to delete habit: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error deleting habit:', { message: error.message, stack: error.stack });
    alert(`Error deleting habit: ${error.message || 'Network or server error'}`);
  }
}