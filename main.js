const todos = document.querySelector('#todos');
const tasksArray = JSON.parse(localStorage.getItem('tasksArray')) || [];
const search = document.querySelector('.search-form');


if(tasksArray) {
    tasksArray.forEach(function(ary, index) {
        createTask(ary, todos, index);
})}  

// フォーム内容保存・リセット機能
function addFormEvent(){
    // フォーム内容を格納
    const addTaskForm = document.forms.addTask;
    document.querySelector('#form-btn').addEventListener('click', (e) => {
        const task = {
            content: addTaskForm.content.value,
            priority: addTaskForm.priority.value,
            date: addTaskForm.limit.value
        };
        taskUpdate(task);
        createTask(task, todos);
        // フォームのリセット
        addTaskForm.reset();
    });
};

// タスク作成機能
function createTask(ary, todos, index=''){
    const memo = document.createElement('div');
    memo.classList.add('memo');
    memo.innerHTML = `
    <div class="tools ${ary.priority === "high" ? "high-priority": (ary.priority === "normal" ? "normal-priority" : "low-priority")}">
        <span>期限：${ary.date}</span>
        <span class="priority-input">${ary.priority}</span>
        <div class="edit-delete">
            <button class="edit"><i class="fas fa-edit"></i></button>
            <button class="delete"><i class="fas fa-trash-alt"></i></button>
        </div>
    </div>
    <div class="main ${ary.content ? "" : "hidden"}"></div>
    <textarea class="${ary.content ? "hidden" : ""}"></textarea>
    `   
    const editBtn = memo.querySelector('.edit'),
          deleteBtn = memo.querySelector('.delete'),
          main = memo.querySelector('.main'),
          textArea = memo.querySelector('textarea'); 
    
    textArea.value = ary.content;
    main.innerHTML = marked(ary.content); 

    deleteBtn.addEventListener('click', () => {
        deleteTask(memo, index);
    })

    editBtn.addEventListener('click', () => {
        editTask(main, textArea);
    })

    textArea.addEventListener('input', (e) => {
        const value  = e.target.value;
        ary.content = value;

        taskUpdate();
        
        main.innerHTML = marked(value);
    })
    
    todos.appendChild(memo);
}


// ローカルstorage更新機能
function taskUpdate(task) {
    if(task){
        tasksArray.push(task);
    }
    localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
}


// タスク削除機能
function deleteTask(memo, index) {
    memo.remove();
    tasksArray.splice(index, 1);
    taskUpdate();
}

// タスク編集機能
function editTask(main, textArea) {
    main.classList.toggle('hidden');
    textArea.classList.toggle('hidden');
}

// フィルター機能（単語）
const searchTask = function(term) {
    let fileteredTodo = Array.from(todos.children)
    .filter((todo) => {
        return !todo.innerHTML.toLowerCase().includes(term);
    });
    
    fileteredTodo.forEach((todo) => {
        todo.classList.add('filtered');
    });
};

// フィルター機能（優先度）
const sortTask = function(ele) {
    let fileteredTodo = Array.from(todos.children)
    .filter((todo) => {
        return !todo.innerHTML.includes(ele);
    })

    fileteredTodo.forEach((todo) => {
        todo.classList.add('filtered');
    });
}

addFormEvent();

document.querySelector('#search-btn').addEventListener('click', () => {
    const term = search.value.trim().toLowerCase(); 
    searchTask(term); 
  })

window.addEventListener( "DOMContentLoaded" , ()=> {
 
    document.getElementsByName("prior").forEach(
        r => r.addEventListener("change" ,
                 e => sortTask(e.target.value)
            )
    );

});