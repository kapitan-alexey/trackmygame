const turn_message = document.querySelector(".turn-message");
const active_player = document.querySelector("tr.active > td > div")

const finish_your_move = document.getElementById('finish-move').innerText
const start_move = document.getElementById('start-move').innerText
const transfer_move = document.getElementById('transfer-move').innerText
const time_is_up = document.getElementById('time-is-up').innerText
const pause_move = document.getElementById('pause-move').innerText
const your_move = document.getElementById('your-move').innerText
const finish_the_move = document.getElementById('finish-your-move').innerText
const continue_move = document.getElementById('continue-move').innerText

turn_message.innerText = active_player.innerText + ", " + your_move;

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
    btnStartElement.innerText = finish_the_move;
    btnStartElement.classList.remove('btn-success');
    btnStartElement.classList.add('btn-danger');
  }

  const pause = () => {
    if (isRunning) {
      isRunning = false;
      isPaused = true;
      clearInterval(interval);
      pauseTime = timerTimeDown;
      btnPauseElement.innerText = continue_move;
    } else if (timerTime != 0) {
      isRunning = true;
      interval = setInterval(incrementTimer, 1000);
      btnPauseElement.innerText = pause_move;
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
      service_message.innerText = time_is_up;
    }
    const numberMinutes = Math.floor(timerTimeDown / 60);
    const numberSeconds = timerTimeDown % 60;
    minutes.innerText = pad(numberMinutes);
    seconds.innerText = pad(numberSeconds);
  }

btnStartElement.addEventListener('click', () => {

  const button_random = document.querySelector('.button-random');
  if (button_random) {
  button_random.classList.remove('button-random');
  button_random.classList.add('hidden');
  }

  if (isRunning || isPaused) {
    isRunning = false;
    isPaused = false;
    clearInterval(interval);
    btnPauseElement.innerText = pause_move;

    // sending data with player and his turn duration
    const active_player = document.querySelector("tr.active > td > div").id;
    var context = {
        player_id: active_player,
        turn_duration: timerTime,
    }
    data = JSON.stringify(context)

    // Get the current URL
    const currentURL = window.location.href;
    url_to_post = currentURL

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
        turn_message.innerText = div_with_active_player.innerText + ", " + your_move;

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
    btnStartElement.innerText = start_move;
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
      service_message.innerText = transfer_move;
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
    turn_message.innerText = active_player.innerText + ", " + your_move;
  }
  });
});

function random_player() {

  const random_btn = document.getElementById("random-btn");
  random_btn.disabled = true;
  random_btn.classList.remove('button-random');
  random_btn.classList.add('button-random-inactive');

  const players = document.querySelectorAll('tr.pl-row');
  let i = 0;
  function addActiveClass() {
    if (i < players.length) {
      players[i].classList.add('active');
      i++;
      setTimeout(addActiveClass, 100); // wait for 1 second before next iteration
    }
  }
  addActiveClass();

  const players_count = document.querySelectorAll("tr.pl-row").length

  setTimeout(() => {
    for (let i = 1; i < document.querySelectorAll("tr.active").length; i++) {

      setTimeout(() => {
      let players_active = document.querySelectorAll("tr.active");
      const deactivate_player = players_active[Math.floor(Math.random() * players_active.length)];
      deactivate_player.classList.remove("active");
      console.log('deactivated');
    }, i * 500);
  
    setTimeout(() => {
      const start_player = document.querySelector("tr.active > td > div")
      turn_message.innerText = start_player.innerText + ", " + your_move;
    }, (document.querySelectorAll("tr.active").length - 1) * 500);

    setTimeout(() => {
      const divElement = document.querySelector(".active");
      const originalColor = divElement.style.backgroundColor;
      // Change the background color to red with a smooth transition
      divElement.style.transition = "background-color 1s ease-in-out";
      divElement.style.backgroundColor = "#2EA44F";
    }, (document.querySelectorAll("tr.active").length - 1) * 500 + 300);

    setTimeout(() => {
      const divElement = document.querySelector(".active");
      divElement.style.backgroundColor = "";
    }, (document.querySelectorAll("tr.active").length - 1) * 500 + 1500);
    
    setTimeout(() => {
      const trs = document.querySelectorAll("tr.pl-row");
      trs.forEach(tr => {
        tr.style.transition = "";
        tr.style.backgroundColor = "";
      });
      random_btn.classList.add('button-random');
      random_btn.classList.remove('button-random-inactive');
      random_btn.disabled = false;
    }, (document.querySelectorAll("tr.active").length - 1) * 500 + 2500);
  
      
  }
  }, players_count * 100)
  // }, 500)
  
}

const button_random = document.querySelector('.button-random');
button_random.addEventListener('click', () => {
  random_player()
});



function finish_game() {
  if (timerTime == 0) {
    send_finish_request()
  }
  else {
    const service_message = document.querySelector(".service-message");
    service_message.innerText = finish_your_move;
  }
};

function send_finish_request() {

  // Get the current URL
  const currentURL = window.location.href;
  url_to_post = currentURL

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
    const currentURL = window.location.href;
    const new_url = currentURL.replace('game-page', 'game-results');
    window.location.href = new_url;
  })
  .catch(error => {
    console.error('There was a problem with the fetch request:', error);
  }); 
}

const FinishGameButton = document.getElementById('finish-game');
  const overlay = document.getElementById('overlay');
  const yesButton = document.getElementById('yes-button');
  const noButton = document.getElementById('no-button');

  FinishGameButton.addEventListener('click', () => {

    if (timerTime == 0) {
      overlay.style.display = 'flex';
    }
    else {
      const service_message = document.querySelector(".service-message");
      service_message.innerText = finish_your_move;
    }      
  });

  yesButton.addEventListener('click', () => {
      send_finish_request()
  });

  noButton.addEventListener('click', () => {
      overlay.style.display = 'none';
  });



btnPauseElement.addEventListener('click', pause);

const btnFinishElement = document.querySelector('[data-action="finish"]');
// btnFinishElement.addEventListener('click', finish_game);