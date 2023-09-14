import { GitHubUser } from "./GitHubUser.js";
import { LocalStorageUtils as storage } from "./LocalStorageUtils.js";



// class que irá contar a lógica dos dados
//Como os dados serão estruturados
export class Favorites {


  constructor(root) {
    this.root = document.querySelector(root);
    this.entries = storage.load();

  }




  //verificar se a tabela está vazia e imprimir a mensagem 

  verify() {
    let watch = document.getElementById("empty");
    let tbody = document.querySelector("tbody");

    if (this.entries.length == 0) {
      watch.style.display = 'flex';
      tbody.style.height = "0"
      console.log("flex");
    }
    else {
      tbody.style.height = "60rem"
      watch.style.display = 'none';
    }
  }



  //que irá receber o username e retornar os dados do mesmo na API
  async add(username) {

    try {

      const userExists = this.entries.find(user => user.login === username);

      if (userExists) {
        throw new Error("Usuário já adicionado!!!");
      }
      const user = await GitHubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!!");
      };


      //adicionando as informações do usuário no array
      this.entries = [user, ...this.entries];
      this.update();
      storage.save(this.entries);
    }
    catch (error) {
      alert(error.message);
    }


  }


  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login);

    this.entries = filteredEntries;

    this.update();
    storage.save(this.entries);


  }
};


// Classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();

  }


  //metodo que recebe o username do usuário digitado
  onadd() {

    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {

      //pegando o valor da caixa de texto
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    }

  }


  update() {

    this.romveAllTr();


    // adicionando os users ao elemento HTML
    this.entries.forEach(user => {
      const row = this.createRow();


      //adicionando nos elementos html
      row.querySelector(".user img").src = user.avatar_url;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOK = confirm("Tem certeza que deseja deletar essa linha?");

        if (isOK) {
          this.delete(user);
        }
      }

      this.tbody.append(row);
    });

    this.verify();




  }

  createRow() {

    const tr = document.createElement('tr');


    const inner = `
    <td class="user">
      <img src="https://github.com/maykbrito.png" alt="Imagem de perfil">

      <a href="https://github.com/maykbrito" target="_blank">

        <p>Mayk Brito</p>
        <span>maykbrito</span>
      </a>
    </td>
    <td class="repositories">
      76
    </td>
    <td class="followers">
      9589
    </td>
    <td>
      <button class="remove">Remover</button>
    </td>
 
      `

    tr.innerHTML = inner;

    return tr;
  }

  romveAllTr() {
    this.tbody.querySelectorAll("tr")
      .forEach(
        (tr) => {
          tr.remove();
        }
      )
  }



};