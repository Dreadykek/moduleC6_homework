const btnNode = document.querySelector(".j-btn");

btnNode.addEventListener('click', ()=>{
	let width = window.screen.width;
	let height = window.screen.height;
	window.alert(`Длинна экрана - ${width}, ширина экрана - ${height}`);
});