const loginForm = document.forms.login;
const nameInput = loginForm.elements.name;
const greeting = document.getElementById("greeting");
const todo = document.forms.todo;
const addBtn = document.getElementById("add-btn");
const itemsDiv = document.getElementById("item-list");
const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const doneBtn = document.getElementById("done-btn");

const itemList = [];
let userName;

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userName = nameInput.value;
    loginForm.hidden = true;
    greeting.hidden = false;
    todo.hidden = false;
    greeting.textContent = `You are welcome, ${userName}!`;
})

itemList.forEach(item => addItem(item));

addBtn.addEventListener('click', () => {
    const addInput = document.createElement('input');
    addInput.name = 'add-input';
    addInput.id = 'add-input';
    addInput.placeholder = 'Add new item';

    addInput.addEventListener('change', () => {
        const item = { 
            name: addInput.value, 
            done: false
        }
        itemList.push(item);
        addItem(item);
        addInput.replaceWith(addBtn);
    })

    addBtn.replaceWith(addInput);
})

allBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const allList = itemsDiv.children;
    itemsDiv.append(...allList);
    // itemList.forEach(item => addItem(item));
});

activeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const allList = Array.from(itemsDiv.children);
    const activeList = allList.filter(item => {
       return !item.querySelector('input').checked
    });
    console.dir(activeList);
    itemsDiv.append(...activeList);
    // itemList.forEach(item => () => {
    //     if (!item.done) {
    //         addItem(item);
    //     }
    // }) 
});

doneBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const allList = Array.from(itemsDiv.children);
    const doneList = allList.filter(item => {
       return item.querySelector('input').checked
    });
    console.dir(doneList);
    itemsDiv.append(...doneList);
    // itemList.forEach(item => () => {
    //     if (item.done) {
    //         addItem(item);
    //     }
    // }) 
});

function addItem (item) {
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
    listItem.append(checkbox, label, editBtn, delBtn);
    itemsDiv.append(listItem);
}

function switchDone (e) {
    const name = e.target.nextElementSibling.textContent;
    idx = itemList.findIndex(item => item.name === name);
    itemList[idx].done = !itemList[idx].done;
}

function editItem (e) {
    const item = e.target.parentElement;
    const label = item.querySelector('label');
    const name = label.textContent;
    const editInput = document.createElement('input');
    editInput.value = name;
    editInput.addEventListener('change', () => {
        label.textContent = editInput.value;
        editInput.replaceWith(item);
        idx = itemList.findIndex(item => item.name === name);
        itemList[idx].name = editInput.value;
    });
    item.replaceWith(editInput);
}

function deleteItem (e) {
    const item = e.target.parentElement;
    const name = item.querySelector('label').textContent;
    item.remove();
    idx = itemList.findIndex(item => item.name === name);
    itemList.splice(idx, 1);
}