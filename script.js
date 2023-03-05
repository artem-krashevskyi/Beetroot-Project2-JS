const loginForm = document.forms.login;
const nameInput = loginForm.elements.name;
const greeting = document.getElementById("greeting");
const todo = document.forms.todo;
const counter = document.getElementById("counter");
const search = todo.elements.search;
const addBtn = document.getElementById("add-btn");
const itemsDiv = document.getElementById("item-list");
const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const doneBtn = document.getElementById("done-btn");

let userName;
const userStorage = localStorage.getItem('user');

if (userStorage) {
    userName = userStorage;
    login();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userName = nameInput.value;
    localStorage.setItem('user', userName);
    login();
})

const listStorage = localStorage.getItem('list');
const itemList = listStorage ? JSON.parse(listStorage) : [];

if (itemList.length) {
    itemList.forEach((item, idx) => addItem(item, idx));
    updateCounter();
} 

addBtn.addEventListener('click', () => {
    const addInput = document.createElement('input');
    addInput.name = 'add-input';
    addInput.id = 'add-input';
    addInput.placeholder = 'Add new item';

    addInput.addEventListener('change', () => {
        if (itemList.some(item => item.name === addInput.value)) {
            alert("This name already exists!");
        } else {
            const item = { 
                name: addInput.value, 
                done: false
            }
    
            itemList.push(item);
            const idx = itemList.length - 1;
            addItem(item, idx);
            localStorage.setItem('list', JSON.stringify(itemList));
            updateCounter();
            addInput.replaceWith(addBtn);
        }
    });

    addInput.addEventListener('blur', () => {
        addInput.replaceWith(addBtn);
    });

    addBtn.replaceWith(addInput);
})

search.addEventListener('input', filterItems);

allBtn.addEventListener('click', (e) => {
    e.preventDefault();
    itemsDiv.innerHTML = '';
    itemList.forEach((item, idx) => addItem(item, idx));
    if (search.value) filterItems();
});

activeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    itemsDiv.innerHTML = '';
    itemList.forEach((item, idx) => item.done ? false : addItem(item, idx));
    if (search.value) filterItems();
});

doneBtn.addEventListener('click', (e) => {
    e.preventDefault();
    itemsDiv.innerHTML = '';
    itemList.forEach((item, idx) => item.done ? addItem(item, idx) : false);
    if (search.value) filterItems();
});

function login () {
    loginForm.hidden = true;
    greeting.hidden = false;
    todo.hidden = false;
    greeting.textContent = `You are welcome, ${userName}!`;
}
 
function addItem (item, idx) {
    const {name, done} = item;
    const listItem = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = done;
    checkbox.addEventListener('change', switchDone)
    const label = document.createElement('label');
    label.textContent = name;
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', editItem);
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', deleteItem);
    const hiddenIdx = document.createElement('span');
    hiddenIdx.textContent = idx;
    hiddenIdx.hidden = true;
    listItem.append(checkbox, label, editBtn, delBtn, hiddenIdx);
    itemsDiv.append(listItem);
}

function filterItems () {
    for (const item of itemsDiv.children) {
        const name = item.querySelector('label').textContent;
        item.hidden = name.includes(search.value) ? false : true;
    }
}

function switchDone (e) {
    const item = e.target.parentElement;
    const idx = item.querySelector('span').textContent;
    itemList[idx].done = !itemList[idx].done;
    localStorage.setItem('list', JSON.stringify(itemList));
    updateCounter();
}

function editItem (e) {
    const item = e.target.parentElement;
    const label = item.querySelector('label');
    const name = label.textContent;
    const idx = item.querySelector('span').textContent;
    const editInput = document.createElement('input');
    editInput.value = name;

    editInput.addEventListener('change', () => {
        if (itemList.some(item => item.name === editInput.value)) {
            alert("This name already exists!");
        } else {
            itemList[idx].name = editInput.value;
            localStorage.setItem('list', JSON.stringify(itemList));
            label.textContent = editInput.value;
        }
    });
    
    editInput.addEventListener('blur', () => {
        editInput.replaceWith(item);
    });

    item.replaceWith(editInput);
}

function deleteItem (e) {
    const item = e.target.parentElement;
    const idx = item.querySelector('span').textContent;
    itemList.splice(idx, 1);
    localStorage.setItem('list', JSON.stringify(itemList));
    item.remove();
    updateCounter();
}

function updateCounter () {
    const total = itemList.length;
    const done = itemList.reduce((acc, item) => acc = item.done ? ++acc : acc, 0);
    counter.textContent = `${done} from ${total} done`;
}