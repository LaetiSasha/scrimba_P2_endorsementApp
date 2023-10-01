import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
	getDatabase,
	ref,
	push,
	onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
	databaseURL:
		"https://soloprojectdb-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsmentInDB = ref(database, "newEndorsment");
const inputField = document.getElementById("endorsment");
const container = document.getElementById("container");
const addBtn = document.getElementById("publishBtn");

function clearInputField() {
	inputField.value = "";
}

function clearContainer() {
	container.innerHTML = ``;
}

clearInputField();

addBtn.addEventListener("click", function () {
	let inputValue = inputField.value;
	push(endorsmentInDB, inputValue);
	console.log(inputValue);
	clearInputField();
});

function appendNewEndorsment(newEndorsment) {
	if (newEndorsment) {
		container.innerHTML += `<div class="endorsment"><p>${newEndorsment}</p></div>`;
	} else {
		console.log("DB is empty");
	}
}

onValue(endorsmentInDB, function (snapshot) {
	if (snapshot.exists()) {
		let itemArray = Object.values(snapshot.val());
		clearContainer();
		for (let i = 0; i < itemArray.length; i++) {
			appendNewEndorsment(itemArray[i]);
			console.log(itemArray);
		}
	} else {
		console.log("DB is empty");
	}
});
