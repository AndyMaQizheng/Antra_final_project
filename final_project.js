const API=(()=>{
    const url="http://localhost:3000/events";

    const getTimeEvent = () => {
        return fetch(url).then((res) => res.json());
    };

    const postTimeEvent = (newTodo) => {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
        }).then((res) => res.json());
    };

    const removeTimeEvent = (id) => {
        return fetch(`${url}/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .catch(console.log);
    };

    return {
        getTimeEvent,
        postTimeEvent,
        removeTimeEvent,
    };
})();

class TimeEventModel{
    #time;
    constructor() {
        this.#time=[];
    }

    fetchEvent(){
        return API.getTimeEvent().then(times=>{
            this.setTime(times);
            return times;
        })
    }

    setTime(times) {
        this.#time=times;
    }

    getTime() {
        return this.#time;
    }

    //{task:"task"}
    addTime(newTime) {
        return API.postTimeEvent(newTime).then((newTime) => {
            this.#time.push(newTime);
            return newTime;
        });
    }

    removeTime(id) {
        return API.removeTimeEvent(id).then((removedTime) => {
            this.#time = this.#time.filter((Time) => Time.id !== +id);

            return removedTime;
        });
    }
}

class TimeEventView{
    constructor() {
        this.timeForm = document.querySelector(".timeEvent__form");
        this.timeInput = document.querySelector(".time-list-app__input");
        this.timeStart=document.querySelector(".time-list-app__start");
        this.timeend=document.querySelector(".time-list-app__end");
        this.timeList = document.querySelector(".timeEvent_list");
        this.timeForm.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }
    renderTimes(times) {
        this.timeList.textContent = "";
        times.forEach((time) => {
            this.appendTime(time);
        });
/*        let timesInnerHTML;
        timesInnerHTML = times
            .map((time) => {
                return this.appendTime(time);
            })
            .join("");

         this.timeList.innerHTML = timesInnerHTML;*/
    }

    removeTimeElem(domID){
        const element = document.getElementById(domID);
        element.remove()
    }
    appendTime(time){
    const timeElem = document.createElement("div");
    timeElem.classList.add("div-table-row");
    timeElem.setAttribute("id", "time"+time.id);

   const timeTable=document.querySelector("table");
   timeTable.classList.add("time-table");

   const timeTr=document.querySelector("tr");
   timeTr.classList.add("time-tr");

   const timeTd=document.querySelector("td");
   timeTd.classList.add("time-td-name");

   const timeTd2=document.querySelector("td");
   timeTd2.classList.add("time-td-start");

   const timeTd3=document.querySelector("td");
   timeTd3.classList.add("time-td-end");

   const timeTd4=document.querySelector("td");
   timeTd4.classList.add("time-td-bth");

   const timeTaskElem = document.createElement("div");
   timeTaskElem.classList.add("div-table-col_task");
   timeTaskElem.textContent =time.eventName;

   const timeStartElem = document.createElement("div");
   timeStartElem.classList.add("div-table-col_start");
   timeStartElem.textContent =time.startDate;

   const timeEndElem = document.createElement("div");
   timeEndElem.classList.add("div-table-col_end");
   timeEndElem.textContent =time.endDate;

   const timeActions = document.createElement("div");
   timeActions.classList.add("timeevent_actions");

   const editTime = document.createElement("button");
   editTime.textContent = "EDIT";
   editTime.classList.add("time__btn-edit");
   const deleteTime = document.createElement("button");
   deleteTime.textContent = "DELETE";
   deleteTime.classList.add("time__btn-delete");

   timeActions.append(editTime, deleteTime);

   timeTd.append(timeTaskElem);
   timeTd2.append(timeStartElem);
   timeTd3.append(timeEndElem);
   timeTd4.append(timeActions);

   timeTr.append(timeTd,timeTd2,timeTd3,timeTd4);
   timeTable.append(timeTr);

   timeElem.append(timeTable);
   this.timeList.append(timeElem);
/*        return `<div class="div-table-row" id="${time.id}">
                  <table class="time-table">
                    <tr class="time-tr">
                        <td class="time-td-name">
                            <div class="div-table-col_task">${time.eventName}</div>
                        </td>
                        <td class="time-td-start">
                            <div class="div-table-col_start">${time.startDate}</div>
                        </td>
                        <td class="time-td-end">
                            <div class="div-table-col_end">${time.endDate}</div>
                        </td>
                        <td class="time-td-bth">
                            <div class="timeevent_actions">
                                <button class="time__btn-edit" >EDIT</button>
                                <button class="time__btn-delete">DELETE</button>
                            </div>
                        </td>
                    </tr>
                  </table>
        </div>`*/
    }


}

class TimeEventController{
    constructor(view, model) {
        this.view=view;
        this.model=model;
        this.initialize();
    }

    initialize() {
        this.model.fetchEvent();
        this.setUpEvents();
        this.model.fetchEvent().then(times=>{
            this.view.renderTimes(times);
        })
    }

    setUpEvents() {
        this.setUpFormEvent();
        this.setUpRemoveEvent();
    }

    setUpFormEvent() {
        this.view.timeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputValue = this.view.timeInput.value;
            const startvalue=this.view.timeStart.value;
            const endvalue=this.view.timeend.value;
            this.model
                .addTime({
                    eventName: inputValue,
                    startDate:startvalue,
                    endDate:endvalue,
                })
                .then((data) => {
                    this.view.appendTime(data);
                });
        });
    }

    setUpRemoveEvent() {
        this.view.timeList.addEventListener("click",(e)=>{
            e.preventDefault();
            if (e.target.classList.contains("time__btn-delete")){
                const domID = e.target.parentNode.parentNode.getAttribute("id");
                const id = domID.substring(4);
                console.log(id);
                this.model.removeTime(id).then((data) => {
                    this.view.removeTimeElem(domID)
                });
            }
        })
    }
}

const timemodel=new TimeEventModel();
const timeview=new TimeEventView();
const timecontroller=new TimeEventController(timeview, timemodel);
