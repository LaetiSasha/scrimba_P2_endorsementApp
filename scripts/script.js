import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
	getDatabase,
	ref,
	set,
	child,
	get,
	update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
	databaseURL:
		"https://soloprojectdb-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const inputField = document.getElementById("endorsment");
const fromField = document.getElementById("from");
const toField = document.getElementById("to");
const addBtn = document.getElementById("publishBtn");
const endorsmentsContainer = document.getElementById("container");
const dbRef = ref(getDatabase());

let result = [];

// We clear our input fields.
function clearInputField() {
	inputField.value = "";
	fromField.value = "";
	toField.value = "";
}

// We clear our DOM to refresh the datas.
function clearInputEl() {
	endorsmentsContainer.innerHTML = "";
}

// We get the datas from our Db.
async function datasArray() {
	await get(child(dbRef, `newEndorsment/`))
		.then(async (snapshot) => {
			if (snapshot.exists()) {
				await snapshot.forEach((element) => {
					result.push(element.val());
				});
			} else {
				console.log("No data available");
			}
		})
		.catch((error) => {
			console.error(error);
		});
	return result;
}

// We display the datas from the dB
async function displayDatas() {
	await datasArray();
	if (result) {
		for (let i = 0; i < result.length; i++) {
			appendEndorsment(
				result[i].endorsment,
				result[i].from,
				result[i].to,
				result[i].like,
				i
			);
		}
	}
}
// Display our datas on first loading
await displayDatas();

// We write our inputs into our Db as an object. We use id as a unique key.
function writeUserData() {
	set(ref(database, "newEndorsment/" + result.length), {
		endorsment: inputField.value,
		from: fromField.value,
		to: toField.value,
		like: 0,
	});
}

// We listen for a click on the "Publish" button.
addBtn.addEventListener("click", function () {
	writeUserData(inputField, fromField, toField);
	clearInputEl();
	clearInputField();
	result = [];
	displayDatas();
	return result;
});

// Update Db, increase Like counter
function increaseLike(id, value) {
	update(ref(database, "newEndorsment/" + id), {
		like: value,
	});
}

// We use the datas received from our Db to insert some HTML.
function appendEndorsment(inputEn, inputFrom, inputTo, inputLike, idLike) {
	endorsmentsContainer.innerHTML += `<div class="endorsment">
                                        <h4>${inputFrom}</h4>
                                        <p>${inputEn}</p>
                                            <div class="endorsment__bottom">
                                                <h4>${inputTo}</h4>
                                                <div class="endorsment__bottom--like">
                                                    <i id="${idLike}" class="fa-regular fa-heart likeEndorsment"></i>
                                                    <p class="counter${idLike}">${inputLike}</p>
                                                </div>
                                            </div>
                                        </div>`;

	// We select our heart icon and add a listener to increment our like counter.
	const likeCounter = document.querySelectorAll(".likeEndorsment");
	likeCounter.forEach((element) => {
		element.addEventListener("click", function () {
			let id = element.id,
				value = parseFloat(
					document.querySelector(".counter" + element.id).innerHTML
				);
			value++;
			increaseLike(id, value);
			clearInputEl();
			clearInputField();
			result = [];
			displayDatas();
			return result;
		});
	});
}
