const turn_message = document.querySelector(".turn-message");
const active_player = document.querySelector("tr.active > td > div")
turn_message.innerText = active_player.innerText + ", твой ход!";
// turn_message.innerText = "ghbdtn ghbdtn ghbdtn ghbdtnghbdtn твой ход!";



function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


  const btnStartElement = document.querySelector('[data-action="start"]');
  const btnPauseElement = document.querySelector('[data-action="pause"]');
  const minutes = document.querySelector('.minutes');
  const seconds = document.querySelector('.seconds');
  let timerTime = 0;
  let interval;
  let pauseTime = 0;
  let isRunning = false;
  let isPaused = false;

  const start = () => {
    isRunning = true;
    interval = setInterval(incrementTimer, 1000);
    btnStartElement.innerText = 'Закончить ход';
    btnStartElement.classList.remove('btn-success');
    btnStartElement.classList.add('btn-danger');
  }

  const pause = () => {
    if (isRunning) {
      isRunning = false;
      isPaused = true;
      clearInterval(interval);
      pauseTime = timerTime;
      btnPauseElement.innerText = 'Продолжить\nход';
    } else if (timerTime != 0) {
      isRunning = true;
      interval = setInterval(incrementTimer, 1000);
      btnPauseElement.innerText = 'Пауза';
    }
  }

  const pad = (number) => {
    return (number < 10) ? '0' + number : number;
  }

  const incrementTimer = () => {
    timerTime++;
    const numberMinutes = Math.floor(timerTime / 60);
    const numberSeconds = timerTime % 60;
    minutes.innerText = pad(numberMinutes);
    seconds.innerText = pad(numberSeconds);
  }

btnStartElement.addEventListener('click', () => {
  if (isRunning || isPaused) {
    isRunning = false;
    isPaused = false;
    clearInterval(interval);
    btnPauseElement.innerText = 'Пауза';
    console.log(`Total time elapsed: ${timerTime} seconds`);

    // sending data with player and his turn duration
    const active_player = document.querySelector("tr.active > td > div").id;
    var context = {
        player_id: active_player,
        turn_duration: timerTime,
    }
    data = JSON.stringify(context)

    // Get the current URL
    const currentURL = window.location.href;
    const parts = currentURL.split('/');
    const pk = parts[parts.length - 2];
    url_to_post = '/game-page/'+pk+'/'

    fetch(url_to_post, { // it should send to this site, like a <form method="post" acction=""> does
        method: 'POST',
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: data
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json(); // Process response data if needed
    })
    .then(data => {
        console.log(data);

        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var value = data[key];
            // console.log(key);
            // console.log(value['last_move_duration']);
            // console.log(value['total_moves_duration']);

            const player_div = document.getElementById(key);
            console.log("player_div:" + player_div)

            if (!player_div) {
              continue
            }
            const pl_last_time = player_div.parentElement.nextElementSibling.querySelector("div.last-time");
            const pl_total_time = pl_last_time.parentElement.nextElementSibling.querySelector("div.total-time");
            if (pl_last_time) {
              pl_last_time.innerText = value['last_move_duration'];
            }
            if (pl_total_time) {
              pl_total_time.innerText = value['total_moves_duration'];
            }

            // console.log(key['last_move_duration'] + ': ' + value);
            // console.log(key['total_moves_duration'] + ': ' + value);
          }
        }

        // Find div with class 'active' and remove the class
        const activeDiv = document.querySelector('tr.active');
        if (activeDiv) {
          activeDiv.classList.remove('active');
        }

        // Find div with id '25' and add class 'active'
        const div_with_active_player = document.getElementById(data['next_player']);
        const active_tr = div_with_active_player.closest('tr')
        if (active_tr) {
          active_tr.classList.add('active');
        }

        const turn_message = document.querySelector(".turn-message");
        turn_message.innerText = div_with_active_player.innerText + ", твой ход!";


        console.log(data) // Write 'ok' to the console once response is received
        // You can perform actions with the response data here if needed
    })
    .catch(error => {
        console.error('There was a problem with the fetch request:', error);
    }); 

    const service_message = document.querySelector(".service-message");
    service_message.innerText = "";
    console.log('Service message must be clear now')
    minutes.innerText = '00';
    seconds.innerText = '00';
    timerTime = 0;
    pauseTime = 0;
    btnStartElement.innerText = 'Начать ход';
    btnStartElement.classList.remove('btn-danger');
    btnStartElement.classList.add('btn-success');
    
  } else {
    start();
  }
});

function finish_game() {
  if (timerTime == 0) {
    send_finish_request()
  }
  else {
    const service_message = document.querySelector(".service-message");
    service_message.innerText = "чтобы закончить игру заверши свой ход";
    console.log('please finish your move first');
  }
};

function send_finish_request() {

  // Get the current URL
  const currentURL = window.location.href;
  const parts = currentURL.split('/');
  const pk = parts[parts.length - 2];
  url_to_post = '/game-page/'+pk+'/'

  var context = {
    finish_the_game: 1
  }
  data = JSON.stringify(context)

  fetch(url_to_post, { // it should send to this site, like a <form method="post" acction=""> does
    method: 'POST',
    headers: {
        "X-CSRFToken": getCookie("csrftoken")
    },
    body: data
  })
  .then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json(); // Process response data if needed
  })
  .then(data => {
    console.log('data is sent');
    // Redirect to another URL
    window.location.href = data['redirect'];
  })
  .catch(error => {
    console.error('There was a problem with the fetch request:', error);
  }); 
}



btnPauseElement.addEventListener('click', pause);

const btnFinishElement = document.querySelector('[data-action="finish"]');
btnFinishElement.addEventListener('click', finish_game);