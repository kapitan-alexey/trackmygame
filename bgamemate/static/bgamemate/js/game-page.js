const turn_message = document.querySelector(".turn-message");
const active_player = document.querySelector("tr.active > td > div")
turn_message.innerText = active_player.innerText + ", твой ход!";


function changeColorToGreen() {
  const timer = document.querySelector('.timer');
  timer.classList.remove('torange');
  timer.classList.remove('tred');
  timer.classList.add('tgreen');
}

function changeColorToOrange() {
  const timer = document.querySelector('.timer');
  timer.classList.remove('tgreen');
  timer.classList.add('torange');
}

function changeColorToRed() {
  const timer = document.querySelector('.timer');
  timer.classList.remove('torange');
  timer.classList.add('tred');
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


  const duration = parseInt(document.getElementById('duration').innerText);
  const btnStartElement = document.querySelector('[data-action="start"]');
  const btnPauseElement = document.querySelector('[data-action="pause"]');
  const minutes = document.querySelector('.minutes');
  const seconds = document.querySelector('.seconds');

  let timerTime = 0;
  let timerTimeDown = parseInt(duration);
  let interval;
  let pauseTime = 0;
  let isRunning = false;
  let isPaused = false;
  let CountUp = false;

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
      pauseTime = timerTimeDown;
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

  const numberMinutes = Math.floor(timerTimeDown / 60);
  const numberSeconds = timerTimeDown % 60;
  minutes.innerText = pad(numberMinutes);
  seconds.innerText = pad(numberSeconds);

  const incrementTimer = () => {
    timerTime++;
    if (CountUp){
      timerTimeDown++;
    }
    else {
      timerTimeDown--;
    }
    if (timerTimeDown == 0) {
      CountUp = true;
    }
    // const duration = parseInt(document.getElementById('duration').innerText);
    // orange_limit = duration - Math.floor(duration/3);
    if (timerTimeDown == 15) {
      changeColorToOrange()
    }
    else if (timerTimeDown == 0) {
      changeColorToRed()
      let minus = document.querySelector('.count-negative');
      minus.classList.remove('hidden');
      const service_message = document.querySelector(".service-message");
      service_message.innerText = "время хода истекло, немедленно делай ход!";
    }
    const numberMinutes = Math.floor(timerTimeDown / 60);
    const numberSeconds = timerTimeDown % 60;
    minutes.innerText = pad(numberMinutes);
    seconds.innerText = pad(numberSeconds);
  }

btnStartElement.addEventListener('click', () => {
  if (isRunning || isPaused) {
    isRunning = false;
    isPaused = false;
    clearInterval(interval);
    btnPauseElement.innerText = 'Пауза';

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
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var value = data[key];

            const player_div = document.getElementById(key);

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

    })
    .catch(error => {
        console.error('There was a problem with the fetch request:', error);
    }); 

    const service_message = document.querySelector(".service-message");
    service_message.innerText = "";

    const numberMinutes = Math.floor(duration / 60);
    const numberSeconds = duration % 60;
    minutes.innerText = pad(numberMinutes);
    seconds.innerText = pad(numberSeconds);

    let minus = document.querySelector('.count-negative');
    minus.classList.add('hidden');
    CountUp = false
    timerTime = 0;
    timerTimeDown = duration;
    pauseTime = 0;
    changeColorToGreen()
    btnStartElement.innerText = 'Начать ход';
    btnStartElement.classList.remove('btn-danger');
    btnStartElement.classList.add('btn-success');
    
  } else {
    start();
  }
});



const names = document.querySelectorAll('.player-block');
names.forEach(name => {
  name.addEventListener('click', () => {

    if (isRunning || isPaused) {
      const service_message = document.querySelector(".service-message");
      service_message.innerText = "сначала заверши ход";
      return
    }
    else {
    const trs = document.querySelectorAll('tr');
    trs.forEach(tr => {
      tr.classList.remove('active');
    });
    const tr = name.closest('tr');
    tr.classList.add('active');
    const active_player = document.querySelector("tr.active > td > div")
    turn_message.innerText = active_player.innerText + ", твой ход!";
  }
  });
});


function finish_game() {
  if (timerTime == 0) {
    send_finish_request()
  }
  else {
    const service_message = document.querySelector(".service-message");
    service_message.innerText = "чтобы закончить игру заверши свой ход";
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