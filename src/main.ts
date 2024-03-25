import { MakeRequest } from "./modules/http.request";
import { reload } from "./modules/ul";
import { Item } from "./types";

const places: NodeListOf<HTMLDivElement> = document.querySelectorAll('.tasks')
const http = new MakeRequest()


http.getData('/tasks')
    .then(res => reload({ arr: res, places }))


const addTaskForm = document.forms.namedItem('add_task') as HTMLFormElement

addTaskForm.onsubmit = (e) => {
    e.preventDefault()

    let fm = new FormData(addTaskForm)
    let task:any = {
        created_at: new Date().toLocaleDateString('uz-UZ'),
        updated_at: new Date().toLocaleDateString('uz-UZ'),
    }

    fm.forEach((val:any, key:any) => {
        task[key] = val
    })

    
    http.postData('/tasks', task)
        .then(res => {
            http.getData('/tasks')
                .then(res => {
                    reload({ arr: res, places })
                    console.log(res);
                    
                }
                )

        })
}

