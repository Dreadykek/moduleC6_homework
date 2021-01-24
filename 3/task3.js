const wsUri = "wss://echo.websocket.org/";

const input = document.getElementById("input");
const btnOpen = document.querySelector('.j-btn-connect');
const btnGeo = document.querySelector('.j-btn-geo');
const btnSend = document.querySelector('.j-btn-send');
const output = document.getElementById("output");

let websocket;
let flag = true;

function writeToScreen(message) {
	let div = document.createElement("div");
	let pre = document.createElement("p");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = message;
	
	if (flag){
		div.style = "align-self: flex-end;";
	} else {
		div.style = "align-self: flex-start;";
	}
	div.classList.add("message-area-items");
	div.appendChild(pre);
	output.appendChild(div);
}

btnOpen.addEventListener('click', () => {
	flag = false;
	writeToScreen("Дождитесь подключения к серверу")
	btnSend.style.display = "block";
	btnGeo.style.display = "block";
	btnSend.style = "width: 45%";
	btnGeo.style = "width: 45%";
	btnOpen.style.display = "none";
	websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) {
		flag = false;
		writeToScreen("CONNECTED");
	};
	websocket.onclose = function(evt) {
		flag=false;
		writeToScreen("DISCONNECTED");
	};
	websocket.onmessage = function(evt) {
		flag = false;
		console.log(evt.data);
		if (!(evt.data.includes('</a>'))){
			writeToScreen(evt.data);
		}
	};
	websocket.onerror = function(evt) {
		flag= false;
		writeToScreen(
			'<span style="color: red;">ERROR:</span> ' + evt.data
		);
  	};
});

btnSend.addEventListener('click', () => {
	
	const input = document.getElementById("input");
	console.log(input.value);
	flag = true;
  	writeToScreen(input.value);
  	websocket.send(input.value);
});

const error = () => {
	writeToScreen('Невозможно получить ваше местоположение');
}

const success = (position) => {
	console.log('position', position);
	const latitude  = position.coords.latitude;
	const longitude = position.coords.longitude;
	flag = true;
	let text = "<a href=" + `\"https://www.openstreetmap.org/#map=19/${latitude}/${longitude}\"`+">Гео-локация</a>";
	writeToScreen(text);
	websocket.send(text);
}

btnGeo.addEventListener('click', ()=>{
	if (!navigator.geolocation) {
		flag= false;
		writeToScreen('Geolocation не поддерживается вашим браузером');
	} else {
		flag = false;
		writeToScreen('Определение местоположения…');
		navigator.geolocation.getCurrentPosition(success, error);
	}
});