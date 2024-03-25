import axios from "axios";
import { Reload } from "../types";
import { MakeRequest } from "./http.request";
const places: NodeListOf<HTMLDivElement> = document.querySelectorAll(".tasks");
const http = new MakeRequest()

let trash = document.querySelector('.trash') as HTMLDivElement
export function reload({ arr, places }: Reload) {
	places.forEach((el) => (el.innerHTML = ""));

	for (let item of arr) {
		const div = document.createElement("div");
		const title = document.createElement("span");
		const description = document.createElement("p");

		div.classList.add("item");
		div.dataset.id = item.id
		div.draggable = true;
		title.innerHTML = item.title;
		description.innerHTML = item.description;

		div.append(title, description);
		places[item.status - 1].append(div);

		div.ondragstart = () => {
			div.classList.add("hold");
            div.id = "selected"
			setTimeout(() => {
				div.classList.add("invisible");
			}, 0);
			
			trash?.classList.add('trash_active')
		};
		div.ondragend = () => {
			div.classList.remove("hold");
			div.classList.remove("invisible");
            div.removeAttribute('id')
			
			trash?.classList.remove('trash_active')
		};
		let selected:any = null 

		trash.ondragenter = () => {
			selected = document.querySelector('#selected') as HTMLDivElement
			trash.style.border = "2.5px dashed #0d72ed";
		};
		trash.ondragover = (e) => {
			e.preventDefault();
		};
		trash.ondragleave = () => {
			trash.style.border = "2.5px solid rgb(220, 27, 27)";
		};

		trash.ondrop = () => {
			console.log(selected.dataset.id);
			
			http.deleteData('/tasks/' + selected.dataset.id)
				.finally(() => {
					location.reload()
				})
		}
	}
}

for (let place of places) {
    let parent = place.parentElement as HTMLDivElement
	let status = parent.dataset.status as string

	parent.ondragenter = () => {
		parent.style.border = "2px dashed black";
	};
	parent.ondragover = (e) => {
		e.preventDefault();
	};
	parent.ondragleave = () => {
		parent.style.border = "none";
	};
	parent.ondrop = () => {
        parent.style.border = "none";
        let selected = document.getElementById('selected') as HTMLDivElement
        selected.id = ""

		let id = selected.dataset.id

		http.patchData('/tasks/' + id, {status})
			.then(() => console.log('success'))
			
		place.append(selected)
	};
}

