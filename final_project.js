const API=(()=>{
    const url="http://localhost:3000/events";

    const getTimeEvent = () => {
        return fetch(URL).then((res) => res.json());
    };

    const postTimeEvent = (newTodo) => {
        return fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
        }).then((res) => res.json());
    };

    const removeTimeEvent = (id) => {
        return fetch(`${URL}/${id}`, {
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

}

class TimeEventView{

}

class TimeEventController{

}
