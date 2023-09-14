

export class LocalStorageUtils {

  //criando um array que receberá as informações de cada user
  static load() {
    const entries = JSON.parse(localStorage
      .getItem('@github-favorites:')) || [];


    return entries;
  }

  //salvando o array contendo os dados do usuário no localStorage
  static save(entries) {
    localStorage.setItem('@github-favorites:', JSON.stringify(entries));
  }
}