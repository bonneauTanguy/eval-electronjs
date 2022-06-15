window.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form')
    let title = document.createElement('h1')
    const el = document.querySelector('#title')
    const list = document.querySelector('#list')
    const rank = document.querySelector('#rank')
    let task
    setTitle()
    window.api.getTask('async:update', (data)=> {
        console.log(data);
        task = data
        setTitle()
        el.value = task.title
        list.value = task.list
        rank.value = task.rank
    });
    await window.task.getLists('async:update', (data) => {
        console.log(data);
    })
    form.prepend(title)
    form.addEventListener('submit', submitForm)
    function submitForm(e) {
        e.preventDefault();
        if (task) {
            updateTask({id: task.id, title: el.value, rank: rank.value})
        } else {
            addTask(el.value, rank.value, list.value)

        }
    }

    function addTask(data) {
        if (data) {
            window.api.send("task:add", data)
        } else {
            console.log('Data obligatoire');
        }
    }

    function updateTask(data) {
        if (data) {
            window.api.send("task:update:persist", data)
        } else {
            console.log('Data obligatoire');
        }
    }

    function setTitle() {
        if (task) {
            title.innerText = 'Mise à jour'
        } else {
            title.innerText = 'Ajout'
        }
    }
})