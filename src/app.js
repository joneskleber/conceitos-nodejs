const express = require("express");
const cors = require("cors");

//const { v4: uuid } = require('uuid');
const { v4: uuidv4 } = require('uuid'); 


const app = express();

app.use(express.json());
app.use(cors());

// Vetor é reinicializado toda vez que o servidor reinicia
const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json (repositories);

});

// router to create repository
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes:0,  // O like sempre deve iniciar com zero ao criar o repositório
  };

  repositories.push(repository);

  return response.json(repository);    
  
});

// router to update repository
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  // na alteração o like não pode ser alterado manualmente

  // cria a variável repositoryIndex que irá conter o conteúdo retornado da busca dentro do array
  // diferente do find o findindex retorna a posição dentro do vetor
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);


  // verifica se retornou algum erro
  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'Repository not found.'})
      
      /**
       * Se o repositório informado não for encontrado será retornar um numero menor de 0;
       * para informar ao browse que foi retornado um erro é preciso enviar o status que começa com 
       * 4xx para eviar que o retorno seja 200. Dessa forma o browser reconhecerá como um erro.
       */
  }
  
  // pega o conteúdo do likes antes de alterar para atribuir o mesmo conteúdo
  var likes = repositories[repositoryIndex].likes;
  
  const repository = {
      id,
      title,
      url,
      techs,
      likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

// router to delete repository
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  // cria a variável repositoryIndex que irá conter o conteúdo retornado da busca dentro do array
  const repositorytIndex = repositories.findIndex(repository => repository.id === id);

  if (repositorytIndex < 0){
        return response.status(400).json({ error: 'Repository not found.'});

  };

  // remove do array o conteúdo localizado
  repositories.splice(repositorytIndex, 1);

  // utiliza o 204 quando o array estiver vazio
  return response.status(204).send();

});

// router to update likes repository
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.'});
  }
  repository.likes ++;
  
  return response.json(repository);  
});

module.exports = app;
