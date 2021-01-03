//creating Task list class
class Task{
    constructor(taskName,taskDate,taskTime,taskAssigned,taskId){
        this.taskName = taskName;
        this.taskDate = taskDate;
        this.taskTime = taskTime;
        this.taskAssigned = taskAssigned;
        this.taskId = taskId;
    }
}

//UI class
class UI{

    //display Output prototype
    displayOutput(task){
        //getting task table from ui
        const taskTabel = document.querySelector('#task-list');
        //creating element
        const row = document.createElement('tr');
        //assigning htmlnode
        row.innerHTML = `<td class="collapsing">
        <div class="ui fitted slider checkbox">
          <input type="checkbox" class="delete"> <label></label>
        </div>
        <td>${task.taskName}</td>
        <td>${task.taskDate}</td>
        <td>${task.taskTime}</td>
        <td>${task.taskAssigned}</td>
        <td>${task.taskId}</td>`;
        //inserting into the UI table
        taskTabel.appendChild(row);
        taskTabel.style.cssText = "transition: 1s all ease-in;"
    }

    //clear fileds prototype
    clearFields(){
        document.querySelector('#task-name').value ='';
        document.querySelector('#task-date').value ='';
        document.querySelector('#task-time').value ='';
        document.querySelector('#task-by').value ='';
        document.querySelector('#task-id').value ='';
    }

    //showalert prototype
    showAlert(primaryMsg,secondaryMsg,className){
        //get parent
        const conatiner = document.querySelector('.container');
        //get form
        const form = document.querySelector('#task-form');
        //Crate a element
        const div = document.createElement('div');
        //msg feture of semantic ui
         div.innerHTML= `
        <div class="header">
          ${primaryMsg}
        </div>
        <p>${secondaryMsg}</p>`
        //Create class
        div.className = `ui message alert ${className}`;
        // //add text
        // div.appendChild(document.createTextNode(msg));
        //insert msg
        conatiner.insertBefore(div,form);

        setTimeout(function(){
            document.querySelector('.alert').remove();
        },1500);

    }

    //delete prototype
    deleteItem(target){
        if(target.className === 'slider' || target.className === 'checkbox' || target.className === 'delete'){
            target.parentElement.parentElement.parentElement.remove();    
        }
    }
}
//Store class for Local Storage
class Store{
    static getData(){
        let datas;
        if(localStorage.getItem('datas') === null){
            datas= [];
        }else{
            datas = JSON.parse(localStorage.getItem('datas'));
        }
        return datas;
    }
    static displayData(){
        const datas = Store.getData();
        datas.forEach(function(data){
            const ui = new UI();

            //Add book to UI
            ui.displayOutput(data);
        });
    }
    static addData(data){
        const datas = Store.getData();
        datas.push(data);
        localStorage.setItem('datas',JSON.stringify(datas));
    }
    static removeData(taskId){
        const datas = Store.getData();
        datas.forEach(function(data, index){
            if(data.taskId === taskId){
                datas.splice(index, 1);
            }
        });
        localStorage.setItem('datas',JSON.stringify(datas));
    }
}

//Dom load event
document.addEventListener('DOMContentLoaded', Store.displayData);

//Event listner to listen submit
document.querySelector('#task-form').addEventListener('submit',function(e){
    //Get inputs
    const taskName = document.querySelector('#task-name').value,
          taskDate = document.querySelector('#task-date').value,
          taskTime = document.querySelector('#task-time').value,
          taskFor = document.querySelector('#task-by').value,
          taskId = document.querySelector('#task-id').value;
    
    //insitaing object for task
    const task = new Task(taskName,taskDate,taskTime,taskFor,taskId);

    //insitating UI 
    const ui = new UI();

    //validation
    if(taskName === '' || taskDate === '' || taskTime === '' || taskFor === ''|| taskId === ''){
        ui.showAlert('Please fill all the fileds','Then try again','error');
    }else{
        //Display outputlist
        ui.displayOutput(task);

        //store data to LS
        Store.addData(task);
        
        //Clearfiled
        ui.clearFields();

        //show alert
        ui.showAlert('Task assinged successfully',`Task assinged to ${taskFor}`,'success');
    }

    e.preventDefault();
});

//Event listner for delete
document.querySelector('#task-list').addEventListener('click',function(e){

    //instantiate Ui
    const ui = new UI();

    //delete function
    ui.deleteItem(e.target);

    //Remove from LS
    Store.removeData(e.target.parentElement.parentElement.parentElement.lastElementChild.textContent);
    
    //Showalert
    ui.showAlert('Task deleted sucessfully!','deleted task can not be restored','success');

    e.preventDefault();
})

