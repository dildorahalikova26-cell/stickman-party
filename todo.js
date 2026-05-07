// TODO LIST STORAGE KEY
const STORAGE_KEY = 'todoListData';
let todos = [];
let currentFilter = 'all';
let currentSort = 'newest';
let editingId = null;

// TODOS NI LOAD QILISH
function loadTodos() {
    const data = localStorage.getItem(STORAGE_KEY);
    todos = data ? JSON.parse(data) : [];
    renderTodos();
    updateStats();
    updateDate();
}

// TODOS NI SAVE QILISH
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// YANGI TODO QO'SHISH
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (!text) {
        alert('Iltimos, vazifa matnini kiriting!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        category: 'personal',
        createdAt: new Date().toLocaleString('uz-UZ'),
        dueDate: ''
    };

    todos.unshift(newTodo);
    saveTodos();
    input.value = '';
    renderTodos();
    updateStats();
}

// TODO RENDER QILISH
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const emptyState = document.getElementById('emptyState');
    todoList.innerHTML = '';

    // Filter qilish
    let filteredTodos = todos;
    if (currentFilter !== 'all') {
        filteredTodos = todos.filter(todo => todo.category === currentFilter);
    }

    // Sort qilish
    let sortedTodos = [...filteredTodos];
    if (currentSort === 'oldest') {
        sortedTodos.reverse();
    } else if (currentSort === 'completed') {
        sortedTodos.sort((a, b) => a.completed - b.completed);
    } else if (currentSort === 'pending') {
        sortedTodos.sort((a, b) => b.completed - a.completed);
    }

    if (sortedTodos.length === 0) {
        emptyState.classList.add('active');
        todoList.style.display = 'none';
        return;
    }

    emptyState.classList.remove('active');
    todoList.style.display = 'block';

    sortedTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <div class="todo-content">
                <div class="todo-text">${escapeHtml(todo.text)}</div>
                <div style="display: flex; gap: 10px; font-size: 12px;">
                    <span class="todo-category ${todo.category}">${getCategoryEmoji(todo.category)} ${getCategoryName(todo.category)}</span>
                    <span class="todo-date">📅 ${todo.createdAt}</span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="btn-edit" onclick="editTodo(${todo.id})" title="Tahrirlash">✏️</button>
                <button class="btn-delete" onclick="deleteTodo(${todo.id})" title="O'chirish">🗑️</button>
            </div>
        `;
        todoList.appendChild(todoItem);
    });
}

// TODO NI BAJARILGAN QILISH
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// TODO NI O'CHIRISH
function deleteTodo(id) {
    if (confirm('Bu vazifani o\'chirasizmi?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// TODO NI TAHRIRLASH
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    editingId = id;
    document.getElementById('editText').value = todo.text;
    document.getElementById('editCategory').value = todo.category;
    document.getElementById('editModal').classList.add('active');
}

// TAHRIRLASHNI SAQLASH
function saveEdit() {
    const text = document.getElementById('editText').value.trim();
    const category = document.getElementById('editCategory').value;

    if (!text) {
        alert('Vazifa matnini bo\'sh qoldirib bo\'lmaydi!');
        return;
    }

    const todo = todos.find(t => t.id === editingId);
    if (todo) {
        todo.text = text;
        todo.category = category;
        saveTodos();
        closeEditModal();
        renderTodos();
    }
}

// TAHRIRLASH MODALI YOPISH
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    editingId = null;
}

// BAJARILGANLARNI O'CHIRISH
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('Bajarilgan vazifa yo\'q!');
        return;
    }

    if (confirm(`${completedCount} ta bajarilgan vazifani o'chirasizmi?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// HAMMANI O'CHIRISH
function deleteAll() {
    if (todos.length === 0) {
        alert('Vazifa yo\'q!');
        return;
    }

    if (confirm(`${todos.length} ta BARCHA vazifani o'chirasizmi? Bu qaytarilmaydi!`)) {
        if (confirm('Rosdan ham?')) {
            todos = [];
            saveTodos();
            renderTodos();
            updateStats();
        }
    }
}

// STATISTIKA UPDATE QILISH
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('pendingCount').textContent = pending;
}

// KATEGORIYA FILTER QILISH
function filterCategory(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTodos();
}

// SORT QILISH
function sortTodos() {
    currentSort = document.getElementById('sortSelect').value;
    renderTodos();
}

// SANA UPDATE QILISH
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('uz-UZ', options);
    document.getElementById('currentDate').textContent = today;
}

// HELPER FUNCTIONS
function getCategoryEmoji(category) {
    const emojis = { work: '💼', personal: '👤', shopping: '🛒' };
    return emojis[category] || '📌';
}

function getCategoryName(category) {
    const names = { work: 'Ish', personal: 'Shaxsiy', shopping: 'Xarid' };
    return names[category] || 'Boshqa';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ENTER TUGMASINI QABUL QILISH
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // EDIT MODAL NI HTML'GA QO'SHISH
    const editModalHtml = `
        <div id="editModal" class="modal">
            <div class="modal-content">
                <h2>✏️ VAZIFANI TAHRIRLASH</h2>
                <input type="text" id="editText" placeholder="Vazifa matnini kiriting...">
                <select id="editCategory">
                    <option value="personal">👤 Shaxsiy</option>
                    <option value="work">💼 Ish</option>
                    <option value="shopping">🛒 Xarid</option>
                </select>
                <div class="modal-buttons">
                    <button class="btn-save" onclick="saveEdit()">💾 SAQLASH</button>
                    <button class="btn-cancel" onclick="closeEditModal()">❌ BEKOR QILISH</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', editModalHtml);
});
