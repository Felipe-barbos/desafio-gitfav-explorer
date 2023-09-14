//comunicando com a API GITHUB 

export class GitHubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`


    //capturando as informações da API
    return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, avatar_url, public_repos, followers }) => ({
        login,
        name,
        avatar_url,
        public_repos,
        followers,
      }));
  }
}