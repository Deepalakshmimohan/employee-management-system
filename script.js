// Employee "class" mirrors the OOP idea from the Java project
class Employee {
  constructor(id, name, role){ this.id = id; this.name = name; this.role = role; }
}
class EmployeeManager {
  #items = []; #next = 1;
  create(name, role){ const e = new Employee(this.#next++, name, role); this.#items.push(e); return e; }
  all(){ return [...this.#items]; }
  find(id){ return this.#items.find(e => e.id === id); }
  update(id, name, role){ const e = this.find(id); if(e){ e.name = name; e.role = role; } }
  remove(id){ this.#items = this.#items.filter(e => e.id !== id); }
}

const mgr = new EmployeeManager();
mgr.create("Priya Raman", "Backend Developer");
mgr.create("Arjun Mehta", "QA Engineer");

const $ = id => document.getElementById(id);
const form = $("form"), nameIn = $("name"), roleIn = $("role"), list = $("list");
let editingId = null;

function render(){
  list.replaceChildren();
  const items = mgr.all();
  if(!items.length){
    const d = document.createElement("li");
    d.className = "empty"; d.textContent = "No employees yet. Add the first record above.";
    list.append(d);
  }
  items.forEach(e => {
    const li = document.createElement("li");
    const av = Object.assign(document.createElement("div"), {className:"av", textContent:e.name.trim()[0].toUpperCase()});
    const info = document.createElement("div"); info.className = "info";
    const b = Object.assign(document.createElement("b"), {textContent:e.name});
    const s = Object.assign(document.createElement("span"), {textContent:e.role});
    info.append(b, s);
    const edit = Object.assign(document.createElement("button"), {className:"act", textContent:"Edit", type:"button"});
    edit.onclick = () => { editingId = e.id; nameIn.value = e.name; roleIn.value = e.role; $("submit").textContent = "Save"; nameIn.focus(); };
    const del = Object.assign(document.createElement("button"), {className:"act del", textContent:"Delete", type:"button"});
    del.onclick = () => { mgr.remove(e.id); if(editingId === e.id) reset(); render(); };
    li.append(av, info, edit, del);
    list.append(li);
  });
  $("count").textContent = items.length + (items.length === 1 ? " employee record" : " employee records");
}
function reset(){ editingId = null; form.reset(); $("submit").textContent = "Add"; }

form.addEventListener("submit", ev => {
  ev.preventDefault();
  const n = nameIn.value.trim(), r = roleIn.value.trim();
  if(!n || !r) return;
  editingId ? mgr.update(editingId, n, r) : mgr.create(n, r);
  reset(); render();
});
render();
